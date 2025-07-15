import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertMenuItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication routes with enhanced security
  app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Rate limiting: Track failed attempts
    const failedAttempts = (req.session as any).failedAttempts || 0;
    const lastAttempt = (req.session as any).lastAttempt || 0;
    const now = Date.now();
    
    // Block if too many failed attempts (5 attempts in 15 minutes)
    if (failedAttempts >= 5 && now - lastAttempt < 15 * 60 * 1000) {
      return res.status(429).json({ 
        error: 'Too many failed attempts. Please try again later.' 
      });
    }

    // Check password (stored in environment or fallback)
    const adminPassword = process.env.ADMIN_PASSWORD || 'emparo2025';
    
    if (password === adminPassword) {
      // Reset failed attempts on successful login
      (req.session as any).failedAttempts = 0;
      (req.session as any).adminAuthenticated = true;
      (req.session as any).adminIP = clientIP;
      (req.session as any).loginTime = now;
      
      console.log(`Admin login successful from IP: ${clientIP} at ${new Date().toISOString()}`);
      
      res.json({ success: true });
    } else {
      // Increment failed attempts
      (req.session as any).failedAttempts = failedAttempts + 1;
      (req.session as any).lastAttempt = now;
      
      console.log(`Admin login failed from IP: ${clientIP} at ${new Date().toISOString()}`);
      
      res.status(401).json({ error: 'Invalid password' });
    }
  });

  // Admin logout route
  app.post('/api/admin/logout', (req, res) => {
    (req.session as any).adminAuthenticated = false;
    (req.session as any).adminIP = null;
    (req.session as any).loginTime = null;
    res.json({ success: true });
  });

  // Admin middleware for protecting admin routes
  const adminAuth = (req: any, res: any, next: any) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!(req.session as any).adminAuthenticated) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Check if IP matches login IP (optional extra security)
    if ((req.session as any).adminIP && (req.session as any).adminIP !== clientIP) {
      console.log(`Admin access denied: IP mismatch. Login IP: ${(req.session as any).adminIP}, Current IP: ${clientIP}`);
      return res.status(401).json({ error: 'Access denied: IP mismatch' });
    }
    
    // Check session timeout (2 hours)
    if (Date.now() - (req.session as any).loginTime > 2 * 60 * 60 * 1000) {
      (req.session as any).adminAuthenticated = false;
      return res.status(401).json({ error: 'Session expired' });
    }
    
    next();
  };

  // Menu routes
  app.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin menu management routes (protected)
  app.post("/api/menu", adminAuth, async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(validatedData);
      res.json(menuItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/menu/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedItem = await storage.updateMenuItem(parseInt(id), req.body);
      if (!updatedItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(updatedItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/menu/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteMenuItem(parseInt(id));
      if (!success) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const updatedItem = await storage.updateCartItem(parseInt(id), quantity);
      if (!updatedItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json(updatedItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.removeFromCart(parseInt(id));
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/cart/clear/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrderById(parseInt(id));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Stripe payment route (temporary)
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      // This is a temporary mock endpoint for Stripe
      const { amount } = req.body;
      res.json({ 
        clientSecret: "mock_client_secret_" + Date.now(),
        amount,
        message: "Payment endpoint ready for Stripe integration"
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
