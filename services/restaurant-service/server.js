const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Mock restaurant data
const restaurants = [
  {
    id: 'rest-001',
    name: 'Spice of India - Delhi',
    cuisine: 'North Indian',
    rating: 4.8,
    deliveryTime: '30-40 min',
    minimumOrder: 500,
    location: 'Connaught Place, New Delhi',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe'
  },
  {
    id: 'rest-002',
    name: 'Mumbai Tandoor House',
    cuisine: 'Punjabi',
    rating: 4.6,
    deliveryTime: '25-35 min',
    minimumOrder: 450,
    location: 'Bandra West, Mumbai',
    image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969'
  },
  {
    id: 'rest-003',
    name: 'Hyderabadi Biryani Express',
    cuisine: 'Hyderabadi',
    rating: 4.7,
    deliveryTime: '35-45 min',
    minimumOrder: 600,
    location: 'Banjara Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8'
  },
  {
    id: 'rest-004',
    name: 'Bangalore Curry Palace',
    cuisine: 'South Indian',
    rating: 4.5,
    deliveryTime: '30-40 min',
    minimumOrder: 500,
    location: 'Indiranagar, Bangalore',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641'
  },
  {
    id: 'rest-005',
    name: 'Kolkata Spice Junction',
    cuisine: 'Bengali', 
    rating: 4.4,
    deliveryTime: '40-50 min',
    minimumOrder: 450,  
    location: 'Park Street, Kolkata',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
  },
  {
    id: 'rest-006',
    name: 'Chennai Dosa Hub',
    cuisine: 'South Indian',    
    rating: 4.6,
    deliveryTime: '25-35 min',
    minimumOrder: 400,  
    location: 'T. Nagar, Chennai',
    image: 'https://images.unsplash.com/photo-1543352634-8e6f3c8f2f5b'  
  }
];

const menus = {
  'rest-001': [
    { id: 'item-001', name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken', price: 650, category: 'Main Course' },
    { id: 'item-002', name: 'Chicken Tikka Masala', description: 'Grilled chicken in spiced curry sauce', price: 680, category: 'Main Course' },
    { id: 'item-003', name: 'Garlic Naan', description: 'Fresh baked bread with garlic and butter', price: 80, category: 'Breads' },
    { id: 'item-004', name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes', price: 120, category: 'Appetizers' }
  ],
  'rest-002': [
    { id: 'item-005', name: 'Tandoori Chicken', description: 'Clay oven roasted chicken with spices', price: 580, category: 'Tandoor' },
    { id: 'item-006', name: 'Paneer Tikka', description: 'Grilled cottage cheese with bell peppers', price: 520, category: 'Tandoor' },
    { id: 'item-007', name: 'Roti', description: 'Whole wheat Indian flatbread', price: 40, category: 'Breads' },
    { id: 'item-008', name: 'Pakora', description: 'Mixed vegetable fritters', price: 150, category: 'Appetizers' }
  ],
  'rest-003': [
    { id: 'item-009', name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 750, category: 'Biryani' },
    { id: 'item-010', name: 'Mutton Biryani', description: 'Aromatic rice with tender mutton pieces', price: 850, category: 'Biryani' },
    { id: 'item-011', name: 'Raita', description: 'Yogurt with cucumber and spices', price: 80, category: 'Sides' },
    { id: 'item-012', name: 'Gulab Jamun', description: 'Sweet milk dumplings in syrup', price: 120, category: 'Desserts' }
  ],
  'rest-004': [
    { id: 'item-013', name: 'Palak Paneer', description: 'Cottage cheese in spinach curry', price: 480, category: 'Vegetarian' },
    { id: 'item-014', name: 'Dal Makhani', description: 'Creamy black lentils with spices', price: 420, category: 'Vegetarian' },
    { id: 'item-015', name: 'Chicken Korma', description: 'Mild curry with cashew and cream', price: 620, category: 'Main Course' },
    { id: 'item-016', name: 'Mango Lassi', description: 'Sweet yogurt drink with mango', price: 120, category: 'Beverages' }
  ],
  'rest-005': [ 
    { id: 'item-017', name: 'Fish Curry', description: 'Spicy Bengali fish curry', price: 680, category: 'Main Course' },
    { id: 'item-018', name: 'Chingri Malai Curry', description: 'Prawns cooked in coconut milk', price: 780, category: 'Main Course' },
    { id: 'item-019', name: 'Luchi', description: 'Deep-fried puffed bread', price: 60, category: 'Breads' },   
    { id: 'item-020', name: 'Rasgulla', description: 'Soft cheese balls in sugar syrup', price: 140, category: 'Desserts' }
  ],
  'rest-006': [ 
    { id: 'item-021', name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potatoes', price: 280, category: 'Dosa' },  
    { id: 'item-022', name: 'Idli Sambar', description: 'Steamed rice cakes with lentil stew', price: 220, category: 'Breakfast' },
    { id: 'item-023', name: 'Vada', description: 'Savory fried lentil doughnuts', price: 150, category: 'Snacks' },
    { id: 'item-024', name: 'Filter Coffee', description: 'Strong South Indian style coffee', price: 100, category: 'Beverages' }
  ]
};

// Get all restaurants
app.get('/restaurants', (req, res) => {
  console.log(`[${PORT}] GET /restaurants`);
  res.json({
    success: true,
    data: restaurants,
    server: `restaurant-service:${PORT}`
  });
});

// Get restaurant by ID
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id === req.params.id);
  console.log(`[${PORT}] GET /restaurants/${req.params.id}`);
  
  if (!restaurant) {
    return res.status(404).json({ success: false, error: 'Restaurant not found' });
  }
  
  res.json({
    success: true,
    data: restaurant,
    server: `restaurant-service:${PORT}`
  });
});

// Get menu for a restaurant
app.get('/restaurants/:id/menu', (req, res) => {
  const menu = menus[req.params.id];
  console.log(`[${PORT}] GET /restaurants/${req.params.id}/menu`);
  
  if (!menu) {
    return res.status(404).json({ success: false, error: 'Menu not found' });
  }
  
  res.json({
    success: true,
    data: menu,
    server: `restaurant-service:${PORT}`
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'restaurant-service',
    port: PORT 
  });
});

app.listen(PORT, () => {
  console.log(`🍽️  Restaurant Service running on port ${PORT}`);
});
