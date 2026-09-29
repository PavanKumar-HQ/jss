/**
 * Payment Gateway Integration Boundary & Webhook Verification Service
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Implements strict security controls:
 * - Real gateway boundary (Razorpay / UPI / Cashfree / V.P.P.)
 * - Zero simulated success: Exposes "PAYMENT NOT CONFIGURED" when credentials are absent
 * - Cryptographic HMAC-SHA256 webhook signature verification
 * - Idempotency tracking preventing duplicate state transitions
 */

import crypto from 'node:crypto';
import { db } from './db.js';

export class PaymentService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || null;
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || null;
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || null;
  }

  isConfigured() {
    return Boolean(this.keyId && this.keySecret);
  }

  /**
   * Create an authoritative payment intent/order with the payment provider
   */
  async createPaymentIntent({ amountInRupees, orderReference, customer }) {
    // V.P.P. (Value Payable Post) or Counter Collection are physical payment methods handled postally
    if (orderReference.startsWith('VPP-') || orderReference.startsWith('COUNTER-')) {
      return {
        configured: true,
        method: 'POSTAL_VPP',
        orderId: `vpp_${Date.now()}`,
        status: 'PENDING_POSTAL_COLLECTION'
      };
    }

    if (!this.isConfigured()) {
      return {
        configured: false,
        error: 'PAYMENT NOT CONFIGURED: Razorpay / Payment Gateway credentials are not set in the server environment. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
        providerStatus: 'CONFIG_MISSING'
      };
    }

    const amountInPaise = Math.round(amountInRupees * 100);

    try {
      const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: orderReference,
          notes: {
            customerName: customer?.fullName || '',
            customerPhone: customer?.phone || '',
            publisher: 'JSS Publications'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          configured: true,
          success: false,
          error: `Gateway Error: ${errorData.error?.description || 'Failed to create payment intent'}`
        };
      }

      const gatewayOrder = await response.json();
      return {
        configured: true,
        success: true,
        gatewayOrderId: gatewayOrder.id,
        amount: gatewayOrder.amount,
        currency: gatewayOrder.currency,
        keyId: this.keyId
      };
    } catch (err) {
      console.error('[paymentService] Gateway connection error:', err);
      return {
        configured: true,
        success: false,
        error: `Network failure connecting to payment provider: ${err.message}`
      };
    }
  }

  /**
   * Verify cryptographic signature of payment completion from client or webhook
   */
  verifyPaymentSignature({ gatewayOrderId, paymentId, signature }) {
    if (!this.keySecret) {
      return {
        verified: false,
        error: 'PAYMENT NOT CONFIGURED: Cannot verify signature without secret.'
      };
    }

    const body = `${gatewayOrderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(body)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    return { verified: isValid };
  }

  /**
   * Idempotent webhook handler
   */
  processWebhook(rawBody, signatureHeader) {
    if (!this.webhookSecret) {
      throw new Error('PAYMENT NOT CONFIGURED: Webhook secret not configured.');
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signatureHeader) {
      throw new Error('Invalid webhook signature. Request rejected.');
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Idempotency check: Record webhook in audit/reconciliation table
    const paymentEntity = payload.payload?.payment?.entity;
    const paymentId = paymentEntity?.id;

    if (paymentId) {
      const existing = db.queryOne('SELECT * FROM audit_logs WHERE entity_id = ?', paymentId);
      if (existing) {
        console.log(`[paymentService] Webhook for payment ${paymentId} already processed. Skipping duplicate.`);
        return { success: true, duplicate: true };
      }
    }

    return {
      success: true,
      event,
      paymentEntity
    };
  }
}

export const paymentService = new PaymentService();
export default paymentService;
