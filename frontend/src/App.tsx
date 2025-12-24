import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import './App.css';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
}

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <Router>
      <div className="app">
        <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route
            path="/menu/:restaurantId"
            render={(props) => (
              <Menu {...props} addToCart={addToCart} cart={cart} />
            )}
          />
          <Route
            path="/checkout"
            render={(props) => (
              <Checkout
                {...props}
                cart={cart}
                updateCart={updateQuantity}
                removeFromCart={removeFromCart}
              />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default App;