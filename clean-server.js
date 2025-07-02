const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('attached_assets'));

// Database setup
const db = new sqlite3.Database(':memory:');

// Initialize database with your menu items
db.serialize(() => {
  db.run(`CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image TEXT,
    spice_level INTEGER DEFAULT 0,
    is_available INTEGER DEFAULT 1,
    is_customer_favorite INTEGER DEFAULT 0
  )`);

  // Insert your menu data
  const menuItems = [
    {name: 'Peri Peri Wings', category: 'Chicken', price: 8.99, description: 'Spicy grilled wings with authentic peri peri sauce', image: 'ChatGPT Image May 22, 2025, 10_30_04 PM_1750891379901.png', spice_level: 3, is_customer_favorite: 1},
    {name: 'Emparo Burger', category: 'Mains', price: 9.99, description: 'Our signature chicken burger with peri peri sauce', image: 'ChatGPT Image May 22, 2025, 10_30_54 PM_1750891379902.png', spice_level: 2, is_customer_favorite: 1},
    {name: 'Fried Chicken Wings (6 pcs)', category: 'Chicken', price: 7.99, description: 'Crispy fried chicken wings', image: 'ChatGPT Image May 22, 2025, 10_36_30 PM_1750891379903.png', spice_level: 1, is_customer_favorite: 1},
    {name: 'Regular Fries', category: 'Sides', price: 3.99, description: 'Golden crispy fries', image: 'ChatGPT Image May 22, 2025, 10_28_27 PM_1750891379901.png', spice_level: 0},
    {name: 'Kinder Bueno Milkshake', category: 'Milkshakes', price: 4.99, description: 'Creamy milkshake with Kinder Bueno', image: 'ChatGPT Image May 22, 2025, 10_32_14 PM_1750891379902.png', spice_level: 0, is_customer_favorite: 1},
    {name: 'Emparo Special Pizza', category: 'Pizzas', price: 12.99, description: 'Our signature pizza with peri peri chicken', image: 'ChatGPT Image May 22, 2025, 10_30_54 PM_1750891379902.png', spice_level: 2, is_customer_favorite: 1}
  ];

  const stmt = db.prepare(`INSERT INTO menu_items (name, category, price, description, image, spice_level, is_customer_favorite) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  menuItems.forEach(item => {
    stmt.run(item.name, item.category, item.price, item.description, item.image, item.spice_level, item.is_customer_favorite);
  });
  stmt.finalize();
});

// API Routes
app.get('/api/menu', (req, res) => {
  db.all("SELECT * FROM menu_items WHERE is_available = 1", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Main route
app.get('/', (req, res) => {
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
        
        .navbar {
            background: white;
            padding: 1rem 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
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
            font-size: 1.5rem;
            font-weight: 800;
            color: #ff6b35;
            text-decoration: none;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
            align-items: center;
        }
        
        .nav-link {
            color: #666;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            cursor: pointer;
        }
        
        .nav-link:hover, .nav-link.active {
            color: #ff6b35;
        }
        
        .hero-section {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            padding: 8rem 0 6rem;
            color: white;
            text-align: center;
        }
        
        .hero-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .hero-title {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero-subtitle {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .btn-primary {
            background: white;
            color: #ff6b35;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            margin: 0.5rem;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .menu-section {
            padding: 6rem 0;
            background: white;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .section-title {
            text-align: center;
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #333;
        }
        
        .section-subtitle {
            text-align: center;
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 4rem;
        }
        
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .menu-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .menu-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        
        .menu-card-image {
            height: 250px;
            position: relative;
            overflow: hidden;
        }
        
        .menu-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .price-tag {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 107, 53, 0.9);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
        }
        
        .menu-card-content {
            padding: 2rem;
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
        
        .section {
            display: none;
        }
        
        .section.active {
            display: block;
        }
        
        @media (max-width: 768px) {
            .hero-title { font-size: 2.5rem; }
            .hero-subtitle { font-size: 1.2rem; }
            .menu-grid { grid-template-columns: 1fr; }
            .nav-menu { display: none; }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="#" class="logo" onclick="showSection('home')">
                <div class="logo-icon">E</div>
                <span>EMPARO<br><small style="font-size:0.6em;">PERI PERI</small></span>
            </a>
            <ul class="nav-menu">
                <li><a href="#" class="nav-link active" onclick="showSection('home')">Home</a></li>
                <li><a href="#" class="nav-link" onclick="showSection('menu')">Menu</a></li>
                <li><a href="#" class="nav-link" onclick="showSection('about')">About</a></li>
                <li><a href="#" class="nav-link" onclick="showSection('contact')">Contact</a></li>
            </ul>
        </div>
    </nav>

    <div id="homeSection" class="section active">
        <section class="hero-section">
            <div class="hero-container">
                <h1 class="hero-title">PERI PERI</h1>
                <p class="hero-subtitle">Authentic Grilled Chicken & Peri Peri Specialties</p>
                <p>Experience the authentic taste of flame-grilled peri peri chicken, fresh stone-baked pizzas, and mouth-watering specialties that will ignite your taste buds.</p>
                <br>
                <button class="btn-primary" onclick="showSection('menu')">View Our Menu</button>
                <a href="tel:02034416940" class="btn-primary">Order Now: 020 3441 6940</a>
            </div>
        </section>

        <section class="menu-section">
            <div class="container">
                <h2 class="section-title">Popular Items</h2>
                <p class="section-subtitle">Try our customer favorites</p>
                <div class="menu-grid" id="popularItems">
                    <!-- Popular items will be loaded here -->
                </div>
            </div>
        </section>
    </div>

    <div id="menuSection" class="section">
        <section class="menu-section" style="padding-top: 8rem;">
            <div class="container">
                <h2 class="section-title">Our Menu</h2>
                <p class="section-subtitle">Fresh, authentic, and delicious</p>
                <div class="menu-grid" id="fullMenu">
                    <!-- Full menu will be loaded here -->
                </div>
            </div>
        </section>
    </div>

    <div id="aboutSection" class="section">
        <section class="menu-section" style="padding-top: 8rem;">
            <div class="container">
                <h2 class="section-title">About Emparo Peri Peri</h2>
                <p style="font-size: 1.2rem; text-align: center; max-width: 800px; margin: 0 auto;">
                    Located in the heart of Finsbury Park, we bring you the authentic taste of Portuguese peri peri cuisine. 
                    Our flame-grilled chicken and fresh ingredients create the perfect balance of flavor and spice.
                </p>
            </div>
        </section>
    </div>

    <div id="contactSection" class="section">
        <section class="menu-section" style="padding-top: 8rem;">
            <div class="container">
                <h2 class="section-title">Contact Us</h2>
                <div style="text-align: center; font-size: 1.2rem;">
                    <p><strong>Address:</strong> 24 Blackstock Rd, Finsbury Park, London N4 2DW</p>
                    <p><strong>Phone:</strong> 020 3441 6940</p>
                    <p><strong>Hours:</strong> 1 pm–4 am</p>
                </div>
            </div>
        </section>
    </div>

    <script>
        let menuData = [];

        function showSection(sectionName) {
            // Hide all sections
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Remove active class from nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Show selected section
            document.getElementById(sectionName + 'Section').classList.add('active');
            
            // Add active class to clicked nav link
            event.target.classList.add('active');
            
            // Load menu if needed
            if ((sectionName === 'home' || sectionName === 'menu') && menuData.length === 0) {
                loadMenu();
            }
        }

        function loadMenu() {
            fetch('/api/menu')
                .then(response => response.json())
                .then(data => {
                    menuData = data;
                    renderPopularItems();
                    renderFullMenu();
                })
                .catch(error => {
                    console.error('Error loading menu:', error);
                });
        }

        function renderPopularItems() {
            const popularItems = menuData.filter(item => item.is_customer_favorite === 1);
            const container = document.getElementById('popularItems');
            
            container.innerHTML = popularItems.map(item => {
                return '<div class="menu-card">' +
                    '<div class="menu-card-image">' +
                        '<img src="/' + item.image + '" alt="' + item.name + '">' +
                        '<div class="price-tag">£' + item.price + '</div>' +
                    '</div>' +
                    '<div class="menu-card-content">' +
                        '<h3 class="menu-card-title">' + item.name + '</h3>' +
                        '<p class="menu-card-description">' + (item.description || 'Delicious and fresh, made to order') + '</p>' +
                        '<button class="add-to-cart-btn" onclick="orderItem(\'' + item.name + '\', ' + item.price + ')">Order Now</button>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function renderFullMenu() {
            const container = document.getElementById('fullMenu');
            
            container.innerHTML = menuData.map(item => {
                return '<div class="menu-card">' +
                    '<div class="menu-card-image">' +
                        '<img src="/' + item.image + '" alt="' + item.name + '">' +
                        '<div class="price-tag">£' + item.price + '</div>' +
                    '</div>' +
                    '<div class="menu-card-content">' +
                        '<h3 class="menu-card-title">' + item.name + '</h3>' +
                        '<p class="menu-card-description">' + (item.description || 'Delicious and fresh, made to order') + '</p>' +
                        '<button class="add-to-cart-btn" onclick="orderItem(\'' + item.name + '\', ' + item.price + ')">Order Now</button>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function orderItem(itemName, price) {
            const message = 'Hello! I would like to order: ' + itemName + ' (£' + price + ')';
            window.open('https://wa.me/442034416940?text=' + encodeURIComponent(message), '_blank');
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadMenu();
        });
    </script>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Clean Emparo Peri Peri server running on port ${PORT}`);
});

module.exports = app;