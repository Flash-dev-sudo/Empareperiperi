import {
  users, menuItems, orders, cartItems,
  catalogCategories, catalogMenuItems, syncEvents,
  type User, type InsertUser, type MenuItem, type InsertMenuItem,
  type Order, type InsertOrder, type CartItem, type InsertCartItem,
  type CatalogCategory, type InsertCatalogCategory,
  type CatalogMenuItem, type InsertCatalogMenuItem,
  type SyncEvent, type InsertSyncEvent
} from "@shared/schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Menu operations
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Cart operations
  getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByPhone(phone: string): Promise<Order[]>;

  // Catalog sync operations
  getCatalogCategories(): Promise<CatalogCategory[]>;
  getCatalogCategoryByQueueId(queueId: number): Promise<CatalogCategory | undefined>;
  createCatalogCategory(category: InsertCatalogCategory): Promise<CatalogCategory>;
  updateCatalogCategory(id: number, category: Partial<CatalogCategory>): Promise<CatalogCategory | undefined>;

  getCatalogMenuItems(): Promise<CatalogMenuItem[]>;
  getCatalogMenuItemByQueueId(queueId: number): Promise<CatalogMenuItem | undefined>;
  createCatalogMenuItem(item: InsertCatalogMenuItem): Promise<CatalogMenuItem>;
  updateCatalogMenuItem(id: number, item: Partial<CatalogMenuItem>): Promise<CatalogMenuItem | undefined>;

  // Sync events
  createSyncEvent(event: InsertSyncEvent): Promise<SyncEvent>;
  getSyncEvents(): Promise<SyncEvent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private cartItems: Map<number, CartItem>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.cartItems = new Map();
    this.currentId = 1;
    
    // Initialize with some sample menu items
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleItems = [
      // Starters
      { id: 1, name: "Chips", category: "Starters", price: "2.50", description: "Crispy golden chips", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 2, name: "Peri Peri Chips", category: "Starters", price: "3.00", description: "Crispy chips with peri peri seasoning", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 3, name: "Chips with Cheese", category: "Starters", price: "4.00", description: "Golden chips topped with melted cheese", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 4, name: "Potato Wedges", category: "Starters", price: "3.50", description: "Crispy seasoned potato wedges", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 5, name: "Potato Wedges with Cheese", category: "Starters", price: "4.00", description: "Crispy wedges topped with melted cheese", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 6, name: "Fish Fingers", category: "Starters", price: "4.00", description: "Crispy breaded fish fingers", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 7, name: "Calamari", category: "Starters", price: "4.00", description: "Crispy fried calamari rings", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 8, name: "Mozzarella Sticks", category: "Starters", price: "4.00", description: "Crispy mozzarella cheese sticks", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 9, name: "Onion Rings (10 pcs)", category: "Starters", price: "4.00", description: "10 crispy onion rings", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 10, name: "Gamberoni (6 pcs)", category: "Starters", price: "4.00", description: "6 king prawns", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 11, name: "Nuggets", category: "Starters", price: "3.00", description: "Chicken nuggets", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 12, name: "Buffalo Wings", category: "Starters", price: "4.50", description: "Spicy buffalo wings", image: null, spiceLevel: 3, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 13, name: "BBQ Wings", category: "Starters", price: "4.50", description: "BBQ flavored wings", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      
      // Platters
      { id: 14, name: "Wings Platter", category: "Platters", price: "15.49", description: "15 wings, 2 chips, 2 drinks", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 15, name: "Strips Platter", category: "Platters", price: "15.49", description: "15 strips, 2 chips, 2 drinks", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 16, name: "Burger Feast", category: "Platters", price: "24.49", description: "3 Peri Peri Burgers, 8 Peri Peri Wings, 2 Chips, Bottle drink", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 17, name: "Variety Platter", category: "Platters", price: "24.00", description: "Whole Chicken, 8 Wings, 5 Strips, 2 sides, Bottle of drink", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 18, name: "Emparo Special", category: "Platters", price: "22.50", description: "Half Chicken, 2 Peri Burgers, 5 Peri Wings, 2 sides, Bottle", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 19, name: "Feast Platter", category: "Platters", price: "38.49", description: "2 Whole Chickens, 8 Wings, 8 Strips, 3 sides, Bottle", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 20, name: "Strips Rice Platter", category: "Platters", price: "7.50", description: "Rice platter", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 21, name: "Half Chicken Rice Platter", category: "Platters", price: "8.00", description: "Rice platter", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 22, name: "Chicken Wings Rice Platter", category: "Platters", price: "7.00", description: "Rice platter", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      
      // Mains
      { id: 23, name: "Strip Burger", category: "Mains", price: "2.50", description: "Chicken strip burger", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 24, name: "Fillet Burger", category: "Mains", price: "3.50", description: "Chicken fillet burger", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 25, name: "Zinger Burger", category: "Mains", price: "4.00", description: "Spicy zinger burger", image: null, spiceLevel: 3, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 26, name: "Fish / Vegetarian Burger", category: "Mains", price: "3.50", description: "Fish or vegetarian burger", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 27, name: "Emparo Burger", category: "Mains", price: "6.50", description: "Signature Emparo burger", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 28, name: "Tower Burger", category: "Mains", price: "5.00", description: "Multi-layer tower burger", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 29, name: "EFC Special", category: "Mains", price: "6.50", description: "EFC special burger", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 30, name: "Quarter Pounder", category: "Mains", price: "4.00", description: "Quarter pounder beef burger", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 31, name: "Half Pounder", category: "Mains", price: "5.00", description: "Half pounder beef burger", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 32, name: "Peri Peri Burger", category: "Mains", price: "5.00", description: "Peri peri chicken burger", image: null, spiceLevel: 3, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 33, name: "Peri Peri Wrap", category: "Mains", price: "4.50", description: "Peri peri chicken wrap", image: null, spiceLevel: 3, isAvailable: 1, createdAt: new Date().toISOString() },
      
      // Pizzas
      { id: 34, name: "Margarita", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 35, name: "Double Peperoni", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 36, name: "Mediterranean Special", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 37, name: "Emparo Special", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 38, name: "Veggie Hot", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 39, name: "Veggie Special", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 40, name: "American Hot", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 41, name: "Peri Peri Special", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 3, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 42, name: "Tandoori Special", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 43, name: "BBQ Special", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 44, name: "Hawai Special", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 45, name: "Tuna Special", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 46, name: "Four Season", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 47, name: "Meat Lovers", category: "Pizzas", price: "8.50", description: "Fresh stone baked daily", image: null, spiceLevel: 1, isAvailable: 1, createdAt: new Date().toISOString() },
      
      // Chicken
      { id: 48, name: "Fried Chicken Wings (3 pcs)", category: "Chicken", price: "1.50", description: "3 pieces fried chicken wings", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 49, name: "Fried Chicken Wings (6 pcs)", category: "Chicken", price: "3.00", description: "6 pieces fried chicken wings", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 50, name: "Fried Chicken Strips (3 pcs)", category: "Chicken", price: "2.00", description: "3 pieces fried chicken strips", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 51, name: "Fried Chicken Strips (6 pcs)", category: "Chicken", price: "4.00", description: "6 pieces fried chicken strips", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 52, name: "Peri Peri Wings", category: "Chicken", price: "4.20", description: "Peri peri chicken wings", image: null, spiceLevel: 3, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 53, name: "Peri Peri Strips", category: "Chicken", price: "4.70", description: "Peri peri chicken strips", image: null, spiceLevel: 3, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 54, name: "Half Chicken", category: "Chicken", price: "5.50", description: "Half grilled chicken", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 55, name: "Whole Chicken", category: "Chicken", price: "10.50", description: "Whole grilled chicken", image: null, spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
      
      // Milkshakes
      { id: 56, name: "Oreo Milkshake", category: "Milkshakes", price: "3.50", description: "Oreo cookie milkshake", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 57, name: "Kit Kat Milkshake", category: "Milkshakes", price: "3.50", description: "Kit Kat chocolate milkshake", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 58, name: "Dates Milkshake", category: "Milkshakes", price: "3.50", description: "Dates milkshake", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 59, name: "Kinder Bueno Milkshake", category: "Milkshakes", price: "3.50", description: "Kinder Bueno milkshake", image: null, spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
    ];
    
    sampleItems.forEach(item => {
      this.menuItems.set(item.id, item);
    });
    
    // Set currentId to be higher than the sample data
    this.currentId = 60;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentId++;
    const menuItem: MenuItem = { ...item, id, createdAt: new Date().toISOString(), image: item.image || null };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (item) {
      const updatedItem = { ...item, ...updates };
      this.menuItems.set(id, updatedItem);
      return updatedItem;
    }
    return undefined;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
    
    return items.map(item => ({
      ...item,
      menuItem: this.menuItems.get(item.menuItemId)!
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = this.currentId++;
    const cartItem: CartItem = { ...item, id, createdAt: new Date().toISOString(), notes: item.notes || null };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
    }
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([, item]) => item.sessionId === sessionId);
    
    itemsToRemove.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentId++;
    const newOrder: Order = { 
      ...order, 
      id, 
      createdAt: new Date().toISOString(),
      customerEmail: order.customerEmail || null,
      status: order.status || null,
      deliveryAddress: order.deliveryAddress || null,
      notes: order.notes || null
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByPhone(phone: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.customerPhone === phone);
  }

  // Catalog sync operations (MemStorage implementations)
  async getCatalogCategories(): Promise<CatalogCategory[]> {
    // For MemStorage, return empty array since we don't store catalog data
    return [];
  }

  async getCatalogCategoryByQueueId(queueId: number): Promise<CatalogCategory | undefined> {
    return undefined;
  }

  async createCatalogCategory(category: InsertCatalogCategory): Promise<CatalogCategory> {
    throw new Error('Catalog operations not supported in MemStorage');
  }

  async updateCatalogCategory(id: number, category: Partial<CatalogCategory>): Promise<CatalogCategory | undefined> {
    throw new Error('Catalog operations not supported in MemStorage');
  }

  async getCatalogMenuItems(): Promise<CatalogMenuItem[]> {
    return [];
  }

  async getCatalogMenuItemByQueueId(queueId: number): Promise<CatalogMenuItem | undefined> {
    return undefined;
  }

  async createCatalogMenuItem(item: InsertCatalogMenuItem): Promise<CatalogMenuItem> {
    throw new Error('Catalog operations not supported in MemStorage');
  }

  async updateCatalogMenuItem(id: number, item: Partial<CatalogMenuItem>): Promise<CatalogMenuItem | undefined> {
    throw new Error('Catalog operations not supported in MemStorage');
  }

  async createSyncEvent(event: InsertSyncEvent): Promise<SyncEvent> {
    throw new Error('Sync events not supported in MemStorage');
  }

  async getSyncEvents(): Promise<SyncEvent[]> {
    return [];
  }
}

export class TursoStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required for Turso");
    }

    // Clean the URL to remove any PostgreSQL parameters
    let cleanUrl = process.env.DATABASE_URL;
    if (cleanUrl.includes('?')) {
      cleanUrl = cleanUrl.split('?')[0];
    }

    const client = createClient({
      url: cleanUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    this.db = drizzle(client);
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    
    return result[0];
  }

  // Menu operations
  async getMenuItems(): Promise<MenuItem[]> {
    return await this.db.select().from(menuItems);
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    const result = await this.db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id))
      .limit(1);
    
    return result[0];
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const result = await this.db
      .insert(menuItems)
      .values(item)
      .returning();
    
    return result[0];
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const result = await this.db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, id))
      .returning();
    
    return result[0];
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await this.db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning();
    
    return result.length > 0;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<(CartItem & { menuItem: MenuItem })[]> {
    const result = await this.db
      .select({
        cartItem: cartItems,
        menuItem: menuItems
      })
      .from(cartItems)
      .innerJoin(menuItems, eq(cartItems.menuItemId, menuItems.id))
      .where(eq(cartItems.sessionId, sessionId));
    
    return result.map(({ cartItem, menuItem }) => ({
      ...cartItem,
      menuItem
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const result = await this.db
      .insert(cartItems)
      .values(item)
      .returning();
    
    return result[0];
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const result = await this.db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    
    return result[0];
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await this.db
      .delete(cartItems)
      .where(eq(cartItems.id, id))
      .returning();
    
    return result.length > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const result = await this.db
      .delete(cartItems)
      .where(eq(cartItems.sessionId, sessionId))
      .returning();
    
    return result.length > 0;
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await this.db
      .insert(orders)
      .values(order)
      .returning();
    
    return result[0];
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const result = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    
    return result[0];
  }

  async getOrdersByPhone(phone: string): Promise<Order[]> {
    return await this.db
      .select()
      .from(orders)
      .where(eq(orders.customerPhone, phone));
  }

  // Catalog sync operations
  async getCatalogCategories(): Promise<CatalogCategory[]> {
    return await this.db.select().from(catalogCategories);
  }

  async getCatalogCategoryByQueueId(queueId: number): Promise<CatalogCategory | undefined> {
    const result = await this.db
      .select()
      .from(catalogCategories)
      .where(eq(catalogCategories.queueId, queueId))
      .limit(1);

    return result[0];
  }

  async createCatalogCategory(category: InsertCatalogCategory): Promise<CatalogCategory> {
    const result = await this.db
      .insert(catalogCategories)
      .values(category)
      .returning();

    return result[0];
  }

  async updateCatalogCategory(id: number, category: Partial<CatalogCategory>): Promise<CatalogCategory | undefined> {
    const result = await this.db
      .update(catalogCategories)
      .set(category)
      .where(eq(catalogCategories.id, id))
      .returning();

    return result[0];
  }

  async getCatalogMenuItems(): Promise<CatalogMenuItem[]> {
    return await this.db.select().from(catalogMenuItems);
  }

  async getCatalogMenuItemByQueueId(queueId: number): Promise<CatalogMenuItem | undefined> {
    const result = await this.db
      .select()
      .from(catalogMenuItems)
      .where(eq(catalogMenuItems.queueId, queueId))
      .limit(1);

    return result[0];
  }

  async createCatalogMenuItem(item: InsertCatalogMenuItem): Promise<CatalogMenuItem> {
    const result = await this.db
      .insert(catalogMenuItems)
      .values(item)
      .returning();

    return result[0];
  }

  async updateCatalogMenuItem(id: number, item: Partial<CatalogMenuItem>): Promise<CatalogMenuItem | undefined> {
    const result = await this.db
      .update(catalogMenuItems)
      .set(item)
      .where(eq(catalogMenuItems.id, id))
      .returning();

    return result[0];
  }

  // Sync events
  async createSyncEvent(event: InsertSyncEvent): Promise<SyncEvent> {
    const result = await this.db
      .insert(syncEvents)
      .values(event)
      .returning();

    return result[0];
  }

  async getSyncEvents(): Promise<SyncEvent[]> {
    return await this.db.select().from(syncEvents);
  }
}

// Use MemStorage for development and until sync is implemented
// TursoStorage will be used once sync system populates the database
export const storage = process.env.USE_TURSO_STORAGE === 'true' && process.env.DATABASE_URL && process.env.DATABASE_AUTH_TOKEN
  ? new TursoStorage()
  : new MemStorage();
