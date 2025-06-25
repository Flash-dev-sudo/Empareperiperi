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
            color: #1f2937;
            background-color: #ffffff;
        }
        
        /* Navigation */
        .navbar {
            background: #dc2626;
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
            color: white;
            font-size: 1.8rem;
            font-weight: 800;
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
            align-items: center;
        }
        
        .nav-link {
            color: white;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.3s;
        }
        
        .nav-link:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .phone-btn {
            background: #fbbf24;
            color: #000;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s;
        }
        
        .phone-btn:hover {
            background: #f59e0b;
            transform: translateY(-2px);
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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
            gap: 3rem;
            align-items: center;
        }
        
        .hero-text h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1rem;
            line-height: 1.1;
        }
        
        .hero-text p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .hero-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .btn-primary {
            background: #fbbf24;
            color: #000;
            padding: 1rem 2rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-primary:hover {
            background: #f59e0b;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: transparent;
            color: white;
            padding: 1rem 2rem;
            border: 2px solid white;
            border-radius: 0.5rem;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-secondary:hover {
            background: white;
            color: #dc2626;
        }
        
        .hero-image {
            text-align: center;
        }
        
        .hero-image img {
            max-width: 100%;
            height: auto;
            border-radius: 1rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        
        /* Info Cards */
        .info-section {
            padding: 4rem 0;
            background: #f9fafb;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .info-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .info-card {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
            transition: all 0.3s;
        }
        
        .info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        
        .info-card .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .info-card h3 {
            color: #dc2626;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        /* Menu Section */
        .menu-section {
            padding: 4rem 0;
        }
        
        .section-title {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .section-title h2 {
            font-size: 2.5rem;
            font-weight: 800;
            color: #1f2937;
            margin-bottom: 1rem;
        }
        
        .section-title p {
            font-size: 1.2rem;
            color: #6b7280;
        }
        
        .menu-categories {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }
        
        .category-btn {
            background: #f3f4f6;
            color: #374151;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 2rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .category-btn.active {
            background: #dc2626;
            color: white;
        }
        
        .category-btn:hover {
            background: #dc2626;
            color: white;
        }
        
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .menu-item {
            background: white;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }
        
        .menu-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        
        .menu-item-image {
            height: 200px;
            background: #f3f4f6;
            position: relative;
            overflow: hidden;
        }
        
        .menu-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .menu-item-content {
            padding: 1.5rem;
        }
        
        .menu-item h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .menu-item p {
            color: #6b7280;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }
        
        .menu-item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .price {
            font-size: 1.5rem;
            font-weight: 800;
            color: #dc2626;
        }
        
        .spice-level {
            display: flex;
            gap: 0.25rem;
        }
        
        .badge {
            background: #fbbf24;
            color: #000;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 700;
        }
        
        /* Contact Section */
        .contact-section {
            background: #1f2937;
            color: white;
            padding: 4rem 0;
        }
        
        .contact-content {
            text-align: center;
        }
        
        .contact-content h2 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 2rem;
        }
        
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .contact-item {
            text-align: center;
        }
        
        .contact-item .icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #fbbf24;
        }
        
        .contact-item h3 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .mobile-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #dc2626;
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
            
            .hero-text h1 {
                font-size: 2rem;
            }
            
            .menu-grid {
                grid-template-columns: 1fr;
            }
            
            .info-cards {
                grid-template-columns: 1fr;
            }
            
            .hero-buttons {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="#" class="logo">🔥 Emparo Peri Peri</a>
            
            <ul class="nav-links">
                <li><a href="#" class="nav-link" onclick="showSection('home')">Home</a></li>
                <li><a href="#" class="nav-link" onclick="showSection('menu')">Menu</a></li>
                <li><a href="#" class="nav-link" onclick="showSection('contact')">Contact</a></li>
                <li><a href="tel:02034416940" class="phone-btn">📞 020 3441 6940</a></li>
            </ul>
            
            <button class="mobile-menu-btn" onclick="toggleMobileMenu()">☰</button>
            
            <div class="mobile-menu" id="mobileMenu">
                <ul class="mobile-nav-links">
                    <li><a href="#" class="nav-link" onclick="showSection('home')">Home</a></li>
                    <li><a href="#" class="nav-link" onclick="showSection('menu')">Menu</a></li>
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
                    <h1>Authentic Portuguese Peri Peri in London</h1>
                    <p>Experience the finest flame-grilled chicken and fresh stone-baked pizzas. Made with authentic Portuguese spices and fresh ingredients daily.</p>
                    <div class="hero-buttons">
                        <button class="btn-primary" onclick="showSection('menu')">View Our Menu</button>
                        <a href="tel:02034416940" class="btn-secondary">Order Now</a>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="/attached_assets/image_1750804688401.png" alt="Delicious Peri Peri Chicken" style="max-width: 400px;">
                </div>
            </div>
        </section>

        <!-- Info Cards -->
        <section class="info-section">
            <div class="container">
                <div class="info-cards">
                    <div class="info-card">
                        <div class="icon">🕐</div>
                        <h3>Opening Hours</h3>
                        <p><strong>Daily: 1:00 PM - 4:00 AM</strong></p>
                        <p>Perfect for late night dining</p>
                    </div>
                    <div class="info-card">
                        <div class="icon">📍</div>
                        <h3>Location</h3>
                        <p><strong>24 Blackstock Rd</strong></p>
                        <p>Finsbury Park, London N4 2DW</p>
                    </div>
                    <div class="info-card">
                        <div class="icon">🚚</div>
                        <h3>Free Delivery</h3>
                        <p><strong>Orders over £25</strong></p>
                        <p>Fast delivery in 30-45 minutes</p>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- Menu Section -->
    <div id="menuSection" style="display: none;">
        <section class="menu-section">
            <div class="container">
                <div class="section-title">
                    <h2>Our Delicious Menu</h2>
                    <p>Fresh ingredients, authentic flavors, and flame-grilled perfection</p>
                </div>

                <div class="menu-categories" id="menuCategories">
                    <button class="category-btn active" onclick="filterMenu('All')">All Items</button>
                </div>

                <div class="menu-grid" id="menuGrid">
                    <!-- Menu items will be loaded here -->
                </div>
            </div>
        </section>
    </div>

    <!-- Contact Section -->
    <div id="contactSection" style="display: none;">
        <section class="contact-section">
            <div class="container">
                <div class="contact-content">
                    <h2>Get In Touch</h2>
                    
                    <div class="contact-info">
                        <div class="contact-item">
                            <div class="icon">📞</div>
                            <h3>Phone</h3>
                            <p>020 3441 6940</p>
                        </div>
                        <div class="contact-item">
                            <div class="icon">📍</div>
                            <h3>Address</h3>
                            <p>24 Blackstock Rd<br>Finsbury Park, London N4 2DW</p>
                        </div>
                        <div class="contact-item">
                            <div class="icon">🕐</div>
                            <h3>Hours</h3>
                            <p>Daily: 1:00 PM - 4:00 AM</p>
                        </div>
                    </div>
                    
                    <a href="tel:02034416940" class="btn-primary" style="font-size: 1.25rem; padding: 1.25rem 2.5rem;">Call to Order Now</a>
                </div>
            </div>
        </section>
    </div>
    
    <script>
        let menuData = [];
        let currentCategory = 'All';
        
        function showSection(section) {
            // Hide all sections
            document.getElementById('homeSection').style.display = 'none';
            document.getElementById('menuSection').style.display = 'none';
            document.getElementById('contactSection').style.display = 'none';
            
            // Show selected section
            if (section === 'home') {
                document.getElementById('homeSection').style.display = 'block';
            } else if (section === 'menu') {
                document.getElementById('menuSection').style.display = 'block';
                if (menuData.length === 0) {
                    loadMenu();
                }
            } else if (section === 'contact') {
                document.getElementById('contactSection').style.display = 'block';
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
                })
                .catch(error => {
                    console.error('Error loading menu:', error);
                    document.getElementById('menuGrid').innerHTML = 
                        '<div style="text-align: center; grid-column: 1/-1; padding: 2rem;"><h3>Call us at 020 3441 6940 for our menu!</h3></div>';
                });
        }
        
        function setupCategories() {
            const categories = ['All', ...new Set(menuData.map(item => item.category))];
            const categoriesContainer = document.getElementById('menuCategories');
            
            categoriesContainer.innerHTML = categories.map(category => 
                \`<button class="category-btn \${category === currentCategory ? 'active' : ''}" 
                    onclick="filterMenu('\${category}')">\${category}</button>\`
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
            
            const menuGrid = document.getElementById('menuGrid');
            
            menuGrid.innerHTML = filteredItems.map(item => {
                const spiceIcons = item.spice_level > 0 ? '🔥'.repeat(item.spice_level) : '';
                const favoriteIcon = item.isCustomerFavorite ? '<span class="badge">Popular</span>' : '';
                
                return \`
                    <div class="menu-item">
                        <div class="menu-item-image">
                            \${item.image ? 
                                \`<img src="/attached_assets/\${item.image}" alt="\${item.name}" onerror="this.parentElement.innerHTML='<div style=\\"display:flex;align-items:center;justify-content:center;height:100%;background:#f3f4f6;color:#6b7280;font-size:3rem;\\">🍽️</div>';">\` : 
                                '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f3f4f6;color:#6b7280;font-size:3rem;">🍽️</div>'
                            }
                        </div>
                        <div class="menu-item-content">
                            <h3>\${item.name} \${favoriteIcon}</h3>
                            \${item.description ? \`<p>\${item.description}</p>\` : ''}
                            <div class="menu-item-footer">
                                <span class="price">£\${item.price}</span>
                                \${spiceIcons ? \`<div class="spice-level">\${spiceIcons}</div>\` : ''}
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');
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