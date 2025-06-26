const express = require('express');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@libsql/client');

const app = express();
const PORT = process.env.PORT || 5000;

// Turso database client
const db = createClient({
  url: "libsql://emparo-periperi-flash.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTA4MDIzMDUsImlkIjoiNGNiZGQ0MjctZmY2NS00YzZkLTlkY2QtNGMwYTEwODkzNTUwIiwicmlkIjoiNDYzOGQ5OTQtM2IzNS00NGQ3LWI3MTYtNTExYWMwZmRmMWYzIn0.HkNAJW0di502eT7RbKojmIX0W32R4sstdsxWFjClpBwjGDVmRNWsJxnNY-CPfcuvmzqBXeQlLscnGgjDPjxsAQ",
});

app.use(express.json());
app.use('/attached_assets', express.static(path.join(__dirname, 'attached_assets')));

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
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emparo Peri Peri - Authentic Portuguese Flavors | London</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        /* Navigation */
        .navbar {
            background: white;
            padding: 1rem 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
        }
        
        .logo-icon {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        .logo-text {
            color: #333;
            font-size: 1.5rem;
            font-weight: 800;
        }
        
        .logo-subtext {
            color: #666;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
            align-items: center;
        }
        
        .nav-link {
            color: #666;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.3s;
            position: relative;
        }
        
        .nav-link:hover, .nav-link.active {
            color: #ff6b35;
        }
        
        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 3px;
            background: #ff6b35;
            border-radius: 2px;
        }
        
        .phone-btn {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }
        
        .phone-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            padding: 4rem 0;
            position: relative;
            overflow: hidden;
        }
        
        .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            min-height: 500px;
        }
        
        .hero-text {
            z-index: 2;
        }
        
        .hero-badge {
            background: rgba(0,0,0,0.3);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            margin-bottom: 2rem;
            display: inline-block;
        }
        
        .hero-title {
            font-size: 4rem;
            font-weight: 900;
            margin-bottom: 1.5rem;
            line-height: 1.1;
            color: #ffd700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero-subtitle {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: white;
        }
        
        .hero-description {
            font-size: 1.1rem;
            margin-bottom: 2.5rem;
            opacity: 0.95;
            line-height: 1.6;
        }
        
        .star-rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 2rem;
        }
        
        .stars {
            color: #ffd700;
            font-size: 1.2rem;
        }
        
        .rating-text {
            font-weight: 600;
            opacity: 0.9;
        }
        
        .hero-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .btn-primary {
            background: #4285f4;
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary:hover {
            background: #3367d6;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: #ffd700;
            color: #333;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-secondary:hover {
            background: #ffed4e;
            transform: translateY(-2px);
        }
        
        .hero-image {
            text-align: center;
            position: relative;
        }
        
        .hero-image img {
            max-width: 100%;
            height: auto;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        /* Popular Menu Section */
        .popular-section {
            padding: 4rem 0;
            background: white;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .section-title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #333;
            margin-bottom: 1rem;
        }
        
        .section-title .highlight {
            color: #ff6b35;
        }
        
        .section-description {
            font-size: 1.1rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .menu-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: all 0.3s;
            position: relative;
        }
        
        .menu-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        
        .menu-card-image {
            position: relative;
            height: 200px;
            overflow: hidden;
        }
        
        .menu-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;
        }
        
        .menu-card:hover .menu-card-image img {
            transform: scale(1.1);
        }
        
        .price-tag {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #ff6b35;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 1.1rem;
        }
        
        .menu-card-content {
            padding: 1.5rem;
        }
        
        .menu-card-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .menu-card-description {
            color: #666;
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 1rem;
        }
        
        .add-to-cart-btn {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
        }
        
        .add-to-cart-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }
        
        /* Full Menu Section */
        .full-menu-section {
            padding: 4rem 0;
            background: #f8f9fa;
        }
        
        .menu-categories {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }
        
        .category-btn {
            background: white;
            color: #666;
            padding: 0.75rem 1.5rem;
            border: 2px solid #e9ecef;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .category-btn.active {
            background: #ff6b35;
            color: white;
            border-color: #ff6b35;
        }
        
        .category-btn:hover {
            background: #ff6b35;
            color: white;
            border-color: #ff6b35;
        }
        
        .menu-list {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .menu-category-section {
            margin-bottom: 3rem;
        }
        
        .category-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 2rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #ff6b35;
        }
        
        .menu-items-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
        }
        
        .menu-list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            transition: all 0.3s;
        }
        
        .menu-list-item:hover {
            border-color: #ff6b35;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.1);
        }
        
        .menu-item-info {
            flex: 1;
        }
        
        .menu-item-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.25rem;
        }
        
        .menu-item-desc {
            font-size: 0.9rem;
            color: #666;
        }
        
        .menu-item-price {
            font-size: 1.3rem;
            font-weight: 700;
            color: #ff6b35;
            margin-left: 1rem;
        }
        
        .spice-level {
            display: flex;
            gap: 0.25rem;
            margin-top: 0.25rem;
        }
        
        .badge {
            background: #ff6b35;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-left: 0.5rem;
        }
        
        /* Contact Section */
        .contact-section {
            background: #4a4a4a;
            color: white;
            padding: 4rem 0;
        }
        
        .contact-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 4rem;
        }
        
        .contact-card {
            background: white;
            color: #333;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
        }
        
        .contact-card h3 {
            color: #ff6b35;
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .contact-card p {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .call-to-order-btn {
            background: #ff6b35;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            margin-top: 0.5rem;
        }
        
        /* Footer */
        .footer {
            background: #333;
            color: white;
            padding: 3rem 0 1rem;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .footer-section h4 {
            color: #ff6b35;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .footer-section ul {
            list-style: none;
        }
        
        .footer-section ul li {
            margin-bottom: 0.5rem;
        }
        
        .footer-section ul li a {
            color: #ccc;
            text-decoration: none;
        }
        
        .footer-section ul li a:hover {
            color: #ff6b35;
        }
        
        .footer-bottom {
            border-top: 1px solid #555;
            padding-top: 1rem;
            text-align: center;
            color: #999;
        }
        
        /* Shopping Cart */
        .cart-icon {
            position: relative;
            background: #ff6b35;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
            font-size: 1.2rem;
        }
        
        .cart-icon:hover {
            transform: scale(1.1);
        }
        
        .cart-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ffd700;
            color: #333;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 700;
        }
        
        .cart-sidebar {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: white;
            box-shadow: -4px 0 20px rgba(0,0,0,0.1);
            z-index: 1000;
            transition: right 0.3s;
            overflow-y: auto;
        }
        
        .cart-sidebar.open {
            right: 0;
        }
        
        .cart-header {
            background: #ff6b35;
            color: white;
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .cart-header h3 {
            font-size: 1.3rem;
            font-weight: 700;
        }
        
        .close-cart {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .cart-items {
            padding: 1rem;
        }
        
        .cart-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item-image {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            object-fit: cover;
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-name {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .cart-item-price {
            color: #ff6b35;
            font-weight: 700;
        }
        
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .quantity-btn {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            width: 30px;
            height: 30px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        
        .quantity-btn:hover {
            background: #e9ecef;
        }
        
        .cart-total {
            padding: 1.5rem;
            border-top: 2px solid #eee;
            background: #f8f9fa;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        
        .total-amount {
            font-size: 1.3rem;
            font-weight: 700;
            color: #ff6b35;
        }
        
        .checkout-btn {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 8px;
            font-weight: 700;
            width: 100%;
            margin-top: 1rem;
            cursor: pointer;
        }
        
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: #333;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .mobile-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .mobile-menu.active {
            display: block;
        }
        
        .mobile-nav-links {
            list-style: none;
            padding: 0;
        }
        
        .mobile-nav-links li {
            margin-bottom: 0.5rem;
        }
        
        .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        }
        
        .cart-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .mobile-menu-btn {
                display: block;
            }
            
            .hero-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .hero-title {
                font-size: 2.5rem;
            }
            
            .menu-grid {
                grid-template-columns: 1fr;
            }
            
            .hero-buttons {
                justify-content: center;
            }
            
            .cart-sidebar {
                width: 100%;
                right: -100%;
            }
        }
    </style>
</head>
<body>
    <!-- Cart Overlay -->
    <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
    
    <!-- Shopping Cart Sidebar -->
    <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
            <h3>Your Order</h3>
            <button class="close-cart" onclick="closeCart()">×</button>
        </div>
        <div class="cart-items" id="cartItems">
            <!-- Cart items will be populated here -->
        </div>
        <div class="cart-total" id="cartTotal">
            <div class="total-row">
                <span>Subtotal:</span>
                <span id="subtotal">£0.00</span>
            </div>
            <div class="total-row">
                <span>Delivery:</span>
                <span id="delivery">£2.50</span>
            </div>
            <div class="total-row">
                <strong class="total-amount">Total: <span id="total">£2.50</span></strong>
            </div>
            <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout</button>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="#" class="logo" onclick="showSection('home')">
                <div class="logo-icon">🔥</div>
                <div>
                    <div class="logo-text">EMPARO</div>
                    <div class="logo-subtext">PERI PERI</div>
                </div>
            </a>
            
            <ul class="nav-links">
                <li><a href="#" class="nav-link active" onclick="showSection('home')">Home</a></li>
                <li><a href="#" class="nav-link" onclick="showSection('menu')">Menu</a></li>
                <li><a href="#" class="nav-link" onclick="showSection('about')">About</a></li>
                <li><a href="#" class="nav-link" onclick="showSection('contact')">Contact</a></li>
                <li><a href="tel:02034416940" class="phone-btn">📞 020 3441 6940</a></li>
                <li>
                    <button class="cart-icon" onclick="openCart()">
                        🛒
                        <span class="cart-count" id="cartCount">0</span>
                    </button>
                </li>
            </ul>
            
            <button class="mobile-menu-btn" onclick="toggleMobileMenu()">☰</button>
            
            <div class="mobile-menu" id="mobileMenu">
                <ul class="mobile-nav-links">
                    <li><a href="#" class="nav-link" onclick="showSection('home')">Home</a></li>
                    <li><a href="#" class="nav-link" onclick="showSection('menu')">Menu</a></li>
                    <li><a href="#" class="nav-link" onclick="showSection('about')">About</a></li>
                    <li><a href="#" class="nav-link" onclick="showSection('contact')">Contact</a></li>
                    <li><a href="tel:02034416940" class="phone-btn">📞 Call Now</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Home Section -->
    <div id="homeSection">
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <div class="hero-text">
                    <div class="hero-badge">🔥 Fresh Stone Baked Pizza</div>
                    <h1 class="hero-title">PERI PERI</h1>
                    <h2 class="hero-subtitle">Authentic Grilled Chicken & Peri Peri Specialties</h2>
                    <div class="star-rating">
                        <div class="stars">★★★★★</div>
                        <span class="rating-text">4.9/5 Customer Rating</span>
                    </div>
                    <p class="hero-description">Experience the authentic taste of flame-grilled peri peri chicken, fresh stone-baked pizzas, and mouth-watering specialties that will ignite your taste buds.</p>
                    <div class="hero-buttons">
                        <button class="btn-primary" onclick="showSection('menu')">
                            📋 View Our Menu
                        </button>
                        <a href="tel:02034416940" class="btn-secondary">
                            📞 Order Now: 020 3441 6940
                        </a>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="/attached_assets/image_1750890915891.png" alt="Delicious Peri Peri Chicken" style="max-width: 500px;">
                </div>
            </div>
        </section>

        <!-- Popular Menu Items -->
        <section class="popular-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Popular <span class="highlight">Menu Items</span></h2>
                    <p class="section-description">Discover our most loved dishes, made fresh daily with authentic flavors</p>
                </div>
                <div class="menu-grid" id="popularItems">
                    <!-- Popular items will be loaded here -->
                </div>
            </div>
        </section>
    </div>

    <!-- Menu Section -->
    <div id="menuSection" style="display: none;">
        <section class="full-menu-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Our Complete <span class="highlight">Menu</span></h2>
                    <p class="section-description">Fresh ingredients, authentic flavors, and flame-grilled perfection</p>
                </div>

                <div class="menu-categories" id="menuCategories">
                    <button class="category-btn active" onclick="filterMenu('All')">All Items</button>
                </div>

                <div class="menu-list" id="menuList">
                    <!-- Menu items will be loaded here -->
                </div>
            </div>
        </section>
    </div>

    <!-- About Section -->
    <div id="aboutSection" style="display: none;">
        <section class="popular-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">About <span class="highlight">Emparo Peri Peri</span></h2>
                    <p class="section-description">Authentic peri peri flavors, fresh stone-baked pizzas, and premium quality ingredients since 2019.</p>
                </div>
            </div>
        </section>
    </div>

    <!-- Contact Section -->
    <div id="contactSection" style="display: none;">
        <section class="contact-section">
            <div class="container">
                <div class="contact-cards">
                    <div class="contact-card">
                        <h3>Order Now</h3>
                        <p>020 3441 6940</p>
                        <a href="tel:02034416940" class="call-to-order-btn">Call to Order</a>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <div class="logo" style="margin-bottom: 1rem;">
                            <div class="logo-icon">🔥</div>
                            <div>
                                <div class="logo-text" style="color: white;">EMPARO</div>
                                <div class="logo-subtext">PERI PERI</div>
                            </div>
                        </div>
                        <p>Authentic peri peri flavors, fresh stone-baked pizzas, and premium quality ingredients since 2019.</p>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#" onclick="showSection('home')">Home</a></li>
                            <li><a href="#" onclick="showSection('menu')">Menu</a></li>
                            <li><a href="#" onclick="showSection('about')">About</a></li>
                            <li><a href="#" onclick="showSection('contact')">Contact</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Contact Info</h4>
                        <ul>
                            <li>📍 24 Blackstock Road</li>
                            <li>Finsbury Park, London N4 2DW</li>
                            <li>📞 020 3441 6940</li>
                            <li>🕐 Daily 1 PM – 4 AM</li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Quality Promise</h4>
                        <ul>
                            <li>🔥 Fresh Daily</li>
                            <li>📖 Authentic Recipes</li>
                            <li>⭐ Premium Quality</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>&copy; 2024 Emparo Peri Peri. All rights reserved. | Privacy Policy | Terms of Service</p>
                </div>
            </div>
        </footer>
    </div>
    
    <script>
        let menuData = [];
        let currentCategory = 'All';
        let cart = [];
        
        function showSection(section) {
            // Hide all sections
            document.getElementById('homeSection').style.display = 'none';
            document.getElementById('menuSection').style.display = 'none';
            document.getElementById('aboutSection').style.display = 'none';
            document.getElementById('contactSection').style.display = 'none';
            
            // Update nav links
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            
            // Show selected section
            if (section === 'home') {
                document.getElementById('homeSection').style.display = 'block';
                document.querySelector('[onclick="showSection(\'home\')"]').classList.add('active');
                if (menuData.length === 0) {
                    loadMenu();
                }
            } else if (section === 'menu') {
                document.getElementById('menuSection').style.display = 'block';
                document.querySelector('[onclick="showSection(\'menu\')"]').classList.add('active');
                if (menuData.length === 0) {
                    loadMenu();
                }
            } else if (section === 'about') {
                document.getElementById('aboutSection').style.display = 'block';
                document.querySelector('[onclick="showSection(\'about\')"]').classList.add('active');
            } else if (section === 'contact') {
                document.getElementById('contactSection').style.display = 'block';
                document.querySelector('[onclick="showSection(\'contact\')"]').classList.add('active');
            }
            
            // Close mobile menu if open
            document.getElementById('mobileMenu').classList.remove('active');
        }
        
        function toggleMobileMenu() {
            document.getElementById('mobileMenu').classList.toggle('active');
        }
        
        function loadMenu() {
            fetch('/api/menu')
                .then(response => response.json())
                .then(data => {
                    menuData = data;
                    setupCategories();
                    renderMenu();
                    renderPopularItems();
                })
                .catch(error => {
                    console.error('Error loading menu:', error);
                });
        }
        
        function renderPopularItems() {
            const popularItems = menuData.filter(item => item.isCustomerFavorite === 1).slice(0, 6);
            const container = document.getElementById('popularItems');
            
            container.innerHTML = popularItems.map(item => {
                const imageHtml = item.image 
                    ? '<img src="/attached_assets/' + item.image + '" alt="' + item.name + '" onerror="this.parentElement.innerHTML=\'<div style=&quot;display:flex;align-items:center;justify-content:center;height:100%;background:#f3f4f6;color:#6b7280;font-size:3rem;&quot;>🍽️</div>\';">'
                    : '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f3f4f6;color:#6b7280;font-size:3rem;">🍽️</div>';
                
                return '<div class="menu-card">' +
                    '<div class="menu-card-image">' +
                        imageHtml +
                        '<div class="price-tag">£' + item.price + '</div>' +
                    '</div>' +
                    '<div class="menu-card-content">' +
                        '<h3 class="menu-card-title">' + item.name + '</h3>' +
                        '<p class="menu-card-description">' + (item.description || 'Delicious and fresh, made to order') + '</p>' +
                        '<button class="add-to-cart-btn" onclick="addToCart(' + item.id + ')">Add to Cart</button>' +
                    '</div>' +
                '</div>';
            }).join('');
        }
        
        function setupCategories() {
            const categories = ['All', ...new Set(menuData.map(item => item.category))];
            const categoriesContainer = document.getElementById('menuCategories');
            
            categoriesContainer.innerHTML = categories.map(category => 
                '<button class="category-btn ' + (category === currentCategory ? 'active' : '') + '" ' +
                    'onclick="filterMenu(\'' + category + '\')">' + category + '</button>'
            ).join('');
        }
        
        function filterMenu(category) {
            currentCategory = category;
            setupCategories();
            renderMenu();
        }
        
        function renderMenu() {
            const filteredItems = currentCategory === 'All' 
                ? menuData 
                : menuData.filter(item => item.category === currentCategory);
            
            const menuContainer = document.getElementById('menuList');
            
            // Group by category for display
            const grouped = {};
            filteredItems.forEach(item => {
                if (!grouped[item.category]) {
                    grouped[item.category] = [];
                }
                grouped[item.category].push(item);
            });
            
            menuContainer.innerHTML = Object.entries(grouped).map(([category, items]) => {
                const itemsHtml = items.map(item => {
                    const spiceIcons = item.spice_level > 0 ? '🔥'.repeat(item.spice_level) : '';
                    const favoriteIcon = item.isCustomerFavorite ? '<span class="badge">Popular</span>' : '';
                    const descHtml = item.description ? '<div class="menu-item-desc">' + item.description + '</div>' : '';
                    const spiceHtml = spiceIcons ? '<div class="spice-level">' + spiceIcons + '</div>' : '';
                    
                    return '<div class="menu-list-item">' +
                        '<div class="menu-item-info">' +
                            '<div class="menu-item-name">' + item.name + ' ' + favoriteIcon + '</div>' +
                            descHtml +
                            spiceHtml +
                        '</div>' +
                        '<div class="menu-item-price">£' + item.price + '</div>' +
                    '</div>';
                }).join('');
                
                return '<div class="menu-category-section">' +
                    '<h3 class="category-title">' + category + '</h3>' +
                    '<div class="menu-items-list">' + itemsHtml + '</div>' +
                '</div>';
            }).join('');
        }
        
        function addToCart(itemId) {
            const item = menuData.find(i => i.id === itemId);
            if (!item) return;
            
            const existingItem = cart.find(i => i.id === itemId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({...item, quantity: 1});
            }
            
            updateCartDisplay();
        }
        
        function removeFromCart(itemId) {
            const itemIndex = cart.findIndex(i => i.id === itemId);
            if (itemIndex > -1) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1);
                }
            }
            updateCartDisplay();
        }
        
        function updateCartDisplay() {
            const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cartCount').textContent = cartCount;
            
            const cartItems = document.getElementById('cartItems');
            const subtotalElement = document.getElementById('subtotal');
            const totalElement = document.getElementById('total');
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">Your cart is empty</div>';
                subtotalElement.textContent = '£0.00';
                totalElement.textContent = '£2.50';
                return;
            }
            
            cartItems.innerHTML = cart.map(item => 
                '<div class="cart-item">' +
                    '<div class="cart-item-info">' +
                        '<div class="cart-item-name">' + item.name + '</div>' +
                        '<div class="cart-item-price">£' + item.price + '</div>' +
                        '<div class="quantity-controls">' +
                            '<button class="quantity-btn" onclick="removeFromCart(' + item.id + ')">-</button>' +
                            '<span>' + item.quantity + '</span>' +
                            '<button class="quantity-btn" onclick="addToCart(' + item.id + ')">+</button>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            ).join('');
            
            const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            const delivery = subtotal >= 25 ? 0 : 2.50;
            const total = subtotal + delivery;
            
            subtotalElement.textContent = '£' + subtotal.toFixed(2);
            document.getElementById('delivery').textContent = delivery === 0 ? 'FREE' : '£' + delivery.toFixed(2);
            totalElement.textContent = '£' + total.toFixed(2);
        }
        
        function openCart() {
            document.getElementById('cartSidebar').classList.add('open');
            document.getElementById('cartOverlay').classList.add('active');
        }
        
        function closeCart() {
            document.getElementById('cartSidebar').classList.remove('open');
            document.getElementById('cartOverlay').classList.remove('active');
        }
        
        function proceedToCheckout() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            const orderSummary = cart.map(item => \`\${item.quantity}x \${item.name} - £\${(parseFloat(item.price) * item.quantity).toFixed(2)}\`).join('\\n');
            const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            const delivery = total >= 25 ? 0 : 2.50;
            const finalTotal = total + delivery;
            
            const message = 'Hello! I\'d like to place an order:\n\n' + orderSummary + '\n\nSubtotal: £' + total.toFixed(2) + '\nDelivery: ' + (delivery === 0 ? 'FREE' : '£' + delivery.toFixed(2)) + '\nTotal: £' + finalTotal.toFixed(2) + '\n\nThank you!';
            
            window.open('https://wa.me/442034416940?text=' + encodeURIComponent(message), '_blank');
        }
        
        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            showSection('home');
        });
    </script>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Emparo Peri Peri server running on port ${PORT}`);
});

module.exports = app;