export class GatewayService {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async forwardRequest(endpoint: string, method: string, body?: any): Promise<any> {
        const response = await fetch(`${this.apiUrl}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return response.json();
    }

    async fetchRestaurants(): Promise<any> {
        return this.forwardRequest('restaurants', 'GET');
    }

    async placeOrder(orderData: any): Promise<any> {
        return this.forwardRequest('orders', 'POST', orderData);
    }

    async trackOrder(orderId: string): Promise<any> {
        return this.forwardRequest(`orders/${orderId}`, 'GET');
    }
}