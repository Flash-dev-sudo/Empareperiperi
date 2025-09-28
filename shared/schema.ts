import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: text("price").notNull(),
  description: text("description"),
  image: text("image"),
  spiceLevel: integer("spice_level").default(0),
  isAvailable: integer("is_available").default(1),
  createdAt: text("created_at").default("datetime('now')"),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  orderItems: text("order_items").notNull(),
  totalAmount: text("total_amount").notNull(),
  status: text("status").default("pending"),
  orderType: text("order_type").notNull(),
  deliveryAddress: text("delivery_address"),
  deliveryFee: text("delivery_fee").default("0"),
  notes: text("notes"),
  createdAt: text("created_at").default("datetime('now')"),
});

export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").default("food"),
  isActive: integer("is_active").default(1),
  createdAt: text("created_at").default("datetime('now')"),
});

export const cartItems = sqliteTable("cart_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").default("datetime('now')"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof gallery.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Catalog replica tables (synced from queue system)
export const catalogCategories = sqliteTable("catalog_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  queueId: integer("queue_id").notNull().unique(), // ID from queue system
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at"),
  contentHash: text("content_hash"),
});

export const catalogMenuItems = sqliteTable("catalog_menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  queueId: integer("queue_id").notNull().unique(), // ID from queue system
  categoryId: integer("category_id").notNull().references(() => catalogCategories.id), // Local FK to catalog_categories
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Price in pennies
  mealPrice: integer("meal_price"), // Price for meal upgrade in pennies
  available: integer("available", { mode: "boolean" }).notNull().default(true),
  image: text("image"),
  hasFlavorOptions: integer("has_flavor_options", { mode: "boolean" }).default(false),
  hasMealOption: integer("has_meal_option", { mode: "boolean" }).default(false),
  isSpicyOption: integer("is_spicy_option", { mode: "boolean" }).default(false),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at"),
  contentHash: text("content_hash"),
});

// Sync events table for diagnostics
export const syncEvents = sqliteTable("sync_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventType: text("event_type").notNull(), // 'category_sync', 'item_sync', 'full_sync'
  status: text("status").notNull(), // 'success', 'error'
  itemCount: integer("item_count").default(0),
  errorMessage: text("error_message"),
  createdAt: text("created_at").default("datetime('now')"),
});

export const insertCatalogCategorySchema = createInsertSchema(catalogCategories).omit({
  id: true,
});

export const insertCatalogMenuItemSchema = createInsertSchema(catalogMenuItems).omit({
  id: true,
});

export const insertSyncEventSchema = createInsertSchema(syncEvents).omit({
  id: true,
  createdAt: true,
});

export type CatalogCategory = typeof catalogCategories.$inferSelect;
export type InsertCatalogCategory = z.infer<typeof insertCatalogCategorySchema>;
export type CatalogMenuItem = typeof catalogMenuItems.$inferSelect;
export type InsertCatalogMenuItem = z.infer<typeof insertCatalogMenuItemSchema>;
export type SyncEvent = typeof syncEvents.$inferSelect;
export type InsertSyncEvent = z.infer<typeof insertSyncEventSchema>;
