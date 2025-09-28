-- Seed data for menu_items table
-- This provides basic menu items until sync system is fully implemented

INSERT INTO menu_items (name, category, price, description, spice_level, is_available) VALUES
('Chicken Burger', 'Burgers', '8.50', 'Grilled chicken breast with fresh lettuce and tomato', 0, 1),
('Beef Burger', 'Burgers', '9.50', 'Premium beef patty with cheese and onions', 0, 1),
('Chicken Wings', 'Chicken', '7.50', 'Crispy chicken wings with your choice of sauce', 1, 1),
('Chicken Strips', 'Chicken', '6.50', 'Tender chicken strips with garlic mayo', 0, 1),
('Margherita Pizza', 'Pizzas', '8.50', 'Fresh tomato, mozzarella and basil', 0, 1),
('Pepperoni Pizza', 'Pizzas', '8.50', 'Classic pepperoni with mozzarella cheese', 0, 1),
('BBQ Chicken Pizza', 'Pizzas', '8.50', 'BBQ chicken with red onions and peppers', 0, 1),
('Chicken Platter', 'Platters', '12.50', 'Mixed chicken pieces with chips and salad', 1, 1),
('Mixed Grill', 'Platters', '15.50', 'Chicken, beef and lamb with rice and chips', 1, 1),
('Nachos', 'Starters', '5.50', 'Crispy nachos with cheese and jalapeños', 1, 1),
('Chicken Nuggets', 'Starters', '4.50', '8 piece chicken nuggets with dip', 0, 1),
('Chocolate Milkshake', 'Milkshakes', '3.50', 'Rich chocolate milkshake with whipped cream', 0, 1),
('Strawberry Milkshake', 'Milkshakes', '3.50', 'Fresh strawberry milkshake', 0, 1),
('Vanilla Milkshake', 'Milkshakes', '3.50', 'Classic vanilla milkshake', 0, 1);