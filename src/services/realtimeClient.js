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
    this.retryDelay = 5000;
    this.maxRetryDelay = 60000;
    this.consecutiveFailures = 0;
    this.isProbing = false;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (!this.isConnected) {
          this.consecutiveFailures = 0;
          this.init();
        }
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !this.isConnected && !this.eventSource) {
          this.init();
        }
      });
    }

    this.init();
  }

  async checkServerHealth() {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/v1/health', {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timer);
      const contentType = res.headers.get('content-type') || '';
      return res.ok && contentType.includes('application/json');
    } catch {
      return false;
    }
  }

  async init() {
    if (typeof window === 'undefined' || !('EventSource' in window)) {
      return;
    }

    if (this.isProbing || this.isConnected) {
      return;
    }

    this.isProbing = true;

    // Clean up any stale existing instance
    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch (e) {}
      this.eventSource = null;
    }

    // Probe server health first before creating EventSource.
    // If Express backend is offline or Vite proxy returns HTML,
    // this cleanly prevents native EventSource browser abort/MIME-type errors.
    const isServerReady = await this.checkServerHealth();
    this.isProbing = false;

    if (!isServerReady) {
      this.consecutiveFailures++;
      this.scheduleReconnect();
      return;
    }

    try {
      this.eventSource = new EventSource('/api/v1/realtime');

      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.consecutiveFailures = 0;
        this.retryDelay = 5000;
        console.log('[realtimeClient] Connected to JSS Publications SSE event stream.');
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        if (this.eventSource) {
          try {
            this.eventSource.close();
          } catch (e) {}
          this.eventSource = null;
        }
        this.scheduleReconnect();
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
      this.isConnected = false;
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    const delay = Math.min(this.retryDelay * Math.pow(1.5, Math.min(this.consecutiveFailures, 5)), this.maxRetryDelay);
    this.reconnectTimeout = setTimeout(() => {
      this.init();
    }, delay);
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
