import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { fetchRestaurantMenu } from '../services/api';
import { CartItem } from '../App';
import './Menu.css';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface MenuProps {
  addToCart: (item: CartItem) => void;
  cart: CartItem[];
}

const Menu: React.FC<MenuProps> = ({ addToCart, cart }) => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  const loadMenu = async () => {
    try {
      setLoading(true);
      const response = await fetchRestaurantMenu(restaurantId);
      setMenuItems(response.data || []);
      setError('');
    } catch (err: any) {
      setError('Failed to load menu. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId,
    });
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ {error}</h2>
        <button onClick={loadMenu} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const categories = [...new Set(menuItems.map((item) => item.category))];

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="container">
          <button className="back-btn" onClick={() => history.push('/')}>
            ← Back to Restaurants
          </button>
          <h1>🍽️ Menu</h1>
        </div>
      </div>

      <div className="container menu-container">
        {categories.map((category) => (
          <div key={category} className="menu-category">
            <h2 className="category-title">{category}</h2>
            <div className="menu-items">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <div key={item.id} className="menu-item-card">
                    <div className="menu-item-info">
                      <h3>{item.name}</h3>
                      <p className="description">{item.description}</p>
                      <p className="price">₹{item.price}</p>
                    </div>
                    <div className="menu-item-actions">
                      {getItemQuantity(item.id) > 0 && (
                        <span className="in-cart">
                          In cart: {getItemQuantity(item.id)}
                        </span>
                      )}
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="floating-cart">
          <div className="container">
            <div className="floating-cart-content">
              <div className="cart-summary">
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                <span className="total">
                  ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                </span>
              </div>
              <button
                className="view-cart-btn"
                onClick={() => history.push('/checkout')}
              >
                View Cart →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;