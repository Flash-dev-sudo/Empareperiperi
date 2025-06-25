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

// Serve a simple dynamic HTML page
app.get('*', (req, res) => {
  try {
    const cssContent = fs.readFileSync(path.join(__dirname, 'client/src/index.css'), 'utf8');
    
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Emparo Peri Peri - Revolutionary Flame-Grilled Experience</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      ${cssContent}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      const { useState, useEffect } = React;
      const { createRoot } = ReactDOM;
      
      // Navigation Component
      function Navigation() {
        const [isOpen, setIsOpen] = useState(false);
        const [isScrolled, setIsScrolled] = useState(false);
        const [location, setLocation] = useState(window.location.pathname);

        useEffect(() => {
          const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
          };
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        }, []);

        const isActive = (path) => location === path;

        return React.createElement('div', null,
          // Dynamic Top Bar
          React.createElement('div', { 
            className: "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white py-3 relative z-50 animate-gradient"
          },
            React.createElement('div', { className: "max-w-7xl mx-auto px-6 flex items-center justify-between text-sm" },
              React.createElement('div', { className: "flex items-center gap-8" },
                React.createElement('div', { className: "flex items-center gap-2 animate-pulse" },
                  React.createElement('span', { className: "font-bold" }, "📞 020 3441 6940")
                ),
                React.createElement('div', { className: "hidden sm:flex items-center gap-2" },
                  React.createElement('span', { className: "font-medium" }, "🕐 Daily: 1:00 PM - 4:00 AM")
                ),
                React.createElement('div', { className: "hidden md:flex items-center gap-2" },
                  React.createElement('span', { className: "font-medium" }, "📍 24 Blackstock Rd, Finsbury Park")
                )
              ),
              React.createElement('div', { 
                className: "bg-black text-yellow-400 font-black px-4 py-2 animate-pulse rounded-full"
              }, "🔥 FREE DELIVERY OVER £25 🔥")
            )
          ),

          // Main Navigation
          React.createElement('nav', { 
            className: "sticky top-0 z-40 transition-all duration-500 " + (isScrolled 
              ? 'bg-black/95 backdrop-blur-xl shadow-2xl shadow-orange-500/20 border-b border-orange-500/30'
              : 'bg-black/80 backdrop-blur-lg')
          },
            React.createElement('div', { className: "max-w-7xl mx-auto px-6" },
              React.createElement('div', { className: "flex items-center justify-between h-24" },
                // Revolutionary Logo
                React.createElement('a', { 
                  href: "/",
                  className: "flex items-center space-x-4 group",
                  onClick: (e) => { e.preventDefault(); setLocation('/'); window.history.pushState({}, '', '/'); }
                },
                  React.createElement('div', { className: "relative" },
                    React.createElement('div', { 
                      className: "w-16 h-16 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-orange-500/50 transition-all group-hover:scale-110 animate-glow"
                    }, "🔥"),
                    React.createElement('div', { className: "absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping" }),
                    React.createElement('div', { className: "absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full" })
                  ),
                  React.createElement('div', { className: "hidden sm:block" },
                    React.createElement('h1', { className: "text-3xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-orange-400 transition-all" }, "EMPARO"),
                    React.createElement('p', { className: "text-sm font-bold text-orange-400 -mt-1 tracking-wider" }, "PERI PERI REVOLUTION")
                  )
                ),

                // Desktop Navigation
                React.createElement('div', { className: "hidden md:flex items-center space-x-6" },
                  React.createElement('button', { 
                    className: "font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 " + (isActive('/') 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50 scale-110'
                      : 'text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-orange-400'),
                    onClick: () => { setLocation('/'); window.history.pushState({}, '', '/'); }
                  }, "🏠 Home"),
                  React.createElement('button', { 
                    className: "font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 " + (isActive('/menu') 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50 scale-110'
                      : 'text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-orange-400'),
                    onClick: () => { setLocation('/menu'); window.history.pushState({}, '', '/menu'); }
                  }, "🔥 Menu")
                ),

                // Dynamic CTA
                React.createElement('div', { className: "hidden md:flex items-center space-x-4" },
                  React.createElement('a', { href: "tel:02034416940" },
                    React.createElement('button', { 
                      className: "btn-dynamic bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black px-8 py-4 rounded-full shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110 transition-all animate-pulse-custom"
                    }, "⚡ ORDER NOW")
                  )
                ),

                // Mobile Menu Button
                React.createElement('button', {
                  className: "md:hidden p-3 text-white hover:bg-orange-500/20 rounded-full",
                  onClick: () => setIsOpen(!isOpen)
                }, isOpen ? "✕" : "☰")
              )
            ),

            // Mobile Menu
            isOpen && React.createElement('div', { className: "md:hidden bg-black/95 backdrop-blur-xl border-t border-orange-500/30 shadow-2xl" },
              React.createElement('div', { className: "px-6 py-10 space-y-8" },
                React.createElement('button', { 
                  className: "w-full justify-start font-black text-2xl py-6 rounded-2xl transition-all " + (isActive('/') 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-orange-400'),
                  onClick: () => { setLocation('/'); setIsOpen(false); window.history.pushState({}, '', '/'); }
                }, "🏠 Home"),
                React.createElement('button', { 
                  className: "w-full justify-start font-black text-2xl py-6 rounded-2xl transition-all " + (isActive('/menu') 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-orange-400'),
                  onClick: () => { setLocation('/menu'); setIsOpen(false); window.history.pushState({}, '', '/menu'); }
                }, "🔥 Menu & Order"),
                
                React.createElement('div', { className: "pt-8 border-t border-orange-500/30 space-y-6" },
                  React.createElement('div', { className: "text-center space-y-4" },
                    React.createElement('p', { className: "font-black text-white text-xl" }, "🔥 CONTACT THE FIRE 🔥"),
                    React.createElement('p', { className: "text-orange-400 font-black text-2xl animate-pulse" }, "020 3441 6940")
                  ),
                  React.createElement('a', { href: "tel:02034416940" },
                    React.createElement('button', { 
                      className: "w-full btn-dynamic bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black py-6 rounded-2xl text-2xl shadow-2xl transform hover:scale-105 transition-all"
                    }, "📞 CALL TO ORDER")
                  )
                )
              )
            )
          )
        );
      }

      // Home Page Component
      function HomePage() {
        const [menuItems, setMenuItems] = useState([]);
        const [currentHero, setCurrentHero] = useState(0);
        const [isVisible, setIsVisible] = useState(false);
        
        const heroMessages = [
          { 
            title: "FLAME-GRILLED", 
            subtitle: "PERFECTION", 
            description: "Authentic Portuguese peri peri flavors that ignite your senses",
            color: "from-red-600 to-orange-500"
          },
          { 
            title: "FRESH", 
            subtitle: "INGREDIENTS", 
            description: "Premium quality chicken and spices, prepared to order daily",
            color: "from-orange-500 to-yellow-500"
          },
          { 
            title: "SPICE YOUR", 
            subtitle: "ADVENTURE", 
            description: "From mild to volcanic - find your perfect heat level",
            color: "from-yellow-500 to-red-600"
          }
        ];

        useEffect(() => {
          setIsVisible(true);
          const timer = setInterval(() => {
            setCurrentHero((prev) => (prev + 1) % heroMessages.length);
          }, 5000);
          
          // Fetch menu items
          fetch('/api/menu')
            .then(res => res.json())
            .then(data => setMenuItems(data))
            .catch(console.error);
            
          return () => clearInterval(timer);
        }, []);

        const featuredItems = menuItems.filter(item => item.isCustomerFavorite === 1).slice(0, 6);

        return React.createElement('div', { className: "min-h-screen bg-black text-white overflow-hidden" },
          // Revolutionary Hero Section
          React.createElement('div', { className: "relative min-h-screen flex items-center justify-center" },
            // Dynamic Background
            React.createElement('div', { className: "absolute inset-0 overflow-hidden" },
              React.createElement('div', { className: "absolute inset-0 bg-gradient-to-br " + heroMessages[currentHero].color + " opacity-90 transition-all duration-1000" }),
              
              // Animated Shapes
              React.createElement('div', { className: "absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" }),
              React.createElement('div', { className: "absolute bottom-20 right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-float", style: {animationDelay: '1s'} }),
              React.createElement('div', { className: "absolute top-1/2 left-1/3 w-64 h-64 bg-red-400/15 rounded-full blur-3xl animate-float", style: {animationDelay: '2s'} }),
              
              // Particle Effect
              React.createElement('div', { className: "absolute inset-0" },
                ...Array.from({ length: 50 }, (_, i) => 
                  React.createElement('div', {
                    key: i,
                    className: "absolute w-2 h-2 bg-white/20 rounded-full animate-pulse",
                    style: {
                      left: Math.random() * 100 + '%',
                      top: Math.random() * 100 + '%',
                      animationDelay: Math.random() * 3 + 's',
                      animationDuration: (2 + Math.random() * 2) + 's'
                    }
                  })
                )
              )
            ),
            
            // Hero Content
            React.createElement('div', { className: "relative z-10 max-w-7xl mx-auto px-6 text-center" },
              React.createElement('div', { className: "transform transition-all duration-1000 " + (isVisible ? 'animate-slideInUp' : 'opacity-0') },
                // Brand Badge
                React.createElement('div', { className: "inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-full font-black text-lg mb-8 animate-glow" },
                  "🏆 LONDON'S MOST EXPLOSIVE PERI PERI"
                ),
                
                // Dynamic Title
                React.createElement('div', { className: "mb-8 relative" },
                  React.createElement('h1', { className: "text-7xl lg:text-9xl font-black leading-tight mb-4" },
                    ...heroMessages.map((msg, index) => 
                      React.createElement('div', {
                        key: index,
                        className: "transition-all duration-1000 transform " + (index === currentHero 
                          ? 'opacity-100 scale-100 translate-y-0'
                          : 'opacity-0 scale-90 translate-y-8 absolute inset-0')
                      },
                        React.createElement('span', { className: "block text-white animate-textGlow" }, msg.title),
                        React.createElement('span', { className: "block gradient-text animate-pulse-custom" }, msg.subtitle)
                      )
                    )
                  ),
                  React.createElement('p', { className: "text-2xl lg:text-4xl text-yellow-100 font-medium max-w-4xl mx-auto leading-relaxed" },
                    heroMessages[currentHero].description
                  )
                ),

                // CTA Buttons
                React.createElement('div', { className: "flex flex-col sm:flex-row gap-6 justify-center items-center mb-12" },
                  React.createElement('button', { 
                    className: "btn-dynamic bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black text-2xl px-12 py-6 rounded-full shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110 transition-all duration-300",
                    onClick: () => { window.history.pushState({}, '', '/menu'); window.location.reload(); }
                  }, "⚡ ORDER NOW"),
                  React.createElement('a', { href: "tel:02034416940" },
                    React.createElement('button', { 
                      className: "btn-dynamic glass border-2 border-white/30 text-white hover:bg-white/20 font-black text-2xl px-12 py-6 rounded-full backdrop-blur-sm transform hover:scale-110 transition-all duration-300"
                    }, "📞 020 3441 6940")
                  )
                ),

                // Info Cards
                React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto" },
                  React.createElement('div', { className: "glass p-6 rounded-2xl animate-fadeInScale" },
                    React.createElement('div', { className: "mx-auto mb-3 text-yellow-400 text-4xl" }, "🕐"),
                    React.createElement('p', { className: "font-bold text-lg" }, "Daily 1PM - 4AM"),
                    React.createElement('p', { className: "text-gray-300" }, "Late Night Dining")
                  ),
                  React.createElement('div', { className: "glass p-6 rounded-2xl animate-fadeInScale", style: {animationDelay: '0.2s'} },
                    React.createElement('div', { className: "mx-auto mb-3 text-yellow-400 text-4xl" }, "📍"),
                    React.createElement('p', { className: "font-bold text-lg" }, "Finsbury Park"),
                    React.createElement('p', { className: "text-gray-300" }, "24 Blackstock Rd")
                  ),
                  React.createElement('div', { className: "glass p-6 rounded-2xl animate-fadeInScale", style: {animationDelay: '0.4s'} },
                    React.createElement('div', { className: "mx-auto mb-3 text-yellow-400 text-4xl" }, "❤️"),
                    React.createElement('p', { className: "font-bold text-lg" }, "5000+ Happy"),
                    React.createElement('p', { className: "text-gray-300" }, "Customers Served")
                  )
                )
              )
            ),

            // Hero Navigation Dots
            React.createElement('div', { className: "absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4" },
              ...heroMessages.map((_, index) => 
                React.createElement('button', {
                  key: index,
                  className: "transition-all duration-300 rounded-full " + (index === currentHero 
                    ? 'w-12 h-4 bg-yellow-400 shadow-lg shadow-yellow-400/50'
                    : 'w-4 h-4 bg-white/30 hover:bg-white/50'),
                  onClick: () => setCurrentHero(index)
                })
              )
            )
          ),

          // Customer Favorites Section
          React.createElement('section', { className: "py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative" },
            React.createElement('div', { className: "relative max-w-7xl mx-auto px-6" },
              React.createElement('div', { className: "text-center mb-16 animate-slideInUp" },
                React.createElement('div', { className: "bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 text-xl font-black mb-8 animate-pulse-custom rounded-full inline-block" },
                  "📈 CUSTOMER OBSESSIONS"
                ),
                React.createElement('h2', { className: "text-6xl lg:text-8xl font-black mb-8" },
                  React.createElement('span', { className: "gradient-text" }, "MOST CRAVED"),
                  React.createElement('br'),
                  React.createElement('span', { className: "text-white" }, "FLAVORS")
                ),
                React.createElement('p', { className: "text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed" },
                  "These dishes have achieved legendary status among our customers"
                )
              ),

              React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" },
                ...featuredItems.map((item, index) => 
                  React.createElement('div', { 
                    key: item.id, 
                    className: "group bg-gradient-to-br from-gray-800 to-black border-2 border-gray-700 rounded-3xl overflow-hidden hover:border-orange-500 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-orange-500/20 p-8"
                  },
                    React.createElement('div', { className: "text-center space-y-6" },
                      React.createElement('div', { className: "text-8xl mb-4" }, "🔥"),
                      React.createElement('h3', { className: "font-black text-2xl text-white mb-3 group-hover:gradient-text transition-all duration-300" }, item.name),
                      React.createElement('p', { className: "text-4xl font-black text-yellow-400 mb-4" }, "£" + item.price),
                      item.description && React.createElement('p', { className: "text-gray-400 leading-relaxed" }, item.description),
                      React.createElement('button', { 
                        className: "w-full btn-dynamic bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-black py-4 rounded-2xl transition-all hover:scale-105 shadow-lg hover:shadow-xl text-lg transform active:scale-95",
                        onClick: () => { window.history.pushState({}, '', '/menu'); window.location.reload(); }
                      }, "ORDER THIS LEGEND")
                    )
                  )
                )
              ),

              React.createElement('div', { className: "text-center mt-16" },
                React.createElement('button', { 
                  className: "btn-dynamic bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-black px-16 py-6 rounded-full text-2xl shadow-2xl hover:shadow-red-500/50 transform hover:scale-110 transition-all duration-300",
                  onClick: () => { window.history.pushState({}, '', '/menu'); window.location.reload(); }
                }, "EXPLORE ALL FLAVORS ▶")
              )
            )
          ),

          // Contact Section
          React.createElement('section', { className: "py-20 bg-black relative" },
            React.createElement('div', { className: "max-w-7xl mx-auto px-6 text-center" },
              React.createElement('h2', { className: "text-6xl font-black mb-12 text-white" },
                "VISIT OUR ",
                React.createElement('span', { className: "gradient-text" }, "FLAME TEMPLE")
              ),
              React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" },
                React.createElement('div', { className: "glass-dark p-8 rounded-3xl" },
                  React.createElement('div', { className: "text-6xl mb-4" }, "📍"),
                  React.createElement('h3', { className: "text-2xl font-black text-white mb-4" }, "Location"),
                  React.createElement('p', { className: "text-gray-300 text-lg" }, "24 Blackstock Rd, Finsbury Park", React.createElement('br'), "London N4 2DW")
                ),
                React.createElement('div', { className: "glass-dark p-8 rounded-3xl" },
                  React.createElement('div', { className: "text-6xl mb-4" }, "📞"),
                  React.createElement('h3', { className: "text-2xl font-black text-white mb-4" }, "Order Hotline"),
                  React.createElement('p', { className: "text-gray-300 text-lg" }, "020 3441 6940")
                ),
                React.createElement('div', { className: "glass-dark p-8 rounded-3xl" },
                  React.createElement('div', { className: "text-6xl mb-4" }, "🕐"),
                  React.createElement('h3', { className: "text-2xl font-black text-white mb-4" }, "Hours"),
                  React.createElement('p', { className: "text-gray-300 text-lg" }, "Daily: 1:00 PM - 4:00 AM")
                )
              ),
              React.createElement('a', { href: "tel:02034416940" },
                React.createElement('button', { 
                  className: "btn-dynamic bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-black py-6 px-16 rounded-2xl text-2xl transform hover:scale-105 transition-all"
                }, "🔥 START ORDERING 🔥")
              )
            )
          )
        );
      }

      // Menu Page Component  
      function MenuPage() {
        const [menuItems, setMenuItems] = useState([]);
        const [cart, setCart] = useState([]);
        const [selectedCategory, setSelectedCategory] = useState("All");
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
          fetch('/api/menu')
            .then(res => res.json())
            .then(data => {
              setMenuItems(data);
              setIsLoading(false);
            })
            .catch(console.error);
        }, []);

        const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.category)))];
        const filteredItems = selectedCategory === "All" ? menuItems : menuItems.filter(item => item.category === selectedCategory);

        const addToCart = (item) => {
          setCart(prev => {
            const existing = prev.find(cartItem => cartItem.id === item.id);
            if (existing) {
              return prev.map(cartItem =>
                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
              );
            }
            return [...prev, { ...item, quantity: 1 }];
          });
        };

        const removeFromCart = (id) => {
          setCart(prev => {
            const existing = prev.find(item => item.id === id);
            if (existing && existing.quantity > 1) {
              return prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item);
            }
            return prev.filter(item => item.id !== id);
          });
        };

        const getCartTotal = () => {
          return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
        };

        const getCategoryIcon = (category) => {
          const icons = {
            "Starters": "🚀",
            "Platters": "👑", 
            "Mains": "⚡",
            "Pizzas": "🔥",
            "Chicken": "💥",
            "Milkshakes": "🌟",
            "Peri Peri Specialties": "💎"
          };
          return icons[category] || "🎯";
        };

        if (isLoading) {
          return React.createElement('div', { className: "min-h-screen bg-black flex items-center justify-center" },
            React.createElement('div', { className: "text-center" },
              React.createElement('div', { className: "relative" },
                React.createElement('div', { className: "animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-red-500 border-r-orange-500 border-b-yellow-500 mx-auto mb-6" }),
                React.createElement('div', { className: "absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-red-500 opacity-20" })
              ),
              React.createElement('h2', { className: "text-2xl font-black bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent mb-2" }, "LOADING FLAVORS"),
              React.createElement('p', { className: "text-gray-400 font-bold" }, "Preparing your taste adventure...")
            )
          );
        }

        return React.createElement('div', { className: "min-h-screen bg-black text-white" },
          // Explosive Hero Section
          React.createElement('div', { className: "relative min-h-[60vh] bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 overflow-hidden" },
            React.createElement('div', { className: "relative z-10 flex items-center justify-center h-full py-20" },
              React.createElement('div', { className: "max-w-6xl mx-auto px-6 text-center" },
                React.createElement('div', { className: "inline-flex items-center bg-black/50 backdrop-blur-lg text-yellow-400 px-8 py-4 rounded-full font-black text-xl mb-8 animate-bounce" },
                  "🎯 FLAVOR COMMAND CENTER"
                ),
                React.createElement('h1', { className: "text-7xl lg:text-9xl font-black mb-8 leading-tight" },
                  React.createElement('span', { className: "block text-white animate-textGlow" }, "CHOOSE YOUR"),
                  React.createElement('span', { className: "block gradient-text animate-pulse-custom" }, "WEAPON")
                ),
                React.createElement('p', { className: "text-3xl lg:text-4xl text-yellow-100 max-w-5xl mx-auto leading-relaxed font-bold" },
                  "Every dish is a flavor explosion waiting to happen"
                )
              )
            ),
            // Floating Elements
            React.createElement('div', { className: "absolute top-20 left-20 text-6xl animate-float" }, "🔥"),
            React.createElement('div', { className: "absolute top-40 right-32 text-6xl animate-float", style: {animationDelay: '1s'} }, "⚡"),
            React.createElement('div', { className: "absolute bottom-32 left-1/4 text-6xl animate-float", style: {animationDelay: '2s'} }, "💥")
          ),

          React.createElement('div', { className: "max-w-7xl mx-auto px-6 py-16" },
            React.createElement('div', { className: "grid grid-cols-1 xl:grid-cols-4 gap-12" },
              // Menu Content
              React.createElement('div', { className: "xl:col-span-3" },
                // Category Filter
                React.createElement('div', { className: "mb-16" },
                  React.createElement('div', { className: "flex items-center gap-6 mb-10" },
                    React.createElement('div', { className: "relative" },
                      React.createElement('div', { className: "bg-gradient-to-br from-red-500 to-orange-500 p-4 rounded-3xl animate-glow text-white text-4xl" }, "🔥")
                    ),
                    React.createElement('h2', { className: "text-4xl lg:text-5xl font-black gradient-text" }, "MISSION CATEGORIES")
                  ),
                  
                  React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4" },
                    ...categories.map((category, index) => 
                      React.createElement('button', {
                        key: category,
                        className: "relative overflow-hidden rounded-2xl font-black text-base px-6 py-6 transition-all transform hover:scale-110 " + (selectedCategory === category 
                          ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-2xl shadow-red-500/50 scale-110"
                          : "bg-gray-800 text-gray-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 hover:text-white border-2 border-gray-700 hover:border-orange-500"),
                        onClick: () => setSelectedCategory(category)
                      },
                        React.createElement('div', { className: "flex flex-col items-center gap-2" },
                          React.createElement('span', { className: "text-2xl" }, category === "All" ? "🎯" : getCategoryIcon(category)),
                          React.createElement('span', { className: "text-xs" }, category)
                        )
                      )
                    )
                  )
                ),

                // Menu Grid
                React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" },
                  ...filteredItems.map((item, index) => 
                    React.createElement('div', { 
                      key: item.id, 
                      className: "group relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-3xl overflow-hidden hover:border-orange-500 transition-all duration-500 hover:-translate-y-6 hover:shadow-2xl hover:shadow-orange-500/30 transform"
                    },
                      React.createElement('div', { className: "relative z-10" },
                        // Image Section
                        React.createElement('div', { className: "relative overflow-hidden" },
                          React.createElement('div', { className: "aspect-[4/3] bg-gradient-to-br from-orange-100 to-red-100 relative" },
                            item.image ? 
                              React.createElement('img', { 
                                src: "/attached_assets/" + item.image,
                                alt: item.name,
                                className: "w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                              }) :
                              React.createElement('div', { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-200 to-red-200" },
                                React.createElement('div', { className: "text-center" },
                                  React.createElement('div', { className: "text-8xl mb-4 opacity-60 animate-bounce" }, getCategoryIcon(item.category)),
                                  React.createElement('p', { className: "text-gray-600 font-black text-lg" }, "FLAVOR INCOMING")
                                )
                              )
                          ),
                          
                          // Status Badges
                          item.isCustomerFavorite === 1 && React.createElement('div', { 
                            className: "absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-2xl animate-glow"
                          }, "👑 LEGENDARY"),
                          
                          React.createElement('div', { className: "absolute top-4 left-4 glass-dark text-white px-4 py-2 rounded-full text-xl font-black backdrop-blur-lg" }, "£" + item.price),
                          
                          React.createElement('div', { className: "absolute bottom-4 left-4 bg-gradient-to-r from-black/80 to-gray-800/80 backdrop-blur-lg text-white px-3 py-1 rounded-full text-sm font-black" }, item.category)
                        ),
                        
                        // Content Section
                        React.createElement('div', { className: "p-8 relative" },
                          React.createElement('div', { className: "space-y-6" },
                            React.createElement('div', null,
                              React.createElement('h3', { className: "font-black text-2xl text-white mb-4 line-clamp-2 group-hover:gradient-text transition-all duration-300 leading-tight" }, item.name),
                              item.description && React.createElement('p', { className: "text-gray-400 leading-relaxed line-clamp-3 text-base" }, item.description),
                              item.spice_level > 0 && React.createElement('div', { className: "flex items-center space-x-1 mt-4" },
                                ...Array.from({ length: item.spice_level }, (_, i) => React.createElement('span', { key: i, className: "text-red-500" }, "🔥")),
                                React.createElement('span', { className: "text-xs font-black text-red-600 uppercase tracking-wide ml-2" },
                                  item.spice_level === 1 ? "MILD" : item.spice_level === 2 ? "MEDIUM" : "VOLCANIC"
                                )
                              )
                            ),
                            
                            React.createElement('button', { 
                              onClick: () => addToCart(item),
                              className: "w-full btn-dynamic bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-400 hover:via-orange-400 hover:to-yellow-400 text-white font-black py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl hover:shadow-orange-500/50 text-xl transform active:scale-95"
                            }, "⚡ LAUNCH ORDER")
                          )
                        )
                      )
                    )
                  )
                )
              ),

              // Mission Control Cart
              React.createElement('div', { className: "xl:col-span-1" },
                React.createElement('div', { className: "sticky top-8 bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-3xl shadow-2xl" },
                  React.createElement('div', { className: "pb-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-t-3xl relative overflow-hidden" },
                    React.createElement('div', { className: "absolute inset-0 bg-black/20" }),
                    React.createElement('div', { className: "relative z-10 p-8 flex items-center gap-4 text-2xl font-black" },
                      React.createElement('div', { className: "bg-white/20 p-3 rounded-2xl animate-pulse-custom" }, "🛒"),
                      React.createElement('div', null,
                        React.createElement('div', { className: "text-xl" }, "MISSION CART"),
                        React.createElement('div', { className: "text-sm font-bold opacity-90" }, cart.reduce((sum, item) => sum + item.quantity, 0) + " ITEMS LOCKED")
                      )
                    )
                  ),
                  
                  React.createElement('div', { className: "p-8" },
                    cart.length === 0 ? 
                      React.createElement('div', { className: "text-center py-12" },
                        React.createElement('div', { className: "bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 animate-pulse-custom text-6xl" }, "🎯"),
                        React.createElement('h3', { className: "text-xl font-black text-white mb-3" }, "MISSION AWAITING"),
                        React.createElement('p', { className: "text-gray-400 font-medium" }, "Select your flavor weapons to begin!")
                      ) :
                      React.createElement('div', { className: "space-y-6" },
                        React.createElement('div', { className: "flex items-center justify-between" },
                          React.createElement('h3', { className: "text-lg font-black text-white" }, "SELECTED WEAPONS"),
                          React.createElement('button', {
                            onClick: () => setCart([]),
                            className: "text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold px-3 py-1 rounded-lg text-sm"
                          }, "✕ ABORT")
                        ),

                        React.createElement('div', { className: "space-y-4 max-h-96 overflow-y-auto" },
                          ...cart.map(item => 
                            React.createElement('div', { key: item.id, className: "flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700" },
                              React.createElement('div', { className: "flex-1" },
                                React.createElement('h4', { className: "font-black text-white text-sm" }, item.name),
                                React.createElement('p', { className: "text-gray-400 text-sm" }, "£" + item.price + " each")
                              ),
                              React.createElement('div', { className: "flex items-center gap-3" },
                                React.createElement('button', { 
                                  onClick: () => removeFromCart(item.id), 
                                  className: "h-8 w-8 p-0 rounded-full border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-sm"
                                }, "−"),
                                React.createElement('span', { className: "font-black text-xl min-w-[2rem] text-center text-orange-400" }, item.quantity),
                                React.createElement('button', { 
                                  onClick: () => addToCart(item), 
                                  className: "h-8 w-8 p-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white text-sm"
                                }, "+")
                              )
                            )
                          )
                        ),

                        React.createElement('div', { className: "border-t-2 border-gray-700 pt-6 space-y-6" },
                          React.createElement('div', { className: "flex justify-between items-center" },
                            React.createElement('span', { className: "text-2xl font-black text-white" }, "TOTAL DAMAGE"),
                            React.createElement('span', { className: "text-4xl font-black gradient-text" }, "£" + getCartTotal())
                          ),
                          
                          React.createElement('button', { 
                            className: "w-full py-6 btn-dynamic bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-400 hover:via-orange-400 hover:to-yellow-400 text-white font-black rounded-2xl text-xl shadow-2xl transform hover:scale-105 transition-all",
                            disabled: cart.length === 0,
                            onClick: () => alert('Order functionality coming soon!')
                          }, "⚡ EXECUTE ORDER")
                        )
                      )
                  )
                )
              )
            )
          )
        );
      }

      // App Component
      function App() {
        const [currentPath, setCurrentPath] = useState(window.location.pathname);
        
        useEffect(() => {
          const handlePopState = () => {
            setCurrentPath(window.location.pathname);
          };
          window.addEventListener('popstate', handlePopState);
          return () => window.removeEventListener('popstate', handlePopState);
        }, []);

        return React.createElement('div', null,
          React.createElement(Navigation),
          currentPath === '/menu' ? React.createElement(MenuPage) : React.createElement(HomePage)
        );
      }
      
      // Initialize the app
      const root = createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    </script>
  </body>
</html>`;
    
    res.send(htmlTemplate);
  } catch (error) {
    console.error('Error serving HTML:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Emparo Peri Peri server running on port ${PORT}`);
});

module.exports = app;