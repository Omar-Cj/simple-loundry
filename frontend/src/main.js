import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';
import { LaundryApp } from './app.js';

// Initialize the laundry application
document.addEventListener('DOMContentLoaded', () => {
    const app = new LaundryApp();
    app.init();
});