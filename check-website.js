import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// Simple queries without schema
const client = createClient({
  url: process.env.DATABASE_URL || "file:dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function checkWebsiteData() {
  console.log("🔍 CHECKING WEBSITE DATABASE TABLES...\n");

  try {
    // Check catalog tables (synced from queue)
    const catalogCategoryCount = await client.execute("SELECT COUNT(*) as count FROM catalog_categories");
    const catalogMenuItemCount = await client.execute("SELECT COUNT(*) as count FROM catalog_menu_items");

    // Check original website tables
    const menuItemCount = await client.execute("SELECT COUNT(*) as count FROM menu_items");
    const galleryCount = await client.execute("SELECT COUNT(*) as count FROM gallery");

    console.log(`📊 WEBSITE DATABASE STATS:`);
    console.log(`🔄 Catalog Categories (synced): ${catalogCategoryCount.rows[0].count}`);
    console.log(`🔄 Catalog Menu Items (synced): ${catalogMenuItemCount.rows[0].count}`);
    console.log(`📝 Original Menu Items: ${menuItemCount.rows[0].count}`);
    console.log(`🖼️ Gallery Items: ${galleryCount.rows[0].count}`);

    // Check sync events
    const syncEvents = await client.execute("SELECT COUNT(*) as count FROM sync_events");
    console.log(`📈 Sync Events: ${syncEvents.rows[0].count}`);

    // Sample data from catalog if exists
    if (catalogCategoryCount.rows[0].count > 0) {
      const categories = await client.execute("SELECT * FROM catalog_categories LIMIT 3");
      console.log("\n📋 CATALOG CATEGORIES (synced from queue):");
      categories.rows.forEach(cat => {
        console.log(`  - ID: ${cat.id}, QueueID: ${cat.queue_id}, Name: "${cat.name}", Icon: "${cat.icon}"`);
      });
    }

    if (catalogMenuItemCount.rows[0].count > 0) {
      const items = await client.execute("SELECT * FROM catalog_menu_items LIMIT 3");
      console.log("\n🍽️ CATALOG MENU ITEMS (synced from queue):");
      items.rows.forEach(item => {
        const price = (item.price / 100).toFixed(2);
        console.log(`  - ID: ${item.id}, QueueID: ${item.queue_id}, "${item.name}": £${price}`);
      });
    }

    // Sample original menu items
    if (menuItemCount.rows[0].count > 0) {
      const items = await client.execute("SELECT * FROM menu_items LIMIT 3");
      console.log("\n📝 ORIGINAL MENU ITEMS:");
      items.rows.forEach(item => {
        console.log(`  - ID: ${item.id}, "${item.name}": ${item.price} (${item.category})`);
      });
    }

    // Gallery items
    if (galleryCount.rows[0].count > 0) {
      const gallery = await client.execute("SELECT * FROM gallery LIMIT 3");
      console.log("\n🖼️ GALLERY ITEMS:");
      gallery.rows.forEach(item => {
        console.log(`  - ID: ${item.id}, "${item.title}" (${item.category})`);
      });
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  client.close();
}

checkWebsiteData();