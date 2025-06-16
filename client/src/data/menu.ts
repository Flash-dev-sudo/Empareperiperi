export interface MenuItem {
  name: string;
  price: string;
  description?: string;
}

export interface MenuCategory {
  category: string;
  icon: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    category: "Starters",
    icon: "🥗",
    items: [
      { name: "Chips", price: "£2.50" },
      { name: "Peri Peri Chips", price: "£3.00" },
      { name: "Chips with Cheese", price: "£4.00" },
      { name: "Potato Wedges", price: "£3.50" },
      { name: "Potato Wedges with Cheese", price: "£4.00" },
      { name: "Fish Fingers", price: "£4.00" },
      { name: "Calamari", price: "£4.00" },
      { name: "Mozzarella Sticks", price: "£4.00" },
      { name: "Onion Rings (10 pcs)", price: "£4.00" },
      { name: "Gamberoni (6 pcs)", price: "£4.00" },
      { name: "Nuggets", price: "£3.00" },
      { name: "Buffalo Wings", price: "£4.50" },
      { name: "BBQ Wings", price: "£4.50" }
    ]
  },
  {
    category: "Platters",
    icon: "🍽️",
    items: [
      { name: "Wings Platter", price: "£15.49", description: "15 wings, 2 chips, 2 drinks" },
      { name: "Strips Platter", price: "£15.49", description: "15 strips, 2 chips, 2 drinks" },
      { name: "Burger Feast", price: "£24.49", description: "3 Peri Peri Burgers, 8 Peri Peri Wings, 2 Chips, Bottle drink" },
      { name: "Variety Platter", price: "£24.00", description: "Whole Chicken, 8 Wings, 5 Strips, 2 sides, Bottle of drink" },
      { name: "Emparo Special", price: "£22.50", description: "Half Chicken, 2 Peri Burgers, 5 Peri Wings, 2 sides, Bottle" },
      { name: "Feast Platter", price: "£38.49", description: "2 Whole Chickens, 8 Wings, 8 Strips, 3 sides, Bottle" },
      { name: "Strips Rice Platter", price: "£7.50", description: "Rice platter" },
      { name: "Half Chicken Rice Platter", price: "£8.00", description: "Rice platter" },
      { name: "Chicken Wings Rice Platter", price: "£7.00", description: "Rice platter" }
    ]
  },
  {
    category: "Mains",
    icon: "🍔",
    items: [
      { name: "Strip Burger", price: "£2.50" },
      { name: "Fillet Burger", price: "£3.50" },
      { name: "Zinger Burger", price: "£4.00" },
      { name: "Fish / Vegetarian Burger", price: "£3.50" },
      { name: "Emparo Burger", price: "£6.50" },
      { name: "Tower Burger", price: "£5.00" },
      { name: "EFC Special", price: "£6.50" },
      { name: "Quarter Pounder", price: "£4.00" },
      { name: "Half Pounder", price: "£5.00" },
      { name: "Peri Peri Burger", price: "£5.00" },
      { name: "Peri Peri Wrap", price: "£4.50" }
    ]
  },
  {
    category: "Pizzas",
    icon: "🍕",
    items: [
      { name: "Margarita", price: "£8.50" },
      { name: "Double Peperoni", price: "£8.50" },
      { name: "Mediterranean Special", price: "£8.50" },
      { name: "Emparo Special", price: "£8.50" },
      { name: "Veggie Hot", price: "£8.50" },
      { name: "Veggie Special", price: "£8.50" },
      { name: "American Hot", price: "£8.50" },
      { name: "Peri Peri Special", price: "£8.50" },
      { name: "Tandoori Special", price: "£8.50" },
      { name: "BBQ Special", price: "£8.50" },
      { name: "Hawai Special", price: "£8.50" },
      { name: "Tuna Special", price: "£8.50" },
      { name: "Four Season", price: "£8.50" },
      { name: "Meat Lovers", price: "£8.50" }
    ]
  },
  {
    category: "Chicken",
    icon: "🍗",
    items: [
      { name: "Fried Chicken Wings (3 pcs)", price: "£1.50" },
      { name: "Fried Chicken Wings (6 pcs)", price: "£3.00" },
      { name: "Fried Chicken Strips (3 pcs)", price: "£2.00" },
      { name: "Fried Chicken Strips (6 pcs)", price: "£4.00" },
      { name: "Peri Peri Wings", price: "£4.20" },
      { name: "Peri Peri Strips", price: "£4.70" },
      { name: "Half Chicken", price: "£5.50" },
      { name: "Whole Chicken", price: "£10.50" }
    ]
  },
  {
    category: "Milkshakes",
    icon: "🥤",
    items: [
      { name: "Oreo Milkshake", price: "£3.50" },
      { name: "Kit Kat Milkshake", price: "£3.50" },
      { name: "Dates Milkshake", price: "£3.50" },
      { name: "Kinder Bueno Milkshake", price: "£3.50" },
      { name: "Mango Milkshake", price: "£3.50" }
    ]
  }
];