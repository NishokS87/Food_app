import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CartItem } from '../App';
import './Checkout.css';
import api from '../services/api';

interface CheckoutProps {
  cart: CartItem[];
  updateCart: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, updateCart, removeFromCart }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCart(itemId, newQuantity);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 80;
  const tax = subtotal * 0.18;
  const total = subtotal + deliveryFee + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get restaurantId from the first item in cart
      const restaurantId = cart[0]?.restaurantId || 'rest-001';
      
      const orderData = {
        customerId: 'customer-' + Date.now(), // Generate a customer ID
        restaurantId: restaurantId,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        totalAmount: total,
        customerName: formData.name,
        customerPhone: formData.phone
      };

      const response = await api.post('/orders', orderData);
      const orderIdFromResponse = response.data.data?.id || response.data.id || response.data.orderId;
      setOrderId(orderIdFromResponse);
      setOrderStatus('placed');
      
      // Start tracking order status
      setTimeout(() => setOrderStatus('confirmed'), 3000);
      setTimeout(() => setOrderStatus('preparing'), 6000);
      setTimeout(() => setOrderStatus('out_for_delivery'), 10000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderId) {
    return (
      <div className="empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to your cart!</p>
            <button className="primary-btn" onClick={() => history.push('/')}>
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="order-success">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h1>Order Placed Successfully!</h1>
            <p className="order-id">Order ID: #{orderId}</p>
            
            <div className="order-tracking">
              <h2>Track Your Order</h2>
              <div className="status-timeline">
                <div className={`status-step ${['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].indexOf(orderStatus) >= 0 ? 'active' : ''}`}>
                  <div className="step-icon">📝</div>
                  <div className="step-label">Order Placed</div>
                </div>
                <div className={`status-step ${['confirmed', 'preparing', 'out_for_delivery', 'delivered'].indexOf(orderStatus) >= 0 ? 'active' : ''}`}>
                  <div className="step-icon">✅</div>
                  <div className="step-label">Confirmed</div>
                </div>
                <div className={`status-step ${['preparing', 'out_for_delivery', 'delivered'].indexOf(orderStatus) >= 0 ? 'active' : ''}`}>
                  <div className="step-icon">👨‍🍳</div>
                  <div className="step-label">Preparing</div>
                </div>
                <div className={`status-step ${['out_for_delivery', 'delivered'].indexOf(orderStatus) >= 0 ? 'active' : ''}`}>
                  <div className="step-icon">🚗</div>
                  <div className="step-label">Out for Delivery</div>
                </div>
                <div className={`status-step ${orderStatus === 'delivered' ? 'active' : ''}`}>
                  <div className="step-icon">🏠</div>
                  <div className="step-label">Delivered</div>
                </div>
              </div>

              <div className="current-status">
                <p><strong>Current Status:</strong> {orderStatus.replace('_', ' ').toUpperCase()}</p>
                <p className="estimated-time">Estimated Delivery: 30-40 minutes</p>
              </div>
            </div>

            <button className="primary-btn" onClick={() => history.push('/')}>
              Order More Food
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        <div className="checkout-content">
          <div>
            <div className="cart-section">
              <h2>Your Order</h2>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">₹{item.price}</p>
                  </div>
                  <div className="item-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="delivery-section">
              <h2>Delivery Information</h2>
              <form onSubmit={handleSubmit} className="delivery-form">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Phone Number" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Street Address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-row">
                  <input 
                    type="text" 
                    name="city" 
                    placeholder="City" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required 
                  />
                  <input 
                    type="text" 
                    name="zipCode" 
                    placeholder="ZIP Code" 
                    value={formData.zipCode} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%):</span>
              <span>₹{Math.round(tax)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{Math.round(total)}</span>
            </div>
            <button 
              className="place-order-btn" 
              onClick={handleSubmit}
              disabled={loading || cart.length === 0}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
