import { pgTable, text, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: text("price").notNull(),
  description: text("description"),
  image: text("image"),
  spiceLevel: integer("spice_level").default(0),
  isAvailable: integer("is_available").default(1),
  isCustomerFavorite: integer("is_customer_favorite").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  orderItems: text("order_items").notNull(),
  totalAmount: text("total_amount").notNull(),
  status: text("status").default("pending"),
  orderType: text("order_type").notNull(),
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").default("food"),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof gallery.$inferSelect;
