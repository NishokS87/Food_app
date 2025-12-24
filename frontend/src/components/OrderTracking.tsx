import React, { useEffect, useState } from 'react';
import { fetchOrderStatus } from '../services/api';

const OrderTracking: React.FC = () => {
    const [orderId, setOrderId] = useState<string>('');
    const [orderStatus, setOrderStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleTrackOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const status = await fetchOrderStatus(orderId);
            setOrderStatus(status);
        } catch (err) {
            setError('Failed to fetch order status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Track Your Order</h2>
            <input
                type="text"
                placeholder="Enter your order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
            />
            <button onClick={handleTrackOrder} disabled={loading}>
                {loading ? 'Tracking...' : 'Track Order'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {orderStatus && <p>Order Status: {orderStatus}</p>}
        </div>
    );
};

export default OrderTracking;