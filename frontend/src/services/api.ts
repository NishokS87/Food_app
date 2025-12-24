import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // API Server endpoint

const api = axios.create({
    baseURL: API_BASE_URL
});

export const fetchRestaurants = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/restaurants`);
        return response.data;
    } catch (error: any) {
        throw new Error('Error fetching restaurants: ' + error.message);
    }
};

export const fetchRestaurantMenu = async (restaurantId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/restaurants/${restaurantId}/menu`);
        return response.data;
    } catch (error: any) {
        throw new Error('Error fetching menu: ' + error.message);
    }
};

export const placeOrder = async (orderData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
        return response.data;
    } catch (error: any) {
        throw new Error('Error placing order: ' + error.message);
    }
};

export const trackOrder = async (orderId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders/${orderId}/track`);
        return response.data;
    } catch (error: any) {
        throw new Error('Error tracking order: ' + error.message);
    }
};

export const fetchCartItems = async () => {
    // For now, return cart from localStorage
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

export const removeCartItem = async (itemId: string) => {
    // For now, just a placeholder - in production, this would be an API call
    const cart = localStorage.getItem('cart');
    if (cart) {
        const items = JSON.parse(cart);
        const updatedCart = items.filter((item: any) => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
};

export const fetchOrderStatus = async (orderId: string) => {
    return trackOrder(orderId);
};

export default api;