import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  cartCount?: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount = 0 }) => {
  const history = useHistory();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🍔</span>
          <span className="logo-text">FoodHub</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <button
            className="cart-button"
            onClick={() => history.push('/checkout')}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;