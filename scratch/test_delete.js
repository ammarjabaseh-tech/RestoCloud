const { Client } = require("pg");

async function run() {
  const client = new Client({
    user: "ammarjabaseh",
    host: "localhost",
    database: "RestoCloud",
    password: "Aa0949920306#",
    port: 5432
  });

  try {
    await client.connect();
    console.log("Connected to RestoCloud database.");
    
    // Check categories
    const catsRes = await client.query("SELECT * FROM categories");
    console.log("=== Categories in DB ===");
    for (const row of catsRes.rows) {
      console.log(`Cat ID: ${row.id}, NameAr: ${row.name_ar}`);
    }

    // Check menu items count for each category
    const itemsCount = await client.query("SELECT category_id, COUNT(*) FROM menu_items GROUP BY category_id");
    console.log("\n=== Menu Items count per Category ===");
    for (const row of itemsCount.rows) {
      console.log(`Cat ID: ${row.category_id}, Count: ${row.count}`);
    }

    // Check printers categories
    const prtCats = await client.query("SELECT * FROM printer_categories");
    console.log("\n=== Printer Categories ===");
    for (const row of prtCats.rows) {
      console.log(`Printer ID: ${row.printer_id}, Category ID: ${row.category_id}`);
    }
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await client.end();
  }
}
run();
