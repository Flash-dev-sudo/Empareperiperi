import { users, menuItems, orders, cartItems, type User, type InsertUser, type MenuItem, type InsertMenuItem, type Order, type InsertOrder, type CartItem, type InsertCartItem } from "@shared/schema";
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
      { id: 1, name: "Peri Peri Chicken", category: "Chicken", price: "12.99", description: "Flame-grilled chicken with authentic peri peri sauce", image: "", spiceLevel: 3, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 2, name: "Margherita Pizza", category: "Pizza", price: "10.99", description: "Classic margherita with fresh basil", image: "", spiceLevel: 0, isAvailable: 1, createdAt: new Date().toISOString() },
      { id: 3, name: "Peri Peri Chips", category: "Sides", price: "4.99", description: "Crispy chips with peri peri seasoning", image: "", spiceLevel: 2, isAvailable: 1, createdAt: new Date().toISOString() },
    ];
    
    sampleItems.forEach(item => {
      this.menuItems.set(item.id, item);
    });
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
}

// Use Turso when DATABASE_URL is available (production), otherwise use MemStorage (development)
export const storage = process.env.DATABASE_URL && process.env.DATABASE_AUTH_TOKEN
  ? new TursoStorage() 
  : new MemStorage();
