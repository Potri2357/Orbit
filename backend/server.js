import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { initDatabase, query, getOne, run } from './database.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for Vercel, localhost, and tunnels
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());

// Create HTTP and WebSocket servers
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket clients management
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[WebSocket] Client connected. Total active clients: ${clients.size}`);

  // Send initial ping/connection ack
  ws.send(JSON.stringify({ event: 'connected', message: 'Orbit Frappe Realtime Engine Ready' }));

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WebSocket] Client disconnected. Total active clients: ${clients.size}`);
  });
});

const broadcast = (event, data) => {
  const payload = JSON.stringify({ event, data, timestamp: Date.now() });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
};

// -------------------------------------------------------------
// Frappe Framework Standard REST Endpoints
// -------------------------------------------------------------

// 1. Auth & Session Check
app.get('/api/method/frappe.auth.get_logged_user', (req, res) => {
  res.json({
    message: 'Administrator',
    user: 'arjun@aurastudios.in',
    full_name: 'Arjun Mathur',
    roles: ['System Manager', 'Operations Manager', 'Inventory User'],
    frappe_version: '15.4.1 (Orbit D2C Engine)'
  });
});

// 2. Generic Resource List (/api/resource/:doctype)
app.get('/api/resource/:doctype', async (req, res) => {
  const { doctype } = req.params;

  try {
    if (doctype === 'Item') {
      const items = await query('SELECT * FROM items');
      // format channel breakdown
      const formatted = items.map(item => ({
        ...item,
        channels: {
          shopify: item.shopify_stock,
          instagram: item.instagram_stock,
          marketplace: item.marketplace_stock,
          pos: item.pos_stock
        }
      }));
      return res.json({ data: formatted });
    }

    if (doctype === 'Sales Order') {
      const orders = await query('SELECT * FROM orders ORDER BY timestamp DESC');
      const formatted = orders.map(ord => ({
        ...ord,
        customer: {
          name: ord.customer_name,
          email: ord.customer_email,
          phone: ord.customer_phone,
          city: ord.customer_city,
          pincode: ord.customer_pincode
        },
        items: JSON.parse(ord.items_json || '[]'),
        tags: JSON.parse(ord.tags_json || '[]'),
        presence: JSON.parse(ord.presence_json || '[]')
      }));
      return res.json({ data: formatted });
    }

    if (doctype === 'Sales Invoice') {
      const invoices = await query('SELECT * FROM invoices ORDER BY id DESC');
      return res.json({ data: invoices });
    }

    if (doctype === 'Orbit Channel') {
      const channels = await query('SELECT * FROM channels');
      return res.json({ data: channels });
    }

    if (doctype === 'Orbit Activity') {
      const activities = await query('SELECT * FROM activities ORDER BY createdAt DESC LIMIT 50');
      return res.json({ data: activities });
    }

    res.status(404).json({ error: `DocType ${doctype} not found in Orbit Registry` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Generic Resource Detail (/api/resource/:doctype/:id)
app.get('/api/resource/:doctype/:id', async (req, res) => {
  const { doctype, id } = req.params;
  try {
    if (doctype === 'Item') {
      const item = await getOne('SELECT * FROM items WHERE id = ?', [id]);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      const movements = await query('SELECT * FROM stock_movements WHERE sku_id = ? ORDER BY createdAt DESC', [id]);
      return res.json({
        data: {
          ...item,
          channels: {
            shopify: item.shopify_stock,
            instagram: item.instagram_stock,
            marketplace: item.marketplace_stock,
            pos: item.pos_stock
          },
          movements
        }
      });
    }

    if (doctype === 'Sales Order') {
      const ord = await getOne('SELECT * FROM orders WHERE id = ?', [id]);
      if (!ord) return res.status(404).json({ error: 'Order not found' });
      return res.json({
        data: {
          ...ord,
          customer: {
            name: ord.customer_name,
            email: ord.customer_email,
            phone: ord.customer_phone,
            city: ord.customer_city,
            pincode: ord.customer_pincode
          },
          items: JSON.parse(ord.items_json || '[]'),
          tags: JSON.parse(ord.tags_json || '[]'),
          presence: JSON.parse(ord.presence_json || '[]')
        }
      });
    }

    res.status(404).json({ error: `Not implemented for ${doctype}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update Document Status / Values (/api/resource/:doctype/:id)
app.put('/api/resource/:doctype/:id', async (req, res) => {
  const { doctype, id } = req.params;
  const updates = req.body;

  try {
    if (doctype === 'Sales Order') {
      if (updates.status) {
        await run('UPDATE orders SET status = ? WHERE id = ?', [updates.status, id]);
        if (updates.tracking) {
          await run('UPDATE orders SET tracking = ? WHERE id = ?', [updates.tracking, id]);
        }
      }

      // Add activity
      const actId = 'act-' + Date.now();
      await run(`INSERT INTO activities VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        actId,
        'Just now',
        'fulfillment',
        'shopify',
        `Order ${id} updated to ${updates.status}`,
        `Status persisted to SQLite database. Realtime broadcast complete.`,
        Date.now()
      ]);

      broadcast('order_updated', { id, status: updates.status });
      return res.json({ message: 'Order updated successfully', data: { id, ...updates } });
    }

    res.status(400).json({ error: `Unsupported update on ${doctype}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Frappe RPC Custom Methods (/api/method/orbit.*)
// -------------------------------------------------------------

// Method: Inline Stock Update
app.post('/api/method/orbit.update_stock', async (req, res) => {
  const { skuId, channelKey, newQty, staff = 'Ops Team' } = req.body;
  if (!skuId || !channelKey || newQty === undefined) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const item = await getOne('SELECT * FROM items WHERE id = ?', [skuId]);
    if (!item) return res.status(404).json({ error: 'SKU not found' });

    const columnMap = {
      shopify: 'shopify_stock',
      instagram: 'instagram_stock',
      marketplace: 'marketplace_stock',
      pos: 'pos_stock'
    };
    const targetCol = columnMap[channelKey];
    if (!targetCol) return res.status(400).json({ error: 'Invalid channel' });

    const oldQty = item[targetCol];
    const qtyNum = Math.max(0, parseInt(newQty, 10));

    // Update channel stock and recalculate total
    await run(`UPDATE items SET ${targetCol} = ? WHERE id = ?`, [qtyNum, skuId]);

    const updated = await getOne('SELECT * FROM items WHERE id = ?', [skuId]);
    const newTotal = updated.shopify_stock + updated.instagram_stock + updated.marketplace_stock + updated.pos_stock;
    await run(`UPDATE items SET totalAvailable = ? WHERE id = ?`, [newTotal, skuId]);

    // Record movement
    const moveId = 'm-' + Date.now();
    await run(`INSERT INTO stock_movements VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
      moveId,
      skuId,
      'Just now',
      qtyNum - oldQty,
      channelKey,
      'Manual Inline Adjustment',
      staff,
      Date.now()
    ]);

    broadcast('stock_updated', {
      skuId,
      channelKey,
      newQty: qtyNum,
      totalAvailable: newTotal
    });

    res.json({
      message: 'Stock updated',
      data: { skuId, channelKey, newQty: qtyNum, totalAvailable: newTotal }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Method: Bulk Update Orders Status
app.post('/api/method/orbit.bulk_update_orders', async (req, res) => {
  const { orderIds, targetStatus } = req.body;
  if (!orderIds || !targetStatus) return res.status(400).json({ error: 'Missing parameters' });

  try {
    for (const id of orderIds) {
      await run('UPDATE orders SET status = ? WHERE id = ?', [targetStatus, id]);
    }

    broadcast('orders_bulk_updated', { orderIds, targetStatus });
    res.json({ message: `${orderIds.length} orders updated to ${targetStatus}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Method: Reconcile Invoice
app.post('/api/method/orbit.reconcile_invoice', async (req, res) => {
  const { invoiceId } = req.body;
  try {
    await run("UPDATE invoices SET reconciliationStatus = 'Matched', discrepancyAmount = 0 WHERE id = ?", [invoiceId]);
    broadcast('invoice_reconciled', { invoiceId });
    res.json({ message: 'Invoice reconciled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Method: Simulate Incoming Live Sale
app.post('/api/method/orbit.simulate_sale', async (req, res) => {
  try {
    const items = await query('SELECT * FROM items');
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const channels = ['shopify', 'instagram', 'marketplace', 'pos'];
    const randomChannel = channels[Math.floor(Math.random() * channels.length)];
    const newOrderNum = 4530 + Math.floor(Math.random() * 500);
    const newOrderId = `ORD-${newOrderNum}`;

    const names = ['Aarav Patel', 'Diya Sengupta', 'Kabir Malhotra', 'Meenakshi Sundaram', 'Tanvi Joshi'];
    const randomCustomer = names[Math.floor(Math.random() * names.length)];

    const itemsJson = JSON.stringify([
      { sku: randomItem.id, name: randomItem.name, qty: 1, price: randomItem.unitPrice }
    ]);

    const gst = Math.round(randomItem.unitPrice * (randomItem.gstRate / 100));

    // 1. Insert order
    await run(`INSERT INTO orders (
      id, orderNumber, customer_name, customer_email, customer_phone, customer_city, customer_pincode,
      channel, status, items_json, subtotal, gst, shipping, total, placedAt, timestamp,
      paymentMethod, paymentStatus, priority, tags_json, tracking, presence_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      newOrderId,
      `#${newOrderNum}`,
      randomCustomer,
      `customer${newOrderNum}@example.com`,
      '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      'Bengaluru, KA',
      '560038',
      randomChannel,
      'placed',
      itemsJson,
      randomItem.unitPrice,
      gst,
      0,
      randomItem.unitPrice,
      'Just now',
      Date.now(),
      'UPI Instant',
      'Paid',
      'high',
      '["Live Sync Event"]',
      null,
      '[]'
    ]);

    // 2. Decrement stock from the channel
    const columnMap = {
      shopify: 'shopify_stock',
      instagram: 'instagram_stock',
      marketplace: 'marketplace_stock',
      pos: 'pos_stock'
    };
    const col = columnMap[randomChannel];
    const newChannelStock = Math.max(0, randomItem[col] - 1);
    await run(`UPDATE items SET ${col} = ? WHERE id = ?`, [newChannelStock, randomItem.id]);

    const updatedItem = await getOne('SELECT * FROM items WHERE id = ?', [randomItem.id]);
    const newTotal = updatedItem.shopify_stock + updatedItem.instagram_stock + updatedItem.marketplace_stock + updatedItem.pos_stock;
    await run(`UPDATE items SET totalAvailable = ? WHERE id = ?`, [newTotal, randomItem.id]);

    // 3. Movement log
    await run(`INSERT INTO stock_movements VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
      'm-' + Date.now(),
      randomItem.id,
      'Just now',
      -1,
      randomChannel,
      `Order #${newOrderNum} (Live)`,
      'Frappe Realtime Engine',
      Date.now()
    ]);

    // 4. Update channel metrics
    await run(`UPDATE channels SET ordersToday = ordersToday + 1, revenueToday = revenueToday + ?, lastSync = 'Just now' WHERE id = ?`, [
      randomItem.unitPrice,
      randomChannel
    ]);

    // 5. Activity log
    await run(`INSERT INTO activities VALUES (?, ?, ?, ?, ?, ?, ?)`, [
      'act-' + Date.now(),
      'Just now',
      'sale',
      randomChannel,
      `Realtime: Order #${newOrderNum} placed (${randomChannel.toUpperCase()})`,
      `₹${randomItem.unitPrice.toLocaleString('en-IN')} received. Available stock for ${randomItem.id} decremented in SQLite database.`,
      Date.now()
    ]);

    // Broadcast live event to all connected frontends
    broadcast('new_sale', {
      orderId: newOrderId,
      orderNumber: `#${newOrderNum}`,
      customer: randomCustomer,
      channel: randomChannel,
      total: randomItem.unitPrice,
      skuId: randomItem.id,
      newTotalAvailable: newTotal
    });

    res.json({
      message: 'Sale simulated successfully',
      data: { orderId: newOrderId, total: randomItem.unitPrice, channel: randomChannel }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Method: Synchronize All Channels
app.post('/api/method/orbit.sync_channels', async (req, res) => {
  try {
    await run("UPDATE channels SET lastSync = 'Just now', latency = '65ms'");

    await run(`INSERT INTO activities VALUES (?, ?, ?, ?, ?, ?, ?)`, [
      'act-' + Date.now(),
      'Just now',
      'sync',
      'shopify',
      'Full Multi-Channel Sync Executed',
      'All 4 storefront inventories reconciled to zero drift against central database.',
      Date.now()
    ]);

    broadcast('channels_synced', { timestamp: Date.now() });
    res.json({ message: 'All channels synchronized' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const ordersCount = await getOne('SELECT COUNT(*) as c FROM orders');
    const itemsCount = await getOne('SELECT COUNT(*) as c FROM items');

    res.json({
      status: 'healthy',
      engine: 'Frappe Orbit Backend v15.4.1',
      database: 'SQLite (Relational Storage)',
      activeWebSockets: clients.size,
      records: {
        orders: ordersCount.c,
        items: itemsCount.c
      },
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Initialize DB and start listening
initDatabase()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(`🚀 Orbit Frappe-Compliant Backend running on port ${PORT}`);
      console.log(`📡 REST API: http://localhost:${PORT}/api/resource/...`);
      console.log(`⚡ WebSocket Stream: ws://localhost:${PORT}`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
