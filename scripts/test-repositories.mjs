/**
 * Test Suite: Repositories, Schema Validation & Idempotency
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 */

import assert from 'node:assert';
import { validator, ValidationError } from '../src/domain/validator.js';
import { productRepository, orderRepository, ORDER_STATES, canTransitionOrder } from '../src/repositories/index.js';

console.log('\n--- JSS PUBLICATIONS: REPOSITORY & VALIDATION DOMAIN TESTS ---');

// 1. PIN Code Validation
assert.strictEqual(validator.validatePin('570004').valid, true, 'Valid Mysuru PIN should pass');
assert.strictEqual(validator.validatePin('070004').valid, false, 'PIN starting with 0 must fail');
assert.strictEqual(validator.validatePin('5700').valid, false, 'Short PIN must fail');
console.log('1. Postal PIN Code Schema Validation: PASSED (6-digit format enforced)');

// 2. Telephone Validation
assert.strictEqual(validator.validatePhone('9876543210').valid, true, 'Valid 10-digit mobile must pass');
assert.strictEqual(validator.validatePhone('1234567890').valid, false, 'Invalid mobile start digit must fail');
console.log('2. Phone Number Schema Validation: PASSED (10-digit format enforced)');

// 3. Order Checkout Payload Validation
const validOrder = {
  customer: { fullName: 'Mahadevaswamy B', phone: '9845012345' },
  shippingAddress: { addressLine: 'JSS Layout', city: 'Mysuru', pincode: '570028' },
  items: [{ id: 'jss-pub-01', quantity: 2 }]
};
assert.doesNotThrow(() => validator.validateCheckoutPayload(validOrder), 'Valid checkout payload must pass');

const invalidOrder = { customer: { fullName: '' }, shippingAddress: {}, items: [] };
assert.throws(() => validator.validateCheckoutPayload(invalidOrder), ValidationError, 'Malformed checkout payload must throw ValidationError');
console.log('3. Checkout Payload Schema Validation: PASSED (Rejects malformed input)');

// 4. Order State Machine Transition Rules
assert.strictEqual(canTransitionOrder(ORDER_STATES.CONFIRMED, ORDER_STATES.PROCESSING), true, 'CONFIRMED -> PROCESSING is legal');
assert.strictEqual(canTransitionOrder(ORDER_STATES.CONFIRMED, ORDER_STATES.DELIVERED), false, 'CONFIRMED -> DELIVERED illegal jump blocked');
assert.strictEqual(canTransitionOrder(ORDER_STATES.CANCELLED, ORDER_STATES.PROCESSING), false, 'CANCELLED -> PROCESSING illegal jump blocked');
console.log('4. Order State Machine Rules: PASSED (Prevents illegal state transitions)');

// 5. Product Repository List and Retrieval
const books = await productRepository.list({ category: 'Vachana Literature' });
assert.ok(Array.isArray(books), 'Should return book array');
assert.ok(books.length > 0, 'Should find Vachana books');
console.log(`5. Product Repository: PASSED (${books.length} Vachana titles retrieved)`);

// 6. Idempotency Key Duplicate Order Suppression
const idempotencyKey = `idemp-${Date.now()}`;
const order1 = await orderRepository.create(validOrder, idempotencyKey);
const order2 = await orderRepository.create(validOrder, idempotencyKey);
assert.strictEqual(order1.orderId, order2.orderId, 'Idempotent calls must return identical order without duplicating');
console.log(`6. Order Idempotency Contract: PASSED (Duplicate submission suppressed, Order ID: ${order1.orderId})`);

console.log('\n>>> ALL 6 REPOSITORY & VALIDATION DOMAIN TESTS PASSED WITH 0 REGRESSIONS! <<<\n');
