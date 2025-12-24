import React, { useEffect, useState } from 'react';
import { fetchCartItems, removeCartItem } from '../services/api';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const loadCartItems = async () => {
            const items = await fetchCartItems();
            setCartItems(items);
        };
        loadCartItems();
    }, []);

    const handleRemoveItem = async (itemId: string) => {
        await removeCartItem(itemId);
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    return (
        <div>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            {item.name} - ₹{item.price}
                            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;