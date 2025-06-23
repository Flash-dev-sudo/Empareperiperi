import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Simple HTML template with inline React (no build step needed)
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emparo Peri Peri - Authentic Peri Peri Chicken & Pizza</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Poppins', sans-serif; }
        .hero-bg { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); }
        .text-primary { color: #ff6b35; }
        .bg-primary { background-color: #ff6b35; }
        .border-primary { border-color: #ff6b35; }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect } = React;
        
        function App() {
            const [menuItems, setMenuItems] = useState([]);
            
            useEffect(() => {
                // Sample menu data
                setMenuItems([
                    { id: 1, name: "Peri Peri Chicken", price: "£12.99", category: "Chicken", description: "Grilled chicken with authentic peri peri sauce" },
                    { id: 2, name: "Margherita Pizza", price: "£9.99", category: "Pizza", description: "Classic tomato base with mozzarella cheese" },
                    { id: 3, name: "Chicken Wings", price: "£8.99", category: "Chicken", description: "Crispy wings with peri peri seasoning" },
                    { id: 4, name: "Pepperoni Pizza", price: "£11.99", category: "Pizza", description: "Pepperoni with mozzarella on tomato base" }
                ]);
            }, []);
            
            return (
                <div className="min-h-screen bg-gray-50">
                    {/* Header */}
                    <header className="hero-bg text-white">
                        <div className="container mx-auto px-4 py-16 text-center">
                            <h1 className="text-5xl font-bold mb-4">Emparo Peri Peri</h1>
                            <p className="text-xl mb-8">Authentic Peri Peri Chicken & Pizza</p>
                            <button className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                                Order Now
                            </button>
                        </div>
                    </header>
                    
                    {/* Menu Section */}
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Menu</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {menuItems.map(item => (
                                    <div key={item.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                                        <h3 className="text-xl font-semibold mb-2 text-primary">{item.name}</h3>
                                        <p className="text-gray-600 mb-4">{item.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-primary">{item.price}</span>
                                            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 transition">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    
                    {/* Contact Section */}
                    <section className="bg-gray-800 text-white py-16">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl font-bold mb-8">Visit Us Today</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Location</h3>
                                    <p>123 Food Street<br/>London, UK</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Hours</h3>
                                    <p>Mon-Sun: 11AM - 11PM</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Contact</h3>
                                    <p>Phone: +44 20 1234 5678<br/>Email: info@emparoperi.com</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            );
        }
        
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
`;

// Routes
app.get('/', (req, res) => {
    res.send(htmlTemplate);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API endpoints for menu (if needed)
app.get('/api/menu', (req, res) => {
    const menu = [
        { id: 1, name: "Peri Peri Chicken", price: "£12.99", category: "Chicken", description: "Grilled chicken with authentic peri peri sauce" },
        { id: 2, name: "Margherita Pizza", price: "£9.99", category: "Pizza", description: "Classic tomato base with mozzarella cheese" },
        { id: 3, name: "Chicken Wings", price: "£8.99", category: "Chicken", description: "Crispy wings with peri peri seasoning" },
        { id: 4, name: "Pepperoni Pizza", price: "£11.99", category: "Pizza", description: "Pepperoni with mozzarella on tomato base" }
    ];
    res.json(menu);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Emparo Peri Peri server running on port ${PORT}`);
});

export default app;