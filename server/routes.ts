import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertMenuItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for keep-alive service
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  // Admin authentication routes with enhanced security
  app.post('/api/admin/login', async (req, res) => {
    // Admin functionality disabled - redirect to queue system
    res.status(410).json({
      error: 'Website admin is disabled. Please use the queue management system.',
      redirectUrl: process.env.QUEUE_API_BASE || 'https://your-queue-app.render.com',
      message: 'All menu and catalog management is now centralized in the queue system.'
    });
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
  app.post("/api/menu", async (req, res) => {
    res.status(410).json({
      error: 'Menu management is disabled on this website.',
      redirectUrl: process.env.QUEUE_API_BASE || 'https://your-queue-app.render.com',
      message: 'Please use the queue management system to manage menu items.'
    });
  });

  app.put("/api/menu/:id", async (req, res) => {
    res.status(410).json({
      error: 'Menu management is disabled on this website.',
      redirectUrl: process.env.QUEUE_API_BASE || 'https://your-queue-app.render.com',
      message: 'Please use the queue management system to manage menu items.'
    });
  });

  app.delete("/api/menu/:id", async (req, res) => {
    res.status(410).json({
      error: 'Menu management is disabled on this website.',
      redirectUrl: process.env.QUEUE_API_BASE || 'https://your-queue-app.render.com',
      message: 'Please use the queue management system to manage menu items.'
    });
  });

  // Catalog sync endpoint - receives updates from queue system
  app.post('/api/catalog/sync', async (req, res) => {
    try {
      // Verify HMAC signature
      const signature = req.headers['x-queue-signature'] as string;
      if (!signature) {
        return res.status(401).json({ error: 'Missing signature header' });
      }

      const crypto = await import('crypto');
      const secret = process.env.CATALOG_SYNC_SECRET;
      if (!secret) {
        console.error('CATALOG_SYNC_SECRET not configured');
        return res.status(500).json({ error: 'Sync not configured' });
      }

      // Verify signature
      const rawBody = JSON.stringify(req.body);
      const expectedSignature = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid sync signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const { categories, items } = req.body;
      let processedCategories = 0;
      let processedItems = 0;
      const errors = [];

      // Process categories
      if (categories && Array.isArray(categories)) {
        for (const category of categories) {
          try {
            const existingCategory = await storage.getCatalogCategoryByQueueId(category.id);

            if (category.deletedAt) {
              // Soft delete
              if (existingCategory) {
                await storage.updateCatalogCategory(existingCategory.id, { deletedAt: category.deletedAt });
              }
            } else {
              const categoryData = {
                queueId: category.id,
                name: category.name,
                icon: category.icon,
                displayOrder: category.displayOrder,
                updatedAt: category.updatedAt,
                deletedAt: category.deletedAt,
                contentHash: category.contentHash
              };

              if (existingCategory) {
                // Skip if content hash matches (no changes)
                if (existingCategory.contentHash === category.contentHash) {
                  continue;
                }
                await storage.updateCatalogCategory(existingCategory.id, categoryData);
              } else {
                await storage.createCatalogCategory(categoryData);
              }
            }
            processedCategories++;
          } catch (error) {
            console.error('Error processing category:', category.id, error);
            errors.push(`Category ${category.id}: ${error.message}`);
          }
        }
      }

      // Process menu items
      if (items && Array.isArray(items)) {
        for (const item of items) {
          try {
            const existingItem = await storage.getCatalogMenuItemByQueueId(item.id);

            if (item.deletedAt) {
              // Soft delete
              if (existingItem) {
                await storage.updateCatalogMenuItem(existingItem.id, { deletedAt: item.deletedAt });
              }
            } else {
              // Find local category ID from queue category ID
              const category = await storage.getCatalogCategoryByQueueId(item.categoryId);
              if (!category) {
                errors.push(`Item ${item.id}: Category ${item.categoryId} not found`);
                continue;
              }

              const itemData = {
                queueId: item.id,
                categoryId: category.id, // Use local category ID
                name: item.name,
                description: item.description,
                price: item.price,
                mealPrice: item.mealPrice,
                available: item.available,
                image: item.image,
                hasFlavorOptions: item.hasFlavorOptions,
                hasMealOption: item.hasMealOption,
                isSpicyOption: item.isSpicyOption,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt,
                contentHash: item.contentHash
              };

              if (existingItem) {
                // Skip if content hash matches (no changes)
                if (existingItem.contentHash === item.contentHash) {
                  continue;
                }
                await storage.updateCatalogMenuItem(existingItem.id, itemData);
              } else {
                await storage.createCatalogMenuItem(itemData);
              }
            }
            processedItems++;
          } catch (error) {
            console.error('Error processing menu item:', item.id, error);
            errors.push(`Item ${item.id}: ${error.message}`);
          }
        }
      }

      // Log sync event
      await storage.createSyncEvent({
        eventType: 'catalog_sync',
        status: errors.length > 0 ? 'partial_success' : 'success',
        itemCount: processedCategories + processedItems,
        errorMessage: errors.length > 0 ? errors.join('; ') : null
      });

      console.log(`Catalog sync completed: ${processedCategories} categories, ${processedItems} items processed`);

      res.json({
        success: true,
        processed: {
          categories: processedCategories,
          items: processedItems
        },
        errors: errors.length > 0 ? errors : undefined
      });

    } catch (error) {
      console.error('Catalog sync error:', error);

      // Log sync failure
      try {
        await storage.createSyncEvent({
          eventType: 'catalog_sync',
          status: 'error',
          itemCount: 0,
          errorMessage: error.message
        });
      } catch (logError) {
        console.error('Failed to log sync error:', logError);
      }

      res.status(500).json({ error: 'Sync failed', message: error.message });
    }
  });

  // Catalog API endpoint for website UI
  app.get('/api/catalog', async (req, res) => {
    try {
      const [categories, items] = await Promise.all([
        storage.getCatalogCategories(),
        storage.getCatalogMenuItems()
      ]);

      // Filter out deleted items
      const activeCategories = categories.filter(cat => !cat.deletedAt);
      const activeItems = items.filter(item => !item.deletedAt);

      res.json({
        categories: activeCategories,
        items: activeItems
      });
    } catch (error) {
      console.error('Error fetching catalog:', error);
      res.status(500).json({ error: 'Failed to fetch catalog' });
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

  // Image proxy endpoint - serves images from queue system
  app.get('/api/images/:filename', async (req, res) => {
    try {
      const { filename } = req.params;
      const queueApiBase = process.env.QUEUE_API_BASE || 'http://localhost:5000';
      const imageUrl = `${queueApiBase}/api/images/${filename}`;

      // Proxy the image request to the queue system
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(imageUrl);

      if (!response.ok) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Get the content type from the queue system response
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      res.set('Content-Type', contentType);

      // Pipe the image data through
      response.body?.pipe(res);
    } catch (error) {
      console.error('Error proxying image:', error);
      res.status(500).json({ error: 'Failed to load image' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
