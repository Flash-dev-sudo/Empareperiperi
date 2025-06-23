import { db } from "./db";
import { menuItems, gallery } from "@shared/schema";
import { menuData } from "../client/src/data/menu";

async function seedDatabase() {
  console.log("Seeding database...");

  // Seed menu items
  for (const category of menuData) {
    for (const item of category.items) {
      await db.insert(menuItems).values({
        name: item.name,
        category: category.category,
        price: item.price,
        description: item.description || "",
        spiceLevel: 0,
        isAvailable: 1
      }).onConflictDoNothing();
    }
  }

  // Seed gallery items
  const galleryItems = [
    {
      title: "Stone Baked Pizza",
      description: "Fresh stone-baked pizza with premium ingredients",
      imageUrl: "/attached_assets/ChatGPT Image May 18, 2025, 11_28_06 AM_1750005342083.png",
      category: "Pizza"
    },
    {
      title: "Peri Peri Chicken",
      description: "Perfectly grilled peri peri chicken with authentic spices",
      imageUrl: "/attached_assets/ChatGPT Image May 18, 2025, 12_05_21 PM_1750005342083.png",
      category: "Chicken"
    },
    {
      title: "Fresh Pizza",
      description: "Fresh stone-baked pizza with premium ingredients",
      imageUrl: "/attached_assets/ChatGPT Image May 18, 2025, 11_58_25 AM_1750005342083.png",
      category: "Pizza"
    }
  ];

  for (const item of galleryItems) {
    await db.insert(gallery).values(item).onConflictDoNothing();
  }

  console.log("Database seeded successfully!");
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };