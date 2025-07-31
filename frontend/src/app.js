import { ApiService } from './services/api.js';
import { OrderManager } from './components/order-manager.js';
import { OrderList } from './components/order-list.js';

export class LaundryApp {
    constructor() {
        this.apiService = new ApiService();
        this.orderManager = new OrderManager(this.apiService);
        this.orderList = new OrderList(this.apiService);
        this.currentView = 'list';
    }

    init() {
        this.setupDOM();
        this.bindEvents();
        this.showOrderList();
    }

    setupDOM() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container-fluid">
                <header class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                    <div class="container">
                        <span class="navbar-brand mb-0 h1">
                            <i class="fas fa-tshirt me-2"></i>Laundry Management System
                        </span>
                        <div class="navbar-nav ms-auto">
                            <button id="new-order-btn" class="btn btn-light">
                                <i class="fas fa-plus me-1"></i>New Order
                            </button>
                        </div>
                    </div>
                </header>

                <div class="container">
                    <div id="main-content" class="row">
                        <!-- Content will be dynamically loaded here -->
                    </div>
                </div>

                <!-- Loading Overlay -->
                <div id="loading-overlay" class="position-fixed top-0 start-0 w-100 h-100 d-none" 
                     style="background: rgba(0,0,0,0.5); z-index: 9999;">
                    <div class="d-flex justify-content-center align-items-center h-100">
                        <div class="text-center text-white">
                            <div class="spinner-border mb-3" role="status"></div>
                            <div>Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add Font Awesome for icons
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(link);
        }
    }

    bindEvents() {
        document.getElementById('new-order-btn').addEventListener('click', () => {
            this.showOrderForm();
        });

        // Listen for custom events
        document.addEventListener('order-created', () => {
            this.showOrderList();
        });

        document.addEventListener('order-updated', () => {
            this.showOrderList();
        });

        document.addEventListener('edit-order', (e) => {
            this.showOrderForm(e.detail.orderId);
        });

        document.addEventListener('back-to-list', () => {
            this.showOrderList();
        });
    }

    showOrderList() {
        this.currentView = 'list';
        const content = document.getElementById('main-content');
        content.innerHTML = this.orderList.render();
        this.orderList.bindEvents();
        this.orderList.loadOrders();
    }

    showOrderForm(orderId = null) {
        this.currentView = 'form';
        const content = document.getElementById('main-content');
        content.innerHTML = this.orderManager.render();
        this.orderManager.bindEvents();
        
        // Make orderManager globally accessible for onclick handlers
        window.orderManager = this.orderManager;
        
        if (orderId) {
            this.orderManager.loadOrder(orderId);
        } else {
            this.orderManager.resetForm();
        }
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.remove('d-none');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('d-none');
    }
}