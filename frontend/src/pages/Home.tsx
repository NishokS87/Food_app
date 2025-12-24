import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchRestaurants } from '../services/api';
import './Home.css';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
  image: string;
  location?: string;
}

const Home: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetchRestaurants();
      setRestaurants(response.data || []);
      setError('');
    } catch (err: any) {
      setError('Failed to load restaurants. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurantId: string) => {
    history.push(`/menu/${restaurantId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ {error}</h2>
        <button onClick={loadRestaurants} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>� Authentic Indian Food Delivered to Your Door</h1>
          <p>Order from the best restaurants across India</p>
        </div>
      </section>

      <section className="restaurants-section">
        <div className="container">
          <h2>Popular Restaurants</h2>
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="restaurant-card"
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div className="restaurant-image">
                  <img src={restaurant.image} alt={restaurant.name} />
                  <div className="rating">
                    <span>⭐ {restaurant.rating}</span>
                  </div>
                </div>
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p className="cuisine">{restaurant.cuisine}</p>
                  {restaurant.location && <p className="location">📍 {restaurant.location}</p>}
                  <div className="restaurant-meta">
                    <span className="delivery-time">🕐 {restaurant.deliveryTime}</span>
                    <span className="min-order">💰 Min ₹{restaurant.minimumOrder}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;