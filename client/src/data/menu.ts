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
    icon: "🟠",
    items: [
      { name: "Chips", price: "£2.50" },
      { name: "Peri Peri Chips", price: "£3.00" },
      { name: "Chips with Cheese", price: "£4.00" },
      { name: "Potato Wedges", price: "£3.00" },
      { name: "Potato Wedges with Cheese", price: "£4.00" },
      { name: "5 Gamberoni", price: "£5.00" },
      { name: "Fish Fingers", price: "£4.00" },
      { name: "5 Calamari", price: "£4.50" },
      { name: "10 Onion Rings", price: "£4.50" },
      { name: "Mozzarella Sticks", price: "£4.00" },
      { name: "Rice", price: "£2.50" },
      { name: "Salad", price: "£2.50" },
      { name: "Coleslaw", price: "£3.00" }
    ]
  },
  {
    category: "Buckets",
    icon: "🍗",
    items: [
      { name: "Wings Bucket", price: "£13.50", description: "15 Wings, 2 Fries & 1 Bottle Drink" },
      { name: "Mix Bucket", price: "£20.00", description: "2 Strip Burgers, 2 Fried Wraps, 6 Fried Wings, 1 Box Chips & 1 Bottle Drink" }
    ]
  },
  {
    category: "Desserts",
    icon: "🍰",
    items: [
      { name: "Chocolate Fudge Cake", price: "£3.00" },
      { name: "Strawberry Cheesecake", price: "£3.00" },
      { name: "Ben & Jerry Ice Cream", price: "£6.49" }
    ]
  },
  {
    category: "Shakes",
    icon: "🥤",
    items: [
      { name: "Kinder Bueno Shake", price: "£3.50" },
      { name: "Dates Shake", price: "£3.50" },
      { name: "Mango Shake", price: "£3.50" },
      { name: "Oreo Shake", price: "£3.50" },
      { name: "Lotus Biscoff Shake", price: "£3.50" }
    ]
  },
  {
    category: "Peri Peri Chicken",
    icon: "🌯",
    items: [
      { name: "Fried Wrap", price: "£4.00" },
      { name: "Falafel Wrap", price: "£4.00" },
      { name: "Peri Peri Wrap", price: "£4.50" },
      { name: "Peri Peri Burger", price: "£5.00" },
      { name: "Peri Peri Wings", price: "£4.20" },
      { name: "Peri Peri Strips", price: "£4.70" }
    ]
  },
  {
    category: "Grilled Chicken",
    icon: "🔥",
    items: [
      { name: "Quarter Grilled Chicken", price: "£4.00" },
      { name: "Half Grilled Chicken", price: "£5.50" },
      { name: "Whole Grilled Chicken", price: "£10.50" },
      { name: "Grilled Strips with Rice", price: "£7.50" }
    ]
  },
  {
    category: "Pizzas",
    icon: "🍕",
    items: [
      { name: "Margherita", price: "£8.50" },
      { name: "Cheese & Tomato", price: "£8.50" },
      { name: "Double Pepperoni", price: "£8.50" },
      { name: "Emparo Pizza", price: "£8.50" },
      { name: "Ham & Mushroom", price: "£8.50" },
      { name: "Mediterranean Special", price: "£8.50" },
      { name: "Tuna Special", price: "£8.50" },
      { name: "Veggie Special", price: "£8.50" },
      { name: "Veggies Hot", price: "£8.50" },
      { name: "American Hot", price: "£8.50" },
      { name: "Four Season", price: "£8.50" },
      { name: "BBQ Special", price: "£8.50" },
      { name: "Peri Peri Special", price: "£8.50" },
      { name: "Tandoori Special", price: "£8.50" },
      { name: "Hawaii Special", price: "£8.50" }
    ]
  },
  {
    category: "Burgers & More",
    icon: "🍔",
    items: [
      { name: "Chicken Strip Burger", price: "£2.50", description: "Add drink/fries +£1.50" },
      { name: "Chicken Fillet Burger", price: "£3.50" },
      { name: "Zinger Burger", price: "£4.00" },
      { name: "Fish/Veg Burger", price: "£3.50" },
      { name: "Emparo Burger", price: "£6.50", description: "Signature burger" },
      { name: "Tower Burger", price: "£5.00" },
      { name: "Quarter Pounder", price: "£4.00" },
      { name: "Half Pounder", price: "£5.00" },
      { name: "Peri Peri Chicken Burger", price: "£4.50" },
      { name: "Gourmet Burger", price: "£4.50" },
      { name: "Veggie Burger", price: "£3.50" },
      { name: "Fish Burger", price: "£3.00" }
    ]
  },
  {
    category: "Platters",
    icon: "🍽️",
    items: [
      { name: "Wings Platter", price: "£15.49", description: "15 Wings, 2 Sides & 2 Drinks" },
      { name: "EFC Special", price: "£7.00", description: "Fillet Burger, 3 Wings, Chips & Drink" },
      { name: "Burger Feast", price: "£24.49", description: "3 Peri Burgers, 8 Peri Wings, 2 Sides & Bottle Drink" },
      { name: "Strip Platter", price: "£15.49", description: "15 Strips, 2 Sides & 2 Drinks" },
      { name: "Variety Platter", price: "£24.00", description: "Whole Chicken (quartered), 5 Wings, 5 Strips, 2 Sides & Bottle Drink" },
      { name: "Emparo Special", price: "£22.50", description: "Half Chicken, 2 Peri Burgers, 5 Peri Wings, 2 Sides & Bottle Drink" },
      { name: "Feast Platter", price: "£38.49", description: "2 Whole Chickens (quartered), 8 Wings, 8 Strips, 3 Sides & Bottle Drink" }
    ]
  },
  {
    category: "Sides & Add-ons",
    icon: "🍟",
    items: [
      { name: "Add Fries & Drink", price: "£1.80" },
      { name: "6 Nuggets", price: "£3.00" },
      { name: "6 Buffalo Wings", price: "£4.50" },
      { name: "6 BBQ Wings", price: "£4.50" },
      { name: "6 Fried Wings", price: "£3.00" },
      { name: "6 Fried Strips", price: "£4.00" },
      { name: "6 Pcs Chicken Nuggets", price: "£3.00" },
      { name: "5 Pcs Peri Peri Strips", price: "£4.50" }
    ]
  }
];
