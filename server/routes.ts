import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin login (disabled - queue system handles admin)
  app.post('/api/admin/login', async (req, res) => {
    res.status(501).json({
      error: 'Admin functionality disabled',
      message: 'All menu and catalog management is now centralized in the queue system.'
    });
  });

  // Get catalog data directly from queue database (no sync needed)
  app.get('/api/catalog', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      const items = await storage.getMenuItems();

      // Group items by category
      const categoryData = categories
        .filter(cat => !cat.deletedAt)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(cat => ({
          ...cat,
          items: items.filter(item =>
            item.categoryId === cat.id &&
            !item.deletedAt &&
            item.available
          )
        }));

      res.json({ categories: categoryData });
    } catch (error: unknown) {
      console.error('Error fetching catalog:', error);
      res.status(500).json({ error: 'Failed to fetch catalog' });
    }
  });

  // Categories endpoint (matches queue API)
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories.filter(cat => !cat.deletedAt));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Menu items endpoint (matches queue API)
  app.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items.filter(item => !item.deletedAt));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Legacy menu endpoint (for backward compatibility)
  app.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items.filter(item => !item.deletedAt && item.available));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Gallery endpoints
  app.get('/api/gallery', async (req, res) => {
    try {
      const items = await storage.getGalleryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery items" });
    }
  });

  // Cart endpoints
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItem = await storage.addToCart(req.body);
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      const updatedItem = await storage.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);

      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/clear/:sessionId", async (req, res) => {
    try {
      const success = await storage.clearCart(req.params.sessionId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Order endpoints
  app.post("/api/orders", async (req, res) => {
    try {
      const order = await storage.createOrder(req.body);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Stripe payment intent endpoint
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = 'gbp' } = req.body;

      if (!amount || amount < 50) { // £0.50 minimum
        return res.status(400).json({ error: "Invalid amount" });
      }

      // Return mock response for development
      res.json({
        clientSecret: 'mock_client_secret_for_development',
        amount,
        currency
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Static file serving for images
  app.get('/api/images/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      // Serve static images - implementation depends on your image storage
      res.status(404).json({ error: 'Image not found' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to serve image' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}