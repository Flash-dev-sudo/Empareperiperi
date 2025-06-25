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
    <title>EMPARO PERI PERI - LONDON'S HOTTEST RESTAURANT</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Arial Black', Arial, sans-serif;
            background: linear-gradient(45deg, #ff0000, #ff4500, #ffd700, #ff0000);
            background-size: 400% 400%;
            animation: gradientShift 3s ease infinite;
            color: white;
            overflow-x: hidden;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            padding: 40px 0;
            background: rgba(0, 0, 0, 0.7);
            margin: 20px 0;
            border-radius: 20px;
            border: 5px solid gold;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
        }
        
        .logo {
            font-size: 5rem;
            font-weight: 900;
            text-shadow: 3px 3px 0 #000, 6px 6px 20px rgba(255, 0, 0, 0.8);
            animation: bounce 2s infinite;
            background: linear-gradient(45deg, #ffd700, #ff4500, #ff0000);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            font-size: 2rem;
            margin: 20px 0;
            animation: pulse 2s infinite;
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
        }
        
        .fire-icon {
            font-size: 4rem;
            animation: rotate 2s linear infinite;
            display: inline-block;
            margin: 0 20px;
        }
        
        .nav {
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            text-align: center;
            border: 3px solid #ff4500;
        }
        
        .nav-button {
            background: linear-gradient(45deg, #ff0000, #ff4500);
            color: white;
            border: none;
            padding: 15px 30px;
            margin: 10px;
            border-radius: 25px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 5px 15px rgba(255, 69, 0, 0.4);
        }
        
        .nav-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(255, 69, 0, 0.6);
            animation: pulse 0.5s infinite;
        }
        
        .hero {
            text-align: center;
            padding: 60px 20px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 20px;
            margin: 30px 0;
            border: 4px solid #ffd700;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent);
            animation: rotate 3s linear infinite;
        }
        
        .hero-content {
            position: relative;
            z-index: 1;
        }
        
        .hero h1 {
            font-size: 4rem;
            margin: 20px 0;
            text-shadow: 3px 3px 0 #000;
            animation: bounce 3s infinite;
        }
        
        .cta-button {
            background: linear-gradient(45deg, #ffd700, #ff4500, #ff0000);
            color: black;
            border: none;
            padding: 20px 40px;
            font-size: 1.5rem;
            font-weight: 900;
            border-radius: 50px;
            cursor: pointer;
            margin: 20px;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
            animation: pulse 2s infinite;
            text-transform: uppercase;
        }
        
        .cta-button:hover {
            transform: scale(1.1);
            box-shadow: 0 15px 40px rgba(255, 215, 0, 0.8);
        }
        
        .info-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        
        .card {
            background: rgba(0, 0, 0, 0.8);
            padding: 30px;
            border-radius: 20px;
            border: 3px solid #ff4500;
            text-align: center;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        
        .card:hover {
            transform: translateY(-10px) scale(1.05);
            border-color: #ffd700;
            box-shadow: 0 20px 40px rgba(255, 69, 0, 0.4);
        }
        
        .card-icon {
            font-size: 3rem;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
        }
        
        .card h3 {
            font-size: 1.8rem;
            margin: 15px 0;
            color: #ffd700;
        }
        
        .contact {
            background: rgba(0, 0, 0, 0.9);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            margin: 40px 0;
            border: 4px solid #ff0000;
        }
        
        .contact h2 {
            font-size: 3rem;
            margin-bottom: 30px;
            animation: pulse 2s infinite;
        }
        
        .contact-info {
            font-size: 1.3rem;
            margin: 15px 0;
            color: #ffd700;
        }
        
        .phone {
            font-size: 2rem;
            color: #ff4500;
            font-weight: bold;
            animation: bounce 2s infinite;
        }
        
        .floating-emojis {
            position: fixed;
            font-size: 2rem;
            z-index: 1000;
            pointer-events: none;
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .emoji-1 { top: 10%; left: 10%; animation-delay: 0s; }
        .emoji-2 { top: 20%; right: 10%; animation-delay: 1s; }
        .emoji-3 { top: 70%; left: 5%; animation-delay: 2s; }
        .emoji-4 { top: 80%; right: 5%; animation-delay: 3s; }
        
        @media (max-width: 768px) {
            .logo { font-size: 3rem; }
            .hero h1 { font-size: 2.5rem; }
            .cta-button { font-size: 1.2rem; padding: 15px 30px; }
        }
    </style>
</head>
<body>
    <div class="floating-emojis emoji-1">🔥</div>
    <div class="floating-emojis emoji-2">🌶️</div>
    <div class="floating-emojis emoji-3">🍗</div>
    <div class="floating-emojis emoji-4">⚡</div>
    
    <div class="container">
        <div class="header">
            <div class="fire-icon">🔥</div>
            <div class="logo">EMPARO PERI PERI</div>
            <div class="fire-icon">🔥</div>
            <div class="subtitle">LONDON'S HOTTEST FLAME-GRILLED EXPERIENCE!</div>
        </div>
        
        <div class="nav">
            <button class="nav-button" onclick="showMenu()">🔥 EXPLOSIVE MENU</button>
            <button class="nav-button" onclick="callNow()">📞 ORDER NOW</button>
            <button class="nav-button" onclick="location.reload()">🏠 HOME</button>
        </div>
        
        <div class="hero">
            <div class="hero-content">
                <h1>🌶️ TASTE THE FIRE! 🌶️</h1>
                <p style="font-size: 1.5rem; margin: 20px 0;">Authentic Portuguese Peri Peri • Fresh Stone Baked Pizza • Late Night Dining</p>
                <button class="cta-button" onclick="callNow()">⚡ CALL 020 3441 6940 ⚡</button>
                <button class="cta-button" onclick="showMenu()">🔥 SEE OUR MENU 🔥</button>
            </div>
        </div>
        
        <div class="info-cards">
            <div class="card">
                <div class="card-icon">🕐</div>
                <h3>OPENING HOURS</h3>
                <p><strong>Daily: 1:00 PM - 4:00 AM</strong></p>
                <p>Perfect for late night cravings!</p>
            </div>
            
            <div class="card">
                <div class="card-icon">📍</div>
                <h3>LOCATION</h3>
                <p><strong>24 Blackstock Rd</strong></p>
                <p>Finsbury Park, London N4 2DW</p>
            </div>
            
            <div class="card">
                <div class="card-icon">🚚</div>
                <h3>DELIVERY</h3>
                <p><strong>FREE over £25!</strong></p>
                <p>Fast delivery in 30-45 minutes</p>
            </div>
        </div>
        
        <div id="menu" style="display: none;">
            <div class="hero">
                <div class="hero-content">
                    <h1>🔥 OUR EXPLOSIVE MENU 🔥</h1>
                    <div id="menu-items" style="text-align: left; max-width: 800px; margin: 0 auto;"></div>
                    <button class="cta-button" onclick="callNow()">📞 ORDER BY PHONE 📞</button>
                </div>
            </div>
        </div>
        
        <div class="contact">
            <h2>🔥 CONTACT THE FIRE 🔥</h2>
            <div class="contact-info">📞 Call us at: <span class="phone">020 3441 6940</span></div>
            <div class="contact-info">📍 Visit us: 24 Blackstock Rd, Finsbury Park, London N4 2DW</div>
            <div class="contact-info">🕐 Open: Daily 1:00 PM - 4:00 AM</div>
            <button class="cta-button" onclick="callNow()">🔥 ORDER NOW! 🔥</button>
        </div>
    </div>
    
    <script>
        function callNow() {
            window.location.href = 'tel:02034416940';
        }
        
        function showMenu() {
            const menuDiv = document.getElementById('menu');
            const menuItems = document.getElementById('menu-items');
            
            if (menuDiv.style.display === 'none') {
                fetch('/api/menu')
                    .then(response => response.json())
                    .then(data => {
                        let menuHTML = '';
                        const categories = [...new Set(data.map(item => item.category))];
                        
                        categories.forEach(category => {
                            menuHTML += '<div style="margin: 30px 0; padding: 20px; background: rgba(255,69,0,0.2); border-radius: 15px; border: 2px solid #ff4500;">';
                            menuHTML += '<h2 style="color: #ffd700; text-align: center; font-size: 2rem; margin-bottom: 20px;">🔥 ' + category + ' 🔥</h2>';
                            
                            const categoryItems = data.filter(item => item.category === category);
                            categoryItems.forEach(item => {
                                menuHTML += '<div style="margin: 15px 0; padding: 15px; background: rgba(0,0,0,0.6); border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">';
                                menuHTML += '<div>';
                                menuHTML += '<h3 style="color: white; font-size: 1.3rem;">' + item.name;
                                if (item.isCustomerFavorite) menuHTML += ' 👑';
                                if (item.spice_level > 0) {
                                    for (let i = 0; i < item.spice_level; i++) menuHTML += ' 🔥';
                                }
                                menuHTML += '</h3>';
                                if (item.description) {
                                    menuHTML += '<p style="color: #ccc; margin: 5px 0;">' + item.description + '</p>';
                                }
                                menuHTML += '</div>';
                                menuHTML += '<div style="color: #ffd700; font-size: 1.5rem; font-weight: bold;">£' + item.price + '</div>';
                                menuHTML += '</div>';
                            });
                            
                            menuHTML += '</div>';
                        });
                        
                        menuItems.innerHTML = menuHTML;
                        menuDiv.style.display = 'block';
                        menuDiv.scrollIntoView({ behavior: 'smooth' });
                    })
                    .catch(error => {
                        menuItems.innerHTML = '<p style="color: #ff4500; text-align: center; font-size: 1.5rem;">🔥 Call us to hear our amazing menu! 🔥</p>';
                        menuDiv.style.display = 'block';
                        menuDiv.scrollIntoView({ behavior: 'smooth' });
                    });
            } else {
                menuDiv.style.display = 'none';
            }
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 100);
                });
            });
        });
    </script>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Emparo Peri Peri server running on port ${PORT}`);
});

module.exports = app;