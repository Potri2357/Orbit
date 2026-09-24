import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'orbit_database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to Orbit SQLite database at:', dbPath);
  }
});

// Wrap DB run/get/all in Promises
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const initDatabase = async () => {
  // 1. Channels table
  await run(`
    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      ordersToday INTEGER DEFAULT 0,
      revenueToday REAL DEFAULT 0,
      latency TEXT,
      lastSync TEXT,
      autoSync INTEGER DEFAULT 1,
      webhookUrl TEXT,
      storeUrl TEXT
    )
  `);

  // 2. Inventory Items table
  await run(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unitPrice REAL NOT NULL,
      costPrice REAL NOT NULL,
      threshold INTEGER NOT NULL,
      shopify_stock INTEGER DEFAULT 0,
      instagram_stock INTEGER DEFAULT 0,
      marketplace_stock INTEGER DEFAULT 0,
      pos_stock INTEGER DEFAULT 0,
      totalAvailable INTEGER NOT NULL,
      hsn TEXT,
      gstRate REAL DEFAULT 12,
      image TEXT
    )
  `);

  // 3. Stock Movements audit table
  await run(`
    CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      sku_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      delta INTEGER NOT NULL,
      channel TEXT NOT NULL,
      reason TEXT NOT NULL,
      staff TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    )
  `);

  // 4. Sales Orders table
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      orderNumber TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      customer_city TEXT,
      customer_pincode TEXT,
      channel TEXT NOT NULL,
      status TEXT NOT NULL,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      gst REAL NOT NULL,
      shipping REAL DEFAULT 0,
      total REAL NOT NULL,
      placedAt TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      paymentMethod TEXT,
      paymentStatus TEXT,
      priority TEXT,
      tags_json TEXT,
      tracking TEXT,
      presence_json TEXT
    )
  `);

  // 5. Invoices table
  await run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoiceNumber TEXT NOT NULL,
      orderNumber TEXT NOT NULL,
      customer TEXT NOT NULL,
      channel TEXT NOT NULL,
      date TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL,
      subtotal REAL NOT NULL,
      cgst REAL DEFAULT 0,
      sgst REAL DEFAULT 0,
      igst REAL DEFAULT 0,
      total REAL NOT NULL,
      reconciliationStatus TEXT NOT NULL,
      discrepancyAmount REAL DEFAULT 0,
      discrepancyReason TEXT,
      gatewayRef TEXT
    )
  `);

  // 6. Activities table
  await run(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      time TEXT NOT NULL,
      type TEXT NOT NULL,
      channel TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    )
  `);

  // Check if seeding is required
  const channelCount = await getOne('SELECT COUNT(*) as count FROM channels');
  if (channelCount.count === 0) {
    console.log('Seeding initial Frappe Orbit database...');

    // Seed Channels
    await run(`INSERT INTO channels VALUES 
      ('shopify', 'Shopify Storefront', 'shopify', 'connected', 24, 184500, '110ms', 'Just now', 1, 'https://api.orbitops.io/v1/webhooks/shopify_aura', 'https://aurastudios.in'),
      ('instagram', 'Instagram / Meta Shop', 'instagram', 'connected', 11, 74200, '190ms', '1 min ago', 1, 'https://api.orbitops.io/v1/webhooks/ig_aura', 'https://instagram.com/aurastudios.in'),
      ('marketplace', 'Amazon & Myntra Marketplace', 'marketplace', 'connected', 18, 98600, '165ms', '3 mins ago', 1, 'https://api.orbitops.io/v1/webhooks/marketplaces', 'https://amazon.in/shops/aura-studios'),
      ('pos', 'Indiranagar Flagship POS', 'pos', 'connected', 7, 26950, '45ms', 'Realtime (LAN)', 1, 'https://api.orbitops.io/v1/webhooks/pos_bengaluru', 'Terminal #01 — Indiranagar 100ft Rd')
    `);

    // Seed Items
    await run(`INSERT INTO items VALUES
      ('SKU-LIN-001', 'Bespoke Linen Overshirt - Sand', 'Tops', 3499, 1200, 15, 28, 12, 16, 6, 62, '6205', 12, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80'),
      ('SKU-DRS-004', 'Flora Midi Wrap Dress - Olive', 'Dresses', 4299, 1550, 20, 4, 2, 0, 2, 8, '6204', 12, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80'),
      ('SKU-TRS-009', 'Pleated Tapered Linen Trousers', 'Bottoms', 2899, 950, 12, 35, 18, 22, 10, 85, '6203', 12, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&auto=format&fit=crop&q=80'),
      ('SKU-ACC-012', 'Handcrafted Vegetable-Tan Belt', 'Accessories', 1999, 620, 10, 1, 1, 0, 1, 3, '4203', 18, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&auto=format&fit=crop&q=80'),
      ('SKU-JKT-003', 'Indigo Washed Kimono Jacket', 'Outerwear', 5499, 2100, 15, 18, 8, 12, 5, 43, '6201', 12, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80'),
      ('SKU-TEE-002', 'Organic Slub Cotton Tee - Oatmeal', 'Tops', 1499, 420, 30, 52, 24, 45, 18, 139, '6109', 5, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80')
    `);

    // Seed Orders
    await run(`INSERT INTO orders VALUES
      ('ORD-4529', '#4529', 'Aditi Sharma', 'aditi.s@gmail.com', '+91 98450 12891', 'Bengaluru, KA', '560038', 'shopify', 'placed', 
       '[{"sku":"SKU-TRS-009","name":"Pleated Tapered Linen Trousers","qty":1,"price":2899},{"sku":"SKU-TEE-002","name":"Organic Slub Cotton Tee - Oatmeal","qty":2,"price":1499}]', 
       5897, 563, 0, 5897, '4 mins ago', ${Date.now() - 240000}, 'Razorpay UPI', 'Paid', 'high', '["Express Delivery"]', null, '["Arjun M."]'),
      ('ORD-4528', '#4528', 'Rohan Mehra', 'rohan.m@outlook.com', '+91 99201 44521', 'Mumbai, MH', '400050', 'instagram', 'packed',
       '[{"sku":"SKU-LIN-001","name":"Bespoke Linen Overshirt - Sand","qty":1,"price":3499},{"sku":"SKU-JKT-003","name":"Indigo Washed Kimono Jacket","qty":1,"price":5499}]',
       8998, 964, 0, 8998, '22 mins ago', ${Date.now() - 1320000}, 'Credit Card', 'Paid', 'medium', '["VIP Client"]', 'DELHIVERY_BOM_998124', '[]'),
      ('ORD-4527', '#4527', 'Dr. Sneha Pillai', 'sneha.pillai@aiims.edu', '+91 97112 88203', 'New Delhi, DL', '110029', 'shopify', 'shipped',
       '[{"sku":"SKU-DRS-004","name":"Flora Midi Wrap Dress - Olive","qty":1,"price":4299}]',
       4299, 460, 150, 4449, '1 hour ago', ${Date.now() - 3600000}, 'Razorpay UPI', 'Paid', 'medium', '["Gift Packaging"]', 'BLUEDART_DEL_771249', '["Meera S."]'),
      ('ORD-4526', '#4526', 'Karan Singhal', 'karan@singhalenterprises.com', '+91 94140 33819', 'Jaipur, RJ', '302001', 'marketplace', 'delivered',
       '[{"sku":"SKU-LIN-001","name":"Bespoke Linen Overshirt - Sand","qty":2,"price":3499}]',
       6998, 750, 0, 6998, '3 hours ago', ${Date.now() - 10800000}, 'Amazon Pay', 'Settled', 'low', '["Prime Dispatch"]', 'AMZN_LOG_994112', '[]')
    `);

    // Seed Invoices
    await run(`INSERT INTO invoices VALUES
      ('INV-2024-0418', 'INV-0418', '#4529', 'Aditi Sharma', 'shopify', '2026-09-24', '2026-09-24', 'Draft', 5334, 281.5, 281.5, 0, 5897, 'Matched', 0, null, 'pay_N8mKx991'),
      ('INV-2024-0417', 'INV-0417', '#4528', 'Rohan Mehra', 'instagram', '2026-09-24', '2026-09-24', 'Sent', 8034, 0, 0, 964, 8998, 'Matched', 0, null, 'meta_pay_88192'),
      ('INV-2024-0416', 'INV-0416', '#4527', 'Dr. Sneha Pillai', 'shopify', '2026-09-24', '2026-09-24', 'Reconciled', 3989, 0, 0, 460, 4449, 'Matched', 0, null, 'pay_N7Lpz330'),
      ('INV-2024-0415', 'INV-0415', '#4526', 'Karan Singhal', 'marketplace', '2026-09-23', '2026-09-30', 'Reconciled', 6248, 0, 0, 750, 6998, 'Discrepancy', -85, 'Marketplace TDS withholding discrepancy', 'amzn_settle_0081')
    `);

    // Seed Activities
    await run(`INSERT INTO activities VALUES
      ('act-1', '2 mins ago', 'sale', 'shopify', 'New Order #4529 received', 'Aditi Sharma placed an order for ₹5,897 (2 items). Live stock automatically reserved in DB.', ${Date.now() - 120000}),
      ('act-2', '12 mins ago', 'sync', 'instagram', 'Instagram Catalog Synced', '14 SKUs updated across Meta Commerce catalog with 0 drift.', ${Date.now() - 720000}),
      ('act-3', '24 mins ago', 'fulfillment', 'shopify', 'Order #4528 marked Packed', 'Arjun verified barcode scan; Delhivery airway bill generated.', ${Date.now() - 1440000})
    `);

    console.log('Seeding completed successfully.');
  }
};
