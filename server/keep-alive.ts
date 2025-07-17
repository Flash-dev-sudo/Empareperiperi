// Keep-alive service to prevent cold starts on Render
import { log } from "./vite";

const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes
const SITE_URL = process.env.RENDER_EXTERNAL_URL || 'https://empareperiperi.onrender.com';

let pingInterval: NodeJS.Timeout | null = null;

export function startKeepAlive() {
  // Only run in production on Render
  if (process.env.NODE_ENV !== 'production' || !process.env.RENDER_EXTERNAL_URL) {
    return;
  }

  log(`Starting keep-alive service for ${SITE_URL}`);

  pingInterval = setInterval(async () => {
    try {
      const response = await fetch(`${SITE_URL}/api/health`, {
        method: 'GET',
        headers: { 'User-Agent': 'Emparo-KeepAlive/1.0' }
      });
      
      if (response.ok) {
        log(`Keep-alive ping successful: ${response.status}`);
      } else {
        log(`Keep-alive ping failed: ${response.status}`);
      }
    } catch (error) {
      log(`Keep-alive ping error: ${error}`);
    }
  }, PING_INTERVAL);
}

export function stopKeepAlive() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    log('Keep-alive service stopped');
  }
}

// Graceful shutdown
process.on('SIGTERM', stopKeepAlive);
process.on('SIGINT', stopKeepAlive);