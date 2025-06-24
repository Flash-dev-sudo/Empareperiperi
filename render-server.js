import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist/public')));

// API Routes (basic ones for the restaurant)
app.get('/api/menu', (req, res) => {
  const menu = {
    chicken: [
      { name: 'Whole Chicken', price: '£12.99', description: 'Flame-grilled whole chicken with authentic peri peri sauce' },
      { name: 'Half Chicken', price: '£7.99', description: 'Perfect portion of our signature peri peri chicken' },
      { name: 'Chicken Wings (6pcs)', price: '£6.99', description: 'Crispy wings with your choice of peri peri heat level' },
      { name: 'Chicken Strips', price: '£8.99', description: 'Tender chicken strips marinated in peri peri spices' }
    ],
    pizza: [
      { name: 'Margherita', price: '£9.99', description: 'Classic tomato base with fresh mozzarella and basil' },
      { name: 'Pepperoni', price: '£11.99', description: 'Spicy pepperoni with mozzarella on tomato base' },
      { name: 'Peri Peri Chicken Pizza', price: '£13.99', description: 'Our signature chicken with peri peri sauce and peppers' },
      { name: 'Vegetarian Supreme', price: '£10.99', description: 'Mixed vegetables with mozzarella and herbs' }
    ]
  };
  res.json(menu);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Emparo Peri Peri' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Emparo Peri Peri server running on port ${PORT}`);
});

export default app;