/**
 * Authoritative Frontend Real-Time Client (Server-Sent Events)
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Listens for live database-emitted mutations (inventory, prices, orders)
 * and dispatches them to UI subscribers with automatic reconnection.
 */

class RealtimeClient {
  constructor() {
    this.listeners = new Map();
    this.eventSource = null;
    this.isConnected = false;
    this.reconnectTimeout = null;
    this.init();
  }

  init() {
    if (typeof window === 'undefined' || !('EventSource' in window)) {
      return;
    }

    try {
      this.eventSource = new EventSource('/api/v1/realtime');

      this.eventSource.onopen = () => {
        this.isConnected = true;
        console.log('[realtimeClient] Connected to JSS Publications SSE event stream.');
      };

      this.eventSource.onerror = (err) => {
        this.isConnected = false;
        if (this.eventSource.readyState === EventSource.CLOSED) {
          console.warn('[realtimeClient] Stream closed. Attempting reconnect in 4s...');
          this.scheduleReconnect();
        }
      };

      // Listen for operational events
      const events = [
        'INVENTORY_UPDATED',
        'PRICE_CHANGED',
        'BOOK_MUTATED',
        'ORDER_CREATED',
        'ORDER_STATUS_CHANGED',
        'FAQ_MUTATED'
      ];

      events.forEach((eventType) => {
        this.eventSource.addEventListener(eventType, (e) => {
          try {
            const data = JSON.parse(e.data);
            this.emit(eventType, data);
          } catch (err) {
            console.error(`[realtimeClient] Error parsing event "${eventType}":`, err);
          }
        });
      });
    } catch (err) {
      console.warn('[realtimeClient] Failed to initialize EventSource:', err);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      this.init();
    }, 4000);
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  emit(eventType, data) {
    const set = this.listeners.get(eventType);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[realtimeClient] Error in listener for "${eventType}":`, err);
        }
      });
    }
  }
}

export const realtimeClient = new RealtimeClient();
export default realtimeClient;
