import {
  users, menuItems, orders, cartItems, categories, gallery,
  type User, type InsertUser, type MenuItem, type InsertMenuItem,
  type Order, type InsertOrder, type CartItemDB, type InsertCartItemDB,
  type Category, type InsertCategory, type Gallery, type InsertGallery
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

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Menu operations
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;

  // Cart operations
  getCartItems(sessionId: string): Promise<(CartItemDB & { menuItem: MenuItem })[]>;
  addToCart(item: InsertCartItemDB): Promise<CartItemDB>;
  updateCartItem(id: number, quantity: number): Promise<CartItemDB | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByPhone(phone: string): Promise<Order[]>;

  // Gallery operations
  getGalleryItems(): Promise<Gallery[]>;
  getGalleryItemById(id: number): Promise<Gallery | undefined>;
  createGalleryItem(item: InsertGallery): Promise<Gallery>;
  updateGalleryItem(id: number, item: Partial<Gallery>): Promise<Gallery | undefined>;
  deleteGalleryItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private cartItems: Map<number, CartItemDB>;
  private galleryItems: Map<number, Gallery>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.cartItems = new Map();
    this.galleryItems = new Map();
    this.currentId = 1;

    // Initialize with some sample menu items
    this.initializeSampleData();
  }

private initializeSampleData() {
  // First, add categories
  const sampleCategories = [
    { id: 1, name: "Starters", icon: "🥗", displayOrder: 1, updatedAt: new Date().toISOString(), deletedAt: null, contentHash: null },
    { id: 2, name: "Mains", icon: "🍽️", displayOrder: 2, updatedAt: new Date().toISOString(), deletedAt: null, contentHash: null },
    { id: 3, name: "Platters", icon: "🍱", displayOrder: 3, updatedAt: new Date().toISOString(), deletedAt: null, contentHash: null },
    { id: 4, name: "Pizzas", icon: "🍕", displayOrder: 4, updatedAt: new Date().toISOString(), deletedAt: null, contentHash: null },
    { id: 5, name: "Chicken", icon: "🍗", displayOrder: 5, updatedAt: new Date().toISOString(), deletedAt: null, contentHash: null },
    { id: 6, name: "Milkshakes", icon: "🥤", displayOrder: 6, updatedAt: new Date().toISOString(), deletedAt: null, contentHash: null }
  ];

  sampleCategories.forEach(cat => {
    this.categories.set(cat.id, cat);
  });

  const sampleItems = [
    // Starters with customization
    {
      id: 1,
      categoryId: 1, // Starters
      name: "Peri Peri Chips",
      description: "Crispy chips with peri peri seasoning",
      price: 300, // £3.00 in pence
      mealPrice: 250, // £2.50 for meal upgrade
      available: true,
      image: null,
      hasFlavorOptions: true,
      hasMealOption: true,
      isSpicyOption: true,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    },
    {
      id: 2,
      categoryId: 1,
      name: "Chicken Wings",
      description: "Spicy chicken wings",
      price: 450, // £4.50
      mealPrice: 250,
      available: true,
      image: null,
      hasFlavorOptions: true,
      hasMealOption: true,
      isSpicyOption: true,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    },
    {
      id: 3,
      categoryId: 1,
      name: "Chips",
      description: "Crispy golden chips",
      price: 250, // £2.50
      mealPrice: 250,
      available: true,
      image: null,
      hasFlavorOptions: false,
      hasMealOption: true,
      isSpicyOption: false,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    },
    {
      id: 4,
      categoryId: 1,
      name: "Potato Wedges",
      description: "Crispy seasoned potato wedges",
      price: 350, // £3.50
      mealPrice: 250,
      available: true,
      image: null,
      hasFlavorOptions: false,
      hasMealOption: true,
      isSpicyOption: false,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    },

    // Mains with customization
    {
      id: 5,
      categoryId: 2, // Mains
      name: "Peri Peri Burger",
      description: "Peri peri chicken burger",
      price: 500, // £5.00
      mealPrice: 250,
      available: true,
      image: null,
      hasFlavorOptions: true,
      hasMealOption: true,
      isSpicyOption: true,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    },
    {
      id: 6,
      categoryId: 2,
      name: "Chicken Wrap",
      description: "Grilled chicken in a soft tortilla",
      price: 600, // £6.00
      mealPrice: 250,
      available: true,
      image: null,
      hasFlavorOptions: true,
      hasMealOption: true,
      isSpicyOption: false,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    },
    {
      id: 7,
      categoryId: 2,
      name: "Fish and Chips",
      description: "Battered fish with chips",
      price: 750, // £7.50
      mealPrice: 250,
      available: true,
      image: null,
      hasFlavorOptions: false,
      hasMealOption: true,
      isSpicyOption: false,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    },
    {
      id: 8,
      categoryId: 2,
      name: "Chicken Salad",
      description: "Fresh salad with grilled chicken",
      price: 600, // £6.00
      mealPrice: 250,
      available: true,
      image: null,
      hasFlavorOptions: false,
      hasMealOption: true,
      isSpicyOption: false,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    },
    {
      id: 9,
      categoryId: 2,
      name: "Caesar Salad",
      description: "Classic caesar salad",
      price: 550, // £5.50
      mealPrice: 250,
      available: true,
      image: null,
      hasFlavorOptions: false,
      hasMealOption: true,
      isSpicyOption: false,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    },
    {
      id: 10,
      categoryId: 2,
      name: "Chicken Rice Bowl",
      description: "Grilled chicken with seasoned rice",
      price: 700, // £7.00
      mealPrice: 250,
      available: true,
      image: null,
      hasFlavorOptions: true,
      hasMealOption: true,
      isSpicyOption: true,
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      contentHash: null
    }
  ];

  sampleItems.forEach(item => {
    this.menuItems.set(item.id, item);
  });

  // Set currentId to be higher than the sample data
  this.currentId = 11;
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

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (category) {
      const updatedCategory = { ...category, ...updates };
      this.categories.set(id, updatedCategory);
      return updatedCategory;
    }
    return undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Menu operations
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.categoryId === categoryId);
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

  // Gallery operations
  async getGalleryItems(): Promise<Gallery[]> {
    return Array.from(this.galleryItems.values()).filter(item => item.isActive);
  }

  async getGalleryItemById(id: number): Promise<Gallery | undefined> {
    return this.galleryItems.get(id);
  }

  async createGalleryItem(item: InsertGallery): Promise<Gallery> {
    const id = this.currentId++;
    const galleryItem: Gallery = { ...item, id };
    this.galleryItems.set(id, galleryItem);
    return galleryItem;
  }

  async updateGalleryItem(id: number, updates: Partial<Gallery>): Promise<Gallery | undefined> {
    const item = this.galleryItems.get(id);
    if (item) {
      const updatedItem = { ...item, ...updates };
      this.galleryItems.set(id, updatedItem);
      return updatedItem;
    }
    return undefined;
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    const item = this.galleryItems.get(id);
    if (item) {
      const updatedItem = { ...item, isActive: false };
      this.galleryItems.set(id, updatedItem);
      return true;
    }
    return false;
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
    // Use queue database configuration (TURSO_DB_URL)
    const url = process.env.TURSO_DB_URL || "file:dev.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;

    const client = createClient({
      url,
      authToken,
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

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await this.db
      .select()
      .from(categories)
      .orderBy(categories.displayOrder);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const result = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await this.db
      .insert(categories)
      .values(category)
      .returning();

    return result[0];
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const result = await this.db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();

    return result[0];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    return result.length > 0;
  }

  // Menu operations
  async getMenuItems(): Promise<MenuItem[]> {
    return await this.db.select().from(menuItems);
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return await this.db
      .select()
      .from(menuItems)
      .where(eq(menuItems.categoryId, categoryId));
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
  async getCartItems(sessionId: string): Promise<(CartItemDB & { menuItem: MenuItem })[]> {
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

  async addToCart(item: InsertCartItemDB): Promise<CartItemDB> {
    const result = await this.db
      .insert(cartItems)
      .values(item)
      .returning();

    return result[0];
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItemDB | undefined> {
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

  // Gallery operations
  async getGalleryItems(): Promise<Gallery[]> {
    return await this.db
      .select()
      .from(gallery)
      .where(eq(gallery.isActive, true));
  }

  async getGalleryItemById(id: number): Promise<Gallery | undefined> {
    const result = await this.db
      .select()
      .from(gallery)
      .where(eq(gallery.id, id))
      .limit(1);

    return result[0];
  }

  async createGalleryItem(item: InsertGallery): Promise<Gallery> {
    const result = await this.db
      .insert(gallery)
      .values(item)
      .returning();

    return result[0];
  }

  async updateGalleryItem(id: number, updates: Partial<Gallery>): Promise<Gallery | undefined> {
    const result = await this.db
      .update(gallery)
      .set(updates)
      .where(eq(gallery.id, id))
      .returning();

    return result[0];
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    const result = await this.db
      .update(gallery)
      .set({ isActive: false })
      .where(eq(gallery.id, id))
      .returning();

    return result.length > 0;
  }
}

// Use TursoStorage by default (connected to queue database)
// MemStorage only for development/testing when TURSO_DB_URL is not available
export const storage = process.env.TURSO_DB_URL
  ? new TursoStorage()
  : new MemStorage();
