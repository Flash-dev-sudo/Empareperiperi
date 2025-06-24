import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const restaurantHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emparo Peri Peri - Authentic Peri Peri Restaurant</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .hero-section {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            padding: 100px 0;
        }
        .menu-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            transition: transform 0.2s;
        }
        .menu-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .price {
            color: #ff6b35;
            font-weight: bold;
            font-size: 1.2em;
        }
        .btn-primary {
            background-color: #ff6b35;
            border-color: #ff6b35;
        }
        .btn-primary:hover {
            background-color: #e55a2b;
            border-color: #e55a2b;
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #ff6b35;">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">Emparo Peri Peri</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#menu">Menu</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <section id="home" class="hero-section text-center">
        <div class="container">
            <h1 class="display-4 fw-bold mb-4">Emparo Peri Peri</h1>
            <p class="lead mb-4">Authentic Peri Peri Chicken & Fresh Stone Baked Pizza</p>
            <p class="mb-4">Experience the authentic taste of peri peri with our flame-grilled chicken and freshly made pizzas</p>
            <a href="#menu" class="btn btn-light btn-lg">View Our Menu</a>
        </div>
    </section>

    <section id="menu" class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">Our Menu</h2>
            
            <div class="row">
                <div class="col-md-6">
                    <h3 class="mb-4 text-primary">Peri Peri Chicken</h3>
                    
                    <div class="menu-item">
                        <h5>Whole Chicken</h5>
                        <p class="text-muted">Flame-grilled whole chicken with authentic peri peri sauce</p>
                        <div class="price">£12.99</div>
                    </div>
                    
                    <div class="menu-item">
                        <h5>Half Chicken</h5>
                        <p class="text-muted">Perfect portion of our signature peri peri chicken</p>
                        <div class="price">£7.99</div>
                    </div>
                    
                    <div class="menu-item">
                        <h5>Chicken Wings (6pcs)</h5>
                        <p class="text-muted">Crispy wings with your choice of peri peri heat level</p>
                        <div class="price">£6.99</div>
                    </div>
                    
                    <div class="menu-item">
                        <h5>Chicken Strips</h5>
                        <p class="text-muted">Tender chicken strips marinated in peri peri spices</p>
                        <div class="price">£8.99</div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <h3 class="mb-4 text-primary">Stone Baked Pizza</h3>
                    
                    <div class="menu-item">
                        <h5>Margherita</h5>
                        <p class="text-muted">Classic tomato base with fresh mozzarella and basil</p>
                        <div class="price">£9.99</div>
                    </div>
                    
                    <div class="menu-item">
                        <h5>Pepperoni</h5>
                        <p class="text-muted">Spicy pepperoni with mozzarella on tomato base</p>
                        <div class="price">£11.99</div>
                    </div>
                    
                    <div class="menu-item">
                        <h5>Peri Peri Chicken Pizza</h5>
                        <p class="text-muted">Our signature chicken with peri peri sauce and peppers</p>
                        <div class="price">£13.99</div>
                    </div>
                    
                    <div class="menu-item">
                        <h5>Vegetarian Supreme</h5>
                        <p class="text-muted">Mixed vegetables with mozzarella and herbs</p>
                        <div class="price">£10.99</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center mb-5">Visit Us</h2>
            <div class="row">
                <div class="col-md-4 text-center">
                    <i class="fas fa-map-marker-alt fa-3x text-primary mb-3"></i>
                    <h5>Location</h5>
                    <p>123 Food Street<br>London, UK<br>SW1A 1AA</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-clock fa-3x text-primary mb-3"></i>
                    <h5>Opening Hours</h5>
                    <p>Monday - Sunday<br>11:00 AM - 11:00 PM</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-phone fa-3x text-primary mb-3"></i>
                    <h5>Contact</h5>
                    <p>Phone: +44 20 1234 5678<br>Email: info@emparoperi.com</p>
                </div>
            </div>
        </div>
    </section>

    <footer class="py-4 text-center" style="background-color: #333; color: white;">
        <div class="container">
            <p>&copy; 2025 Emparo Peri Peri. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(restaurantHTML);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Emparo Peri Peri' });
});

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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Emparo Peri Peri server running on port ${PORT}`);
});

export default app;