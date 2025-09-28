import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import fs from 'fs';

// Website database
const client = createClient({
  url: process.env.DATABASE_URL || "file:dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function backupWebsiteData() {
  console.log("🔍 BACKING UP WEBSITE DATA...\n");

  const backup = {
    timestamp: new Date().toISOString(),
    data: {}
  };

  try {
    // Check what tables exist first
    const tables = await client.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    console.log("📋 Found tables:", tables.rows.map(t => t.name).join(', '));

    // Backup each table's data
    for (const table of tables.rows) {
      const tableName = table.name;
      try {
        const data = await client.execute(`SELECT * FROM ${tableName}`);
        backup.data[tableName] = {
          count: data.rows.length,
          rows: data.rows
        };
        console.log(`✅ ${tableName}: ${data.rows.length} records`);

        // Show sample data for important tables
        if (['menu_items', 'gallery', 'orders'].includes(tableName) && data.rows.length > 0) {
          console.log(`   Sample: ${JSON.stringify(data.rows[0], null, 2)}`);
        }
      } catch (error) {
        console.log(`❌ Error backing up ${tableName}: ${error.message}`);
        backup.data[tableName] = { error: error.message };
      }
    }

    // Save backup to file
    const backupFile = `website-backup-${Date.now()}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`\n💾 Backup saved to: ${backupFile}`);

    // Summary
    const totalRecords = Object.values(backup.data)
      .filter(d => !d.error)
      .reduce((sum, d) => sum + d.count, 0);

    console.log(`\n📊 BACKUP SUMMARY:`);
    console.log(`✅ Tables backed up: ${Object.keys(backup.data).length}`);
    console.log(`✅ Total records: ${totalRecords}`);

    // Check for important data
    const importantTables = ['menu_items', 'gallery', 'orders', 'users'];
    const hasImportantData = importantTables.some(table =>
      backup.data[table] && backup.data[table].count > 0
    );

    if (hasImportantData) {
      console.log(`\n⚠️  IMPORTANT DATA FOUND - Will migrate to queue database`);
    } else {
      console.log(`\n✅ No critical data found - Safe to switch to queue database`);
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  client.close();
}

backupWebsiteData();