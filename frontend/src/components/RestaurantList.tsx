import React, { useEffect, useState } from 'react';
import { fetchRestaurants } from '../services/api';

interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
}

const RestaurantList: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getRestaurants = async () => {
            try {
                const data = await fetchRestaurants();
                setRestaurants(data);
            } catch (err) {
                setError('Failed to fetch restaurants');
            } finally {
                setLoading(false);
            }
        };

        getRestaurants();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Restaurants</h2>
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id}>{restaurant.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantList;