export class ApiService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Handle empty responses (like DELETE 204)
            const contentType = response.headers.get('content-type');
            if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Order methods
    async getOrders() {
        const response = await this.request('/orders/');
        // Handle Django REST Framework pagination
        return response.results || response;
    }

    async getOrder(id) {
        return this.request(`/orders/${id}/`);
    }

    async createOrder(orderData) {
        return this.request('/orders/', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async updateOrder(id, orderData) {
        return this.request(`/orders/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(orderData)
        });
    }

    async deleteOrder(id) {
        return this.request(`/orders/${id}/`, {
            method: 'DELETE'
        });
    }

    // Item methods
    async getOrderItems(orderId) {
        return this.request(`/orders/${orderId}/items/`);
    }

    async createItem(itemData) {
        return this.request('/items/', {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
    }

    async updateItem(id, itemData) {
        return this.request(`/items/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(itemData)
        });
    }

    async deleteItem(id) {
        return this.request(`/items/${id}/`, {
            method: 'DELETE'
        });
    }
}