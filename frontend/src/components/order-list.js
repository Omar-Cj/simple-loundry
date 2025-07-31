export class OrderList {
    constructor(apiService) {
        this.apiService = apiService;
        this.orders = [];
    }

    render() {
        return `
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">
                            <i class="fas fa-list me-2"></i>Laundry Orders
                        </h5>
                        <div class="d-flex gap-2">
                            <select id="status-filter" class="form-select form-select-sm" style="width: auto;">
                                <option value="">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="in_progress">In Progress</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="done">Done</option>
                            </select>
                            <button id="refresh-btn" class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="orders-container">
                            <div class="text-center py-4">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <div class="mt-2">Loading orders...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadOrders();
        });

        document.getElementById('status-filter').addEventListener('change', (e) => {
            this.filterOrders(e.target.value);
        });
    }

    async loadOrders() {
        try {
            const response = await this.apiService.getOrders();
            console.log('API response:', response); // Debug logging
            
            // Ensure we have an array
            if (Array.isArray(response)) {
                this.orders = response;
            } else if (response && Array.isArray(response.results)) {
                this.orders = response.results;
            } else {
                console.warn('Unexpected API response format:', response);
                this.orders = [];
            }
            
            this.renderOrders();
        } catch (error) {
            this.renderError('Failed to load orders. Please check if the backend server is running.');
            console.error('Error loading orders:', error);
        }
    }

    renderOrders(filteredOrders = null) {
        const orders = filteredOrders || this.orders;
        const container = document.getElementById('orders-container');

        // Additional safety check
        if (!Array.isArray(orders)) {
            console.error('Orders is not an array:', orders);
            this.renderError('Invalid data format received from server.');
            return;
        }

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No orders found</h5>
                    <p class="text-muted">Click "New Order" to create your first laundry order.</p>
                </div>
            `;
            return;
        }

        const ordersHtml = orders.map(order => this.renderOrderCard(order)).join('');
        container.innerHTML = `
            <div class="row">
                ${ordersHtml}
            </div>
        `;

        this.bindOrderEvents();
    }

    renderOrderCard(order) {
        const statusColor = this.getStatusColor(order.status);
        const statusIcon = this.getStatusIcon(order.status);
        const formattedDate = new Date(order.order_date).toLocaleDateString();

        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-0">
                                <i class="fas fa-user me-1"></i>${order.customer_name}
                            </h6>
                            <span class="badge bg-${statusColor}">
                                <i class="${statusIcon} me-1"></i>${order.status.replace('_', ' ')}
                            </span>
                        </div>
                        
                        <div class="text-muted small mb-2">
                            <i class="fas fa-calendar-alt me-1"></i>${formattedDate}
                        </div>
                        
                        ${order.customer_phone ? `
                            <div class="text-muted small mb-2">
                                <i class="fas fa-phone me-1"></i>${order.customer_phone}
                            </div>
                        ` : ''}
                        
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="fw-bold text-primary fs-5">$${order.total_amount}</span>
                            <small class="text-muted">${this.getItemCount(order)} items</small>
                        </div>
                        
                        ${order.notes ? `
                            <div class="text-muted small mb-3" style="max-height: 40px; overflow: hidden;">
                                <i class="fas fa-sticky-note me-1"></i>${order.notes}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="card-footer bg-transparent">
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-outline-primary btn-sm edit-order" data-order-id="${order.id}">
                                <i class="fas fa-edit me-1"></i>Edit
                            </button>
                            <button class="btn btn-outline-info btn-sm view-order" data-order-id="${order.id}">
                                <i class="fas fa-eye me-1"></i>View
                            </button>
                            <button class="btn btn-outline-danger btn-sm delete-order" data-order-id="${order.id}">
                                <i class="fas fa-trash me-1"></i>Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindOrderEvents() {
        // Edit order buttons
        document.querySelectorAll('.edit-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('.edit-order').dataset.orderId;
                document.dispatchEvent(new CustomEvent('edit-order', { 
                    detail: { orderId: parseInt(orderId) } 
                }));
            });
        });

        // View order buttons (placeholder - can expand later)
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('.view-order').dataset.orderId;
                this.showOrderDetails(orderId);
            });
        });

        // Delete order buttons
        document.querySelectorAll('.delete-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('.delete-order').dataset.orderId;
                this.confirmDeleteOrder(orderId);
            });
        });
    }

    filterOrders(status) {
        if (!status) {
            this.renderOrders();
            return;
        }

        const filtered = this.orders.filter(order => order.status === status);
        this.renderOrders(filtered);
    }

    getStatusColor(status) {
        const colors = {
            'draft': 'secondary',
            'in_progress': 'warning',
            'confirmed': 'info',
            'done': 'success'
        };
        return colors[status] || 'secondary';
    }

    getStatusIcon(status) {
        const icons = {
            'draft': 'fas fa-file-alt',
            'in_progress': 'fas fa-clock',
            'confirmed': 'fas fa-check-circle',
            'done': 'fas fa-check-double'
        };
        return icons[status] || 'fas fa-question';
    }

    getItemCount(order) {
        return order.items_count || (order.items ? order.items.length : 0);
    }

    async confirmDeleteOrder(orderId) {
        if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await this.apiService.deleteOrder(orderId);
                this.loadOrders(); // Refresh the list
            } catch (error) {
                alert('Failed to delete order. Please try again.');
                console.error('Error deleting order:', error);
            }
        }
    }

    showOrderDetails(orderId) {
        // For now, just edit the order. Can be expanded to show a modal later
        document.dispatchEvent(new CustomEvent('edit-order', { 
            detail: { orderId: parseInt(orderId) } 
        }));
    }

    renderError(message) {
        const container = document.getElementById('orders-container');
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
                <button class="btn btn-outline-danger btn-sm ms-2" onclick="location.reload()">
                    <i class="fas fa-sync-alt me-1"></i>Retry
                </button>
            </div>
        `;
    }
}

