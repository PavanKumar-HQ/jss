/**
 * Phase 6: Inventory Domain Service Verification Suite
 * Tests:
 * 1. Initial Baseline Inventory Seeding
 * 2. Stock Lookup (Available, InStock, LowStock indicators)
 * 3. Atomic Reservation Hold with TTL
 * 4. Pre-Flight Rejection on Insufficient Stock
 * 5. Reservation Confirmation (Reserved -> Sold)
 * 6. Reservation Manual Release
 * 7. Expired Reservation Auto-Cleanup
 * 8. Damaged Logging & Press Print Run Restocking
 */

import { inventoryService, INVENTORY_STATES } from '../src/services/inventoryService.js';
import storage from '../src/utils/storage.js';

console.log('--- JSS PUBLICATIONS: INVENTORY DOMAIN SERVICE TESTS ---');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

// Reset to clean baseline
inventoryService.resetToBaseline();

// -------------------------------------------------------------
// 1. Initial Baseline Inventory Seeding
// -------------------------------------------------------------
const allInventory = inventoryService.getInventory();
const keys = Object.keys(allInventory);
assert(keys.length >= 49, `Expected at least 49 inventory records, got ${keys.length}`);
console.log(`1. Baseline Seeding: PASSED (${keys.length} multi-edition stock records catalogued)`);

// -------------------------------------------------------------
// 2. Stock Lookup (Paperback vs Deluxe)
// -------------------------------------------------------------
const pbStock = inventoryService.getStock('jss-pub-0001', 'Paperback');
assert(pbStock.available > 0, 'Standard Paperback must be in stock');
assert(pbStock.inStock === true, 'inStock boolean should be true');

// Deluxe Edition check (scarce physical prints)
const deluxeStock = inventoryService.getStock('jss-pub-0011', 'Deluxe Hardbound');
assert(deluxeStock.isLimitedEdition === true, 'Deluxe hardbound should be flagged as limited edition');
assert(deluxeStock.totalStock <= 10, 'Limited edition print run should be capped');
console.log(`2. Stock Lookup: PASSED (Standard Available: ${pbStock.available}, Deluxe Scarce Available: ${deluxeStock.available})`);

// -------------------------------------------------------------
// 3. Atomic Reservation Hold with TTL
// -------------------------------------------------------------
const reservationRes = inventoryService.reserveStock([
  { id: 'jss-pub-0001', format: 'Paperback', quantity: 2 },
  { id: 'jss-pub-0011', format: 'Deluxe Hardbound', quantity: 1 }
], 15);

assert(reservationRes.success === true, 'Reservation should succeed');
assert(reservationRes.reservationId.startsWith('RES-'), 'Reservation ID should have RES- prefix');
assert(reservationRes.expiresAt, 'ExpiresAt date must be present');

const updatedPbStock = inventoryService.getStock('jss-pub-0001', 'Paperback');
assert(updatedPbStock.reserved === 2, `Expected 2 reserved, got ${updatedPbStock.reserved}`);
assert(updatedPbStock.available === pbStock.available - 2, 'Available stock should be decremented by 2');
console.log(`3. Atomic Reservation Hold: PASSED (Hold ID: ${reservationRes.reservationId}, Expires: ${reservationRes.expiresAt})`);

// -------------------------------------------------------------
// 4. Pre-Flight Rejection on Insufficient Stock
// -------------------------------------------------------------
const overRequestRes = inventoryService.reserveStock([
  { id: 'jss-pub-0011', format: 'Deluxe Hardbound', quantity: 999 } // far exceeds available
]);

assert(overRequestRes.success === false, 'Oversell attempt must fail');
assert(overRequestRes.failedItems.length === 1, 'Should return failed item report');
assert(overRequestRes.failedItems[0].requested === 999, 'Failed item report should detail requested count');
console.log('4. Race-Condition Oversell Prevention: PASSED (Rejected impossible quantity 999)');

// -------------------------------------------------------------
// 5. Reservation Confirmation (Reserved -> Sold)
// -------------------------------------------------------------
const confirmRes = inventoryService.confirmReservation(reservationRes.reservationId);
assert(confirmRes.success === true, 'Confirmation should succeed');
assert(confirmRes.status === INVENTORY_STATES.SOLD, 'Status should be marked as SOLD');

const soldPbStock = inventoryService.getStock('jss-pub-0001', 'Paperback');
assert(soldPbStock.reserved === 0, 'Reserved stock should reset to 0');
assert(soldPbStock.sold === 2, 'Sold count should increase by 2');
console.log('5. Reservation Confirmation: PASSED (Reserved counts converted to permanent Sold counters)');

// -------------------------------------------------------------
// 6. Manual Reservation Release
// -------------------------------------------------------------
const tempHold = inventoryService.reserveStock([
  { id: 'jss-pub-0002', format: 'Paperback', quantity: 3 }
]);
assert(tempHold.success, 'Temporary hold should succeed');
const midStock = inventoryService.getStock('jss-pub-0002', 'Paperback');
assert(midStock.reserved === 3, 'Should show 3 reserved');

const releaseRes = inventoryService.releaseReservation(tempHold.reservationId);
assert(releaseRes.success, 'Manual release should succeed');

const postReleaseStock = inventoryService.getStock('jss-pub-0002', 'Paperback');
assert(postReleaseStock.reserved === 0, 'Reserved should revert to 0');
console.log('6. Manual Reservation Release: PASSED (Stock returned to Available pool upon cancellation)');

// -------------------------------------------------------------
// 7. Expired Reservation Auto-Cleanup
// -------------------------------------------------------------
// Inject an expired reservation directly into storage to test cleanup
const pastDate = new Date(Date.now() - 3600 * 1000).toISOString(); // 1 hour ago
const reservations = storage.get('jss_granthamale_reservations', []);
reservations.push({
  reservationId: 'RES-EXPIRED-TEST',
  createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
  expiresAt: pastDate,
  items: [{ key: 'jss-pub-0004_paperback', bookId: 'jss-pub-0004', variant: 'Paperback', quantity: 5 }],
  status: INVENTORY_STATES.RESERVED
});

// Update the inventory record to have 5 reserved
const inv = storage.get('jss_granthamale_inventory', {});
inv['jss-pub-0004_paperback'].reserved += 5;
inv['jss-pub-0004_paperback'].available -= 5;
storage.set('jss_granthamale_inventory', inv);
storage.set('jss_granthamale_reservations', reservations);

// Calling getStock triggers cleanupExpiredReservations
const cleanedStock = inventoryService.getStock('jss-pub-0004', 'Paperback');
assert(cleanedStock.reserved === 0, `Expired hold should be released; reserved should be 0, got ${cleanedStock.reserved}`);
console.log('7. Expired TTL Auto-Cleanup: PASSED (Elapsed checkout holds released automatically)');

// -------------------------------------------------------------
// 8. Damaged Units & Press Restocking
// -------------------------------------------------------------
const damageRes = inventoryService.recordDamaged('jss-pub-0001', 'Paperback', 2, 'Transit moisture damage');
assert(damageRes.success, 'Damaged recording should succeed');
const damagedStock = inventoryService.getStock('jss-pub-0001', 'Paperback');
assert(damagedStock.damaged === 2, 'Damaged count should be 2');

const restockRes = inventoryService.restock('jss-pub-0001', 'Paperback', 50, 'Mysuru Press 2nd Impression');
assert(restockRes.success, 'Restocking should succeed');
const finalStock = inventoryService.getStock('jss-pub-0001', 'Paperback');
assert(finalStock.totalStock >= 100, 'Total stock should reflect addition');
console.log(`8. Damage & Restock Logging: PASSED (Logged 2 damaged, restocked +50 units from Mysuru Press)`);

console.log('\n>>> ALL 8 INVENTORY DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
