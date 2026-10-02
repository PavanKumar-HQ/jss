/**
 * JSS Publications - Core Domain Contracts & Repository Interfaces
 * 
 * Formal domain models, repository contracts, and state machines
 * designed for database-readiness (SQLite 3, PostgreSQL, Supabase).
 */

// ============================================================================
// 1. ORDER STATE MACHINE
// ============================================================================
export const ORDER_STATES = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUNDED: 'refunded'
};

export const ORDER_TRANSITIONS = {
  [ORDER_STATES.PENDING_PAYMENT]: [ORDER_STATES.CONFIRMED, ORDER_STATES.CANCELLED],
  [ORDER_STATES.CONFIRMED]: [ORDER_STATES.PROCESSING, ORDER_STATES.CANCELLED],
  [ORDER_STATES.PROCESSING]: [ORDER_STATES.PACKED, ORDER_STATES.CANCELLED],
  [ORDER_STATES.PACKED]: [ORDER_STATES.SHIPPED, ORDER_STATES.CANCELLED],
  [ORDER_STATES.SHIPPED]: [ORDER_STATES.DELIVERED, ORDER_STATES.RETURNED],
  [ORDER_STATES.DELIVERED]: [ORDER_STATES.RETURNED],
  [ORDER_STATES.RETURNED]: [ORDER_STATES.REFUNDED],
  [ORDER_STATES.CANCELLED]: [],
  [ORDER_STATES.REFUNDED]: []
};

export function canTransitionOrder(fromState, toState) {
  const allowed = ORDER_TRANSITIONS[fromState];
  return Array.isArray(allowed) && allowed.includes(toState);
}

// ============================================================================
// 2. INVENTORY INVARIANTS
// ============================================================================
export const INVENTORY_TRANSACTION_TYPES = {
  SEEDED: 'SEEDED',
  RESTOCKED: 'RESTOCKED',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  RETURNED: 'RETURNED',
  DAMAGED: 'DAMAGED',
  ADJUSTED: 'ADJUSTED'
};

export function computeAvailableStock(onHand, reserved) {
  const available = (Number(onHand) || 0) - (Number(reserved) || 0);
  return Math.max(0, available);
}

// ============================================================================
// 3. STATUTORY PRICING CONTRACTS (HSN 4901 0% GST)
// ============================================================================
export const PRICING_CONSTANTS = {
  HSN_CODE: '4901',
  GST_RATE_PERCENT: 0,
  FREE_SHIPPING_THRESHOLD: 500,
  BASE_SPEED_POST_RATE: 40,
  MAX_RETAIL_QUANTITY_PER_BOOK: 10
};

// ============================================================================
// 4. ROLE-BASED ACCESS CONTROL (RBAC) PERMISSIONS
// ============================================================================
export const PERMISSIONS = {
  CATALOGUE_READ: 'catalogue.read',
  CATALOGUE_CREATE: 'catalogue.create',
  CATALOGUE_UPDATE: 'catalogue.update',
  CATALOGUE_ARCHIVE: 'catalogue.archive',
  INVENTORY_READ: 'inventory.read',
  INVENTORY_ADJUST: 'inventory.adjust',
  PRICING_READ: 'pricing.read',
  PRICING_UPDATE: 'pricing.update',
  ORDERS_READ: 'orders.read',
  ORDERS_UPDATE: 'orders.update',
  ORDERS_CANCEL: 'orders.cancel',
  REFUNDS_READ: 'refunds.read',
  REFUNDS_PROCESS: 'refunds.process',
  AUDIT_READ: 'audit.read'
};

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  CATALOGUE_EDITOR: [
    PERMISSIONS.CATALOGUE_READ,
    PERMISSIONS.CATALOGUE_CREATE,
    PERMISSIONS.CATALOGUE_UPDATE,
    PERMISSIONS.PRICING_READ
  ],
  DISPATCH_MANAGER: [
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_ADJUST
  ]
};

// ============================================================================
// 5. REPOSITORY INTERFACE SPECIFICATIONS (DOCUMENTED CONTRACTS)
// ============================================================================
/**
 * @interface IProductRepository
 * - getById(id: string): Promise<Product | null>
 * - getBySlug(slug: string): Promise<Product | null>
 * - list(filters?: { category?: string, status?: string, search?: string }): Promise<Product[]>
 * - create(input: CreateProductDTO): Promise<Product>
 * - update(id: string, input: Partial<Product>, expectedVersion?: number): Promise<Product>
 * - updatePrice(id: string, binding: string, newPrice: number, reason: string): Promise<Product>
 * - archive(id: string): Promise<void>
 *
 * @interface IOrderRepository
 * - create(input: CreateOrderDTO, idempotencyKey?: string): Promise<Order>
 * - getById(id: string): Promise<Order | null>
 * - getByReference(reference: string): Promise<Order | null>
 * - list(filters?: { status?: string, search?: string, limit?: number }): Promise<Order[]>
 * - updateStatus(id: string, newStatus: string, details?: { trackingNumber?: string, reason?: string }): Promise<Order>
 *
 * @interface IInventoryRepository
 * - getStock(editionId: string): Promise<InventoryRecord | null>
 * - list(): Promise<InventoryRecord[]>
 * - reserve(sessionId: string, items: Array<{ editionId: string, quantity: number }>): Promise<ReservationResult>
 * - release(sessionId: string, reason: string): Promise<void>
 * - adjust(editionId: string, amount: number, reason: string, actor: string): Promise<InventoryRecord>
 *
 * @interface IPaymentProvider
 * - createIntent(params: { amount: number, orderRef: string, customer: any }): Promise<PaymentIntentResult>
 * - verifyPayment(params: { paymentId: string, orderRef: string }): Promise<PaymentVerificationResult>
 * - processRefund(params: { orderId: string, amount: number, reason: string }): Promise<RefundResult>
 */
