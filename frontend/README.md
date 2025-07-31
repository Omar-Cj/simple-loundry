# Laundry Management System - Frontend

A modern, responsive frontend for the Laundry Management System built with vanilla JavaScript, Bootstrap 5, and Vite.

## Features

### ✨ Order Management
- **Create Orders**: Add new laundry orders with customer details
- **Edit Orders**: Modify existing orders and their items
- **View Orders**: Browse all orders with filtering by status
- **Delete Orders**: Remove orders with confirmation

### 🧾 Item Management
- **Add Items**: Add laundry items with predefined types and pricing
- **Edit Items**: Modify item details including quantity and pricing
- **Remove Items**: Delete items from orders
- **Automatic Calculations**: Real-time subtotal and total calculations

### 📱 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Bootstrap 5**: Modern, clean UI components
- **Font Awesome Icons**: Consistent iconography throughout
- **Loading States**: Visual feedback during API operations
- **Form Validation**: Client-side validation for required fields

### 🎨 Design Features
- **Card-based Layout**: Clean, organized information display
- **Status Badges**: Color-coded order status indicators
- **Hover Effects**: Interactive visual feedback
- **Loading Overlays**: User-friendly loading states
- **Animations**: Smooth transitions and micro-interactions

## Tech Stack

- **Framework**: Vanilla JavaScript (ES6+ modules)
- **Build Tool**: Vite 7.0.4
- **CSS Framework**: Bootstrap 5.3.7
- **Icons**: Font Awesome 6.0.0
- **API**: Fetch API for backend communication

## Project Structure

```
src/
├── app.js                 # Main application controller
├── main.js               # Application entry point
├── style.css             # Custom styles and overrides
├── services/
│   └── api.js           # API service for backend communication
└── components/
    ├── order-list.js     # Order listing and filtering component
    └── order-manager.js  # Order creation and editing component
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Running Django backend on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Production Build

```bash
npm run build
```

Built files will be in the `dist/` directory.

## API Integration

The frontend communicates with a Django REST API backend with the following endpoints:

- `GET /api/orders/` - List all orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/` - Update order
- `DELETE /api/orders/{id}/` - Delete order
- `POST /api/items/` - Create new item
- `PATCH /api/items/{id}/` - Update item
- `DELETE /api/items/{id}/` - Delete item

## Order Status Flow

1. **Draft** - Initial order state
2. **In Progress** - Order being processed
3. **Confirmed** - Order confirmed and ready
4. **Done** - Order completed

## Item Types & Default Pricing

- **Shirt**: $5.00
- **Pants**: $7.00
- **Dress**: $12.00
- **Bed Sheet**: $8.00
- **Towel**: $4.00
- **Other**: $6.00

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

### Code Organization
- Modular ES6 classes for components
- Separation of concerns (API, UI, Business Logic)
- Event-driven architecture for component communication
- Responsive-first design approach

### Error Handling
- API error handling with user-friendly messages
- Form validation with immediate feedback
- Graceful degradation for offline scenarios
- Loading states for all async operations

### Performance Optimizations
- Lazy loading of components
- Efficient DOM manipulation
- CSS transitions for smooth animations
- Minimal bundle size with Vite optimization

## Future Enhancements

- [ ] Real-time updates with WebSocket
- [ ] Print receipts functionality
- [ ] Customer management system
- [ ] Inventory tracking
- [ ] Reporting and analytics
- [ ] Mobile app integration
- [ ] Offline support with service workers

## Contributing

1. Follow the existing code style and patterns
2. Add appropriate error handling
3. Test on multiple screen sizes
4. Update documentation for new features

## License

This project is part of the Laundry Management System.