const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.DATABASE_URL,
});

const menuData = [
  // Peri Peri Specialties
  { name: "Peri Peri Wings Special", category: "Peri Peri Specialties", price: "4.20", description: "Flame-grilled chicken wings marinaded in our signature peri peri sauce", spice_level: 3, is_customer_favorite: 1 },
  { name: "Quarter Grilled Chicken", category: "Peri Peri Specialties", price: "7.50", description: "Tender quarter chicken grilled with authentic peri peri spices", spice_level: 2, is_customer_favorite: 0 },
  { name: "Peri Peri Burger Special", category: "Peri Peri Specialties", price: "5.50", description: "Juicy chicken burger with fresh vegetables and signature peri peri sauce", spice_level: 2, is_customer_favorite: 1 },

  // Starters
  { name: "Chips", category: "Starters", price: "2.50", description: "Fresh hand-cut chips", spice_level: 0, is_customer_favorite: 0 },
  { name: "Peri Peri Chips", category: "Starters", price: "3.00", description: "Hand-cut chips with peri peri seasoning", spice_level: 2, is_customer_favorite: 0 },
  { name: "Chips with Cheese", category: "Starters", price: "4.00", description: "Hand-cut chips topped with melted cheese", spice_level: 0, is_customer_favorite: 0 },
  { name: "Potato Wedges", category: "Starters", price: "3.50", description: "Crispy seasoned potato wedges", spice_level: 1, is_customer_favorite: 0 },
  { name: "Potato Wedges with Cheese", category: "Starters", price: "4.00", description: "Crispy wedges with melted cheese", spice_level: 1, is_customer_favorite: 0 },
  { name: "Fish Fingers", category: "Starters", price: "4.00", description: "Golden crispy fish fingers", spice_level: 0, is_customer_favorite: 0 },

  // Platters  
  { name: "Wings Platter", category: "Platters", price: "15.49", description: "15 wings, 2 chips, 2 drinks", spice_level: 2, is_customer_favorite: 0 },
  { name: "Strips Platter", category: "Platters", price: "15.49", description: "10 strips, 2 chips, 2 drinks", spice_level: 2, is_customer_favorite: 0 },
  { name: "Burger Feast", category: "Platters", price: "24.49", description: "3 Peri Peri Burgers, 8 Peri Peri Wings, 2 Chips, Bottle drink", spice_level: 2, is_customer_favorite: 0 },
  { name: "Variety Platter", category: "Platters", price: "24.00", description: "Whole Chicken, 8 Wings, 5 Strips, 2 Sides, Bottle of drink", spice_level: 2, is_customer_favorite: 0 },
  { name: "Emparo Special", category: "Platters", price: "22.50", description: "Half Chicken, 2 Peri Burgers, 5 Peri Wings, 2 Chips", spice_level: 3, is_customer_favorite: 0 },

  // Mains
  { name: "Strip Burger", category: "Mains", price: "2.50", description: "Crispy chicken strip burger", spice_level: 1, is_customer_favorite: 0 },
  { name: "Fillet Burger", category: "Mains", price: "3.50", description: "Tender chicken fillet burger", spice_level: 1, is_customer_favorite: 0 },
  { name: "Zinger Burger", category: "Mains", price: "4.00", description: "Spicy zinger chicken burger", spice_level: 3, is_customer_favorite: 0 },
  { name: "Fish / Vegetarian Burger", category: "Mains", price: "3.50", description: "Fish or vegetarian option", spice_level: 0, is_customer_favorite: 0 },
  { name: "Emparo Burger", category: "Mains", price: "6.50", description: "Signature peri peri chicken burger", spice_level: 2, is_customer_favorite: 0 },
  { name: "Tower Burger", category: "Mains", price: "5.00", description: "Multi-layered chicken burger", spice_level: 2, is_customer_favorite: 0 },

  // Pizzas
  { name: "Margherita", category: "Pizzas", price: "8.50", description: "Classic tomato base with mozzarella", spice_level: 0, is_customer_favorite: 0 },
  { name: "Double Peperoni", category: "Pizzas", price: "8.50", description: "Double peperoni with cheese", spice_level: 1, is_customer_favorite: 0 },
  { name: "Mediterranean Special", category: "Pizzas", price: "8.50", description: "Olives, sun-dried tomatoes, feta", spice_level: 0, is_customer_favorite: 0 },
  { name: "Emparo Special Pizza", category: "Pizzas", price: "8.50", description: "Peri peri chicken special pizza", spice_level: 2, is_customer_favorite: 0 },
  { name: "Veggie Hot", category: "Pizzas", price: "8.50", description: "Spicy vegetable pizza", spice_level: 2, is_customer_favorite: 0 },

  // Chicken
  { name: "Fried Chicken Wings (3 pcs)", category: "Chicken", price: "1.50", description: "Crispy fried chicken wings", spice_level: 1, is_customer_favorite: 0 },
  { name: "Fried Chicken Wings (6 pcs)", category: "Chicken", price: "3.00", description: "Crispy fried chicken wings", spice_level: 1, is_customer_favorite: 0 },
  { name: "Fried Chicken Strips (3 pcs)", category: "Chicken", price: "2.00", description: "Golden chicken strips", spice_level: 1, is_customer_favorite: 0 },
  { name: "Fried Chicken Strips (6 pcs)", category: "Chicken", price: "4.00", description: "Golden chicken strips", spice_level: 1, is_customer_favorite: 0 },
  { name: "Peri Peri Wings", category: "Chicken", price: "4.20", description: "Flame-grilled wings with peri peri sauce", spice_level: 3, is_customer_favorite: 0 },
  { name: "Peri Peri Strips", category: "Chicken", price: "4.70", description: "Grilled strips in peri peri marinade", spice_level: 3, is_customer_favorite: 0 },

  // Milkshakes
  { name: "Oreo Milkshake", category: "Milkshakes", price: "3.50", description: "Creamy Oreo cookie milkshake", spice_level: 0, is_customer_favorite: 0 },
  { name: "Kit Kat Milkshake", category: "Milkshakes", price: "3.50", description: "Rich Kit Kat chocolate milkshake", spice_level: 0, is_customer_favorite: 0 },
  { name: "Dates Milkshake", category: "Milkshakes", price: "3.50", description: "Natural dates milkshake", spice_level: 0, is_customer_favorite: 0 },
  { name: "Kinder Bueno Milkshake", category: "Milkshakes", price: "3.50", description: "Creamy Kinder Bueno milkshake", spice_level: 0, is_customer_favorite: 0 },
  { name: "Mango Milkshake", category: "Milkshakes", price: "3.50", description: "Fresh mango milkshake", spice_level: 0, is_customer_favorite: 0 }
];

async function seedTursoDatabase() {
  console.log('Creating Turso tables and seeding menu data...');
  
  // Create table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price TEXT NOT NULL,
      description TEXT,
      image TEXT,
      spice_level INTEGER DEFAULT 0,
      is_available INTEGER DEFAULT 1,
      is_customer_favorite INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Clear existing data
  await client.execute('DELETE FROM menu_items');
  
  // Insert menu items
  for (const item of menuData) {
    await client.execute({
      sql: `INSERT INTO menu_items (name, category, price, description, spice_level, is_customer_favorite, is_available) 
            VALUES (?, ?, ?, ?, ?, ?, 1)`,
      args: [item.name, item.category, item.price, item.description, item.spice_level, item.is_customer_favorite]
    });
  }
  
  console.log(`✅ Seeded ${menuData.length} menu items to Turso database`);
  process.exit(0);
}

seedTursoDatabase().catch(console.error);