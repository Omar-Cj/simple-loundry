export class OrderManager {
    constructor(apiService) {
        this.apiService = apiService;
        this.currentOrder = null;
        this.items = [];
        this.editingItemIndex = -1;
        
        this.itemTypes = [
            { value: 'shirt', label: 'Shirt', defaultPrice: 5.00 },
            { value: 'pants', label: 'Pants', defaultPrice: 7.00 },
            { value: 'dress', label: 'Dress', defaultPrice: 12.00 },
            { value: 'bedsheet', label: 'Bed Sheet', defaultPrice: 8.00 },
            { value: 'towel', label: 'Towel', defaultPrice: 4.00 },
            { value: 'other', label: 'Other', defaultPrice: 6.00 }
        ];
    }

    render() {
        return `
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">
                            <i class="fas fa-plus-circle me-2"></i>
                            <span id="form-title">New Laundry Order</span>
                        </h5>
                        <button id="back-to-list" class="btn btn-outline-secondary">
                            <i class="fas fa-arrow-left me-1"></i>Back to List
                        </button>
                    </div>
                    <div class="card-body">
                        <form id="order-form">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="customer-name" class="form-label">Customer Name *</label>
                                        <input type="text" class="form-control" id="customer-name" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="customer-phone" class="form-label">Phone Number</label>
                                        <input type="tel" class="form-control" id="customer-phone">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="order-status" class="form-label">Status</label>
                                        <select class="form-select" id="order-status">
                                            <option value="draft">Draft</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="total-amount" class="form-label">Total Amount</label>
                                        <div class="input-group">
                                            <span class="input-group-text">$</span>
                                            <input type="number" class="form-control" id="total-amount" step="0.01" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="order-notes" class="form-label">Notes</label>
                                <textarea class="form-control" id="order-notes" rows="3" placeholder="Any special instructions or notes..."></textarea>
                            </div>
                        </form>

                        <hr>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="mb-0">
                                <i class="fas fa-list-ul me-2"></i>Order Items
                            </h6>
                            <button id="add-item-btn" class="btn btn-primary btn-sm">
                                <i class="fas fa-plus me-1"></i>Add Item
                            </button>
                        </div>

                        <!-- Item Form -->
                        <div id="item-form" class="card bg-light mb-3" style="display: none;">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="mb-3">
                                            <label for="item-name" class="form-label">Item Name *</label>
                                            <input type="text" class="form-control" id="item-name" required>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="mb-3">
                                            <label for="item-type" class="form-label">Type</label>
                                            <select class="form-select" id="item-type">
                                                ${this.itemTypes.map(type => 
                                                    `<option value="${type.value}" data-price="${type.defaultPrice}">${type.label}</option>`
                                                ).join('')}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="mb-3">
                                            <label for="item-quantity" class="form-label">Quantity *</label>
                                            <input type="number" class="form-control" id="item-quantity" min="1" value="1" required>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="mb-3">
                                            <label for="item-price" class="form-label">Unit Price *</label>
                                            <div class="input-group">
                                                <span class="input-group-text">$</span>
                                                <input type="number" class="form-control" id="item-price" step="0.01" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="mb-3">
                                            <label for="item-subtotal" class="form-label">Subtotal</label>
                                            <div class="input-group">
                                                <span class="input-group-text">$</span>
                                                <input type="number" class="form-control" id="item-subtotal" step="0.01" readonly>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex gap-2">
                                    <button type="button" id="save-item-btn" class="btn btn-success btn-sm">
                                        <i class="fas fa-check me-1"></i>Save Item
                                    </button>
                                    <button type="button" id="cancel-item-btn" class="btn btn-secondary btn-sm">
                                        <i class="fas fa-times me-1"></i>Cancel
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Items List -->
                        <div id="items-list" class="mb-3">
                            <div class="text-center text-muted py-3">
                                <i class="fas fa-info-circle me-1"></i>No items added yet
                            </div>
                        </div>

                        <hr>

                        <div class="d-flex justify-content-between">
                            <div class="fs-5 fw-bold">
                                Total: <span id="order-total" class="text-primary">$0.00</span>
                            </div>
                            <div class="d-flex gap-2">
                                <button id="save-order-btn" class="btn btn-success">
                                    <i class="fas fa-save me-1"></i>Save Order
                                </button>
                                <button id="cancel-order-btn" class="btn btn-secondary">
                                    <i class="fas fa-times me-1"></i>Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Back to list button
        document.getElementById('back-to-list').addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('back-to-list'));
        });

        // Add item button
        document.getElementById('add-item-btn').addEventListener('click', () => {
            this.showItemForm();
        });

        // Item type change
        document.getElementById('item-type').addEventListener('change', (e) => {
            const selectedOption = e.target.selectedOptions[0];
            const defaultPrice = selectedOption.dataset.price;
            document.getElementById('item-price').value = defaultPrice;
            this.calculateItemSubtotal();
        });

        // Quantity and price changes
        document.getElementById('item-quantity').addEventListener('input', () => {
            this.calculateItemSubtotal();
        });
        
        document.getElementById('item-price').addEventListener('input', () => {
            this.calculateItemSubtotal();
        });

        // Save item button
        document.getElementById('save-item-btn').addEventListener('click', () => {
            this.saveItem();
        });

        // Cancel item button
        document.getElementById('cancel-item-btn').addEventListener('click', () => {
            this.hideItemForm();
        });

        // Save order button
        document.getElementById('save-order-btn').addEventListener('click', () => {
            this.saveOrder();
        });

        // Cancel order button
        document.getElementById('cancel-order-btn').addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('back-to-list'));
        });

        // Initialize item type default price
        this.setDefaultPrice();
    }

    setDefaultPrice() {
        const itemType = document.getElementById('item-type');
        const selectedOption = itemType.selectedOptions[0];
        const defaultPrice = selectedOption.dataset.price;
        document.getElementById('item-price').value = defaultPrice;
        this.calculateItemSubtotal();
    }

    showItemForm() {
        document.getElementById('item-form').style.display = 'block';
        document.getElementById('item-name').focus();
        this.editingItemIndex = -1;
        this.clearItemForm();
        this.setDefaultPrice();
    }

    hideItemForm() {
        document.getElementById('item-form').style.display = 'none';
        this.editingItemIndex = -1;
        this.clearItemForm();
    }

    clearItemForm() {
        document.getElementById('item-name').value = '';
        document.getElementById('item-type').selectedIndex = 0;
        document.getElementById('item-quantity').value = '1';
        document.getElementById('item-price').value = '';
        document.getElementById('item-subtotal').value = '';
    }

    calculateItemSubtotal() {
        const quantity = parseFloat(document.getElementById('item-quantity').value) || 0;
        const price = parseFloat(document.getElementById('item-price').value) || 0;
        const subtotal = quantity * price;
        document.getElementById('item-subtotal').value = subtotal.toFixed(2);
    }

    saveItem() {
        const name = document.getElementById('item-name').value.trim();
        const type = document.getElementById('item-type').value;
        const quantity = parseInt(document.getElementById('item-quantity').value);
        const unitPrice = parseFloat(document.getElementById('item-price').value);

        if (!name || !quantity || !unitPrice) {
            alert('Please fill in all required fields');
            return;
        }

        const item = {
            name,
            item_type: type,
            quantity,
            unit_price: unitPrice,
            subtotal: quantity * unitPrice
        };

        if (this.editingItemIndex === -1) {
            this.items.push(item);
        } else {
            this.items[this.editingItemIndex] = item;
        }

        this.renderItems();
        this.calculateOrderTotal();
        this.hideItemForm();
    }

    renderItems() {
        const container = document.getElementById('items-list');
        
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-3">
                    <i class="fas fa-info-circle me-1"></i>No items added yet
                </div>
            `;
            return;
        }

        const itemsHtml = this.items.map((item, index) => `
            <div class="card mb-2">
                <div class="card-body py-2">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <strong>${item.name}</strong>
                            <br><small class="text-muted">${this.getItemTypeLabel(item.item_type)}</small>
                        </div>
                        <div class="col-md-2 text-center">
                            <span class="badge bg-secondary">${item.quantity}x</span>
                        </div>
                        <div class="col-md-2 text-center">
                            $${item.unit_price.toFixed(2)}
                        </div>
                        <div class="col-md-2 text-center">
                            <strong>$${item.subtotal.toFixed(2)}</strong>
                        </div>
                        <div class="col-md-3 text-end">
                            <button class="btn btn-outline-primary btn-sm me-1" onclick="orderManager.editItem(${index})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="orderManager.deleteItem(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = itemsHtml;
    }

    editItem(index) {
        const item = this.items[index];
        this.editingItemIndex = index;
        
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-type').value = item.item_type;
        document.getElementById('item-quantity').value = item.quantity;
        document.getElementById('item-price').value = item.unit_price;
        this.calculateItemSubtotal();
        
        this.showItemForm();
    }

    deleteItem(index) {
        if (confirm('Are you sure you want to remove this item?')) {
            this.items.splice(index, 1);
            this.renderItems();
            this.calculateOrderTotal();
        }
    }

    calculateOrderTotal() {
        const total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
        document.getElementById('total-amount').value = total.toFixed(2);
        document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
    }

    getItemTypeLabel(type) {
        const itemType = this.itemTypes.find(t => t.value === type);
        return itemType ? itemType.label : type;
    }

    async saveOrder() {
        const customerName = document.getElementById('customer-name').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const status = document.getElementById('order-status').value;
        const notes = document.getElementById('order-notes').value.trim();
        const totalAmount = parseFloat(document.getElementById('total-amount').value) || 0;

        if (!customerName) {
            alert('Please enter customer name');
            return;
        }

        if (this.items.length === 0) {
            alert('Please add at least one item to the order');
            return;
        }

        const orderData = {
            customer_name: customerName,
            customer_phone: customerPhone,
            status: status,
            notes: notes,
            total_amount: totalAmount,
            items: this.items
        };

        try {
            if (this.currentOrder) {
                await this.apiService.updateOrder(this.currentOrder.id, orderData);
                document.dispatchEvent(new CustomEvent('order-updated'));
            } else {
                await this.apiService.createOrder(orderData);
                document.dispatchEvent(new CustomEvent('order-created'));
            }
        } catch (error) {
            alert('Failed to save order. Please check if the backend server is running.');
            console.error('Error saving order:', error);
        }
    }

    async loadOrder(orderId) {
        try {
            this.currentOrder = await this.apiService.getOrder(orderId);
            this.populateForm();
            document.getElementById('form-title').textContent = `Edit Order #${orderId}`;
        } catch (error) {
            alert('Failed to load order details.');
            console.error('Error loading order:', error);
        }
    }

    populateForm() {
        if (!this.currentOrder) return;

        document.getElementById('customer-name').value = this.currentOrder.customer_name || '';
        document.getElementById('customer-phone').value = this.currentOrder.customer_phone || '';
        document.getElementById('order-status').value = this.currentOrder.status || 'draft';
        document.getElementById('order-notes').value = this.currentOrder.notes || '';
        document.getElementById('total-amount').value = this.currentOrder.total_amount || '0.00';

        // Convert string values to numbers for items from API
        this.items = (this.currentOrder.items || []).map(item => ({
            ...item,
            unit_price: parseFloat(item.unit_price) || 0,
            subtotal: parseFloat(item.subtotal) || 0,
            quantity: parseInt(item.quantity) || 0
        }));
        
        this.renderItems();
        this.calculateOrderTotal();
    }

    resetForm() {
        this.currentOrder = null;
        this.items = [];
        
        document.getElementById('form-title').textContent = 'New Laundry Order';
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-phone').value = '';
        document.getElementById('order-status').value = 'draft';
        document.getElementById('order-notes').value = '';
        document.getElementById('total-amount').value = '0.00';
        document.getElementById('order-total').textContent = '$0.00';
        
        this.renderItems();
        this.hideItemForm();
    }
}

// Make orderManager globally accessible for onclick handlers
window.orderManager = null;