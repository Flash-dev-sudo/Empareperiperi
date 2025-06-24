const express = require('express');
const path = require('path');
const { createClient } = require('@libsql/client');

const app = express();
const PORT = process.env.PORT || 5000;

// Turso database client
const db = createClient({
  url: "libsql://emparo-periperi-flash.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTA4MDIzMDUsImlkIjoiNGNiZGQ0MjctZmY2NS00YzZkLTlkY2QtNGMwYTEwODkzNTUwIiwicmlkIjoiNDYzOGQ5OTQtM2IzNS00NGQ3LWI3MTYtNTExYWMwZmRmMWYzIn0.HkNAJW0di502eT7RbKojmIX0W32R4sstdsxWFjClpBwjGDVmRNWsJxnNY-CPfcuvmzqBXeQlLscnGgjDPjxsAQ",
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist/public')));

// API Routes
app.get('/api/menu', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM menu_items WHERE is_available = 1 ORDER BY category, name');
    res.json(result.rows);
  } catch (error) {
    console.error('Menu API error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM gallery WHERE is_active = 1 ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Gallery API error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, orderItems, totalAmount, orderType, deliveryAddress, notes } = req.body;
    
    const result = await db.execute({
      sql: `INSERT INTO orders (customer_name, customer_phone, customer_email, order_items, total_amount, order_type, delivery_address, notes, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      args: [customerName, customerPhone, customerEmail || '', JSON.stringify(orderItems), totalAmount, orderType, deliveryAddress || '', notes || '']
    });
    
    res.json({ success: true, orderId: result.lastInsertRowid });
  } catch (error) {
    console.error('Order submission error:', error);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Emparo Peri Peri' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Emparo Peri Peri server running on port ${PORT}`);
});

module.exports = app;