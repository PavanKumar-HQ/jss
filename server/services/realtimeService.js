/**
 * Real-Time Synchronization Hub (Server-Sent Events)
 * JSS Publications / Jagadguru Sri Shivarathreeshwara Granthamale
 *
 * Broadcasts operational state mutations (inventory, prices, orders, FAQs)
 * to all connected storefront and admin browser instances in real-time.
 */

class RealtimeService {
  constructor() {
    this.clients = new Set();
    this.startHeartbeat();
  }

  /**
   * Register a new SSE connection
   */
  addClient(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders?.();

    const client = {
      id: `client-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      res,
      connectedAt: new Date().toISOString()
    };

    this.clients.add(client);

    // Initial greeting
    res.write(`event: CONNECTED\ndata: ${JSON.stringify({ clientId: client.id, timestamp: client.connectedAt })}\n\n`);

    req.on('close', () => {
      this.clients.delete(client);
    });
  }

  /**
   * Broadcast an event to all connected clients
   */
  broadcast(eventType, payload) {
    const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const client of this.clients) {
      try {
        client.res.write(message);
      } catch (err) {
        console.error(`[realtime] Failed writing to client ${client.id}:`, err.message);
        this.clients.delete(client);
      }
    }
  }

  /**
   * Heartbeat to prevent timeouts
   */
  startHeartbeat() {
    const timer = setInterval(() => {
      for (const client of this.clients) {
        try {
          client.res.write(': keep-alive ping\n\n');
        } catch {
          this.clients.delete(client);
        }
      }
    }, 25000);
    timer.unref?.();
  }

  getClientCount() {
    return this.clients.size;
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
