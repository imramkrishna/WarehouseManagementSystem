# 🏭 Warehouse Management System

A comprehensive, modern warehouse management system built with React, TypeScript, Node.js, and PostgreSQL. This system provides real-time inventory tracking, order management, supplier management, and detailed analytics for warehouse operations.

## ✨ Features

### 🎯 Core Features
- **Real-time Dashboard** - Live overview of warehouse operations, inventory levels, and key metrics
- **Inventory Management** - Complete stock tracking with reorder points, batch numbers, and expiry dates
- **Order Management** - Handle inbound, outbound, and transfer orders with full lifecycle tracking
- **Supplier Management** - Maintain supplier relationships with ratings and performance tracking
- **Warehouse Operations** - Multi-warehouse support with location-based inventory tracking
- **User Management** - Role-based access control with authentication and authorization

### 🎨 UI/UX Features
- **Dark/Light Theme** - Toggle between themes with persistent user preference
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Notifications** - Instant alerts for low stock, order updates, and system events
- **Advanced Search & Filtering** - Quick search across all entities with smart filters
- **Data Export** - Export reports and data in multiple formats

### 📊 Analytics & Reporting
- **Interactive Reports** - Dynamic charts and graphs for business insights
- **Inventory Analytics** - Stock turnover, aging reports, and demand forecasting
- **Order Analytics** - Order processing times, fulfillment rates, and performance metrics
- **Supplier Performance** - Delivery times, quality ratings, and cost analysis

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Primary database
- **Connection pooling** - Efficient database connections
- **Migrations** - Database schema versioning

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/WarehouseManagementSystem.git
   cd WarehouseManagementSystem
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Configure your database connection in .env
   DATABASE_URL=postgresql://username:password@localhost:5432/warehouse_db
   JWT_SECRET=your-secret-key
   ```

3. **Database Setup**
   ```bash
   # Create database
   createdb warehouse_db
   
   # Run migrations (if available)
   npm run migrate
   
   # Or manually run SQL scripts
   psql -d warehouse_db -f database/schema.sql
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Configure backend URL in .env
   VITE_BACKEND_URI=http://localhost:3000/api
   ```

5. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from frontend directory)
   npm run dev
   ```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## 📁 Project Structure

```
WarehouseManagementSystem/
├── backend/
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── inventory.controller.ts
│   │   │   └── addControllers/   # CRUD operations
│   │   ├── interfaces/           # TypeScript interfaces
│   │   ├── middlewares/          # Auth & validation middleware
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   └── utils/               # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── auth/           # Authentication components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── inventory/      # Inventory management
│   │   │   ├── orders/         # Order management
│   │   │   ├── suppliers/      # Supplier management
│   │   │   ├── addForms/       # Form components
│   │   │   ├── layout/         # Layout components
│   │   │   └── ui/             # Reusable UI components
│   │   ├── contexts/           # React contexts
│   │   ├── utils/              # Utility functions
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/profile/dashboard` - Dashboard statistics
- `GET /api/profile/profile` - User profile

### Inventory
- `GET /api/profile/inventory` - Get all inventory items
- `POST /api/profile/inventory/add` - Add new inventory item
- `PUT /api/profile/inventory/:id` - Update inventory item
- `DELETE /api/profile/inventory/:id` - Delete inventory item

### Orders
- `GET /api/profile/orders` - Get all orders
- `POST /api/profile/orders/add` - Create new order
- `PUT /api/profile/orders/:id` - Update order
- `DELETE /api/profile/orders/:id` - Delete order

### Suppliers
- `GET /api/profile/suppliers` - Get all suppliers
- `POST /api/profile/suppliers/add` - Add new supplier
- `PUT /api/profile/suppliers/:id` - Update supplier
- `DELETE /api/profile/suppliers/:id` - Delete supplier

## 🎨 UI Components

### Core Components
- **Dashboard** - Real-time overview with statistics and quick actions
- **Inventory List** - Searchable inventory with stock levels and alerts
- **Order Management** - Order processing with status tracking
- **Supplier Directory** - Supplier information and performance metrics
- **Add Forms** - Modal forms for creating new records
- **Theme Toggle** - Dark/light mode switcher

### Form Components
- **AddInventoryForm** - Complete inventory item creation
- **AddOrderForm** - Order creation with conditional fields
- **AddSupplierForm** - Supplier information form

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **CORS Configuration** - Proper cross-origin request handling
- **Input Validation** - Server-side validation for all inputs
- **Error Handling** - Comprehensive error handling and logging

## 🌟 Key Features Walkthrough

### Dashboard Quick Actions
The dashboard provides one-click access to:
- Add new inventory items
- Create orders (inbound/outbound)
- Add suppliers
- View warehouse status

### Inventory Management
- **Stock Tracking** - Real-time inventory levels
- **Reorder Management** - Automatic reorder point alerts
- **Batch & Expiry** - Track batch numbers and expiration dates
- **Multi-location** - Support for multiple warehouse locations

### Order Processing
- **Order Types** - Inbound, outbound, and transfer orders
- **Status Tracking** - Complete order lifecycle management
- **Customer/Supplier** - Conditional forms based on order type
- **Financial Tracking** - Tax, shipping, and discount calculations

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/warehouse_db
JWT_SECRET=your-jwt-secret-key
PORT=3000
```

**Frontend (.env)**
```env
VITE_BACKEND_URI=http://localhost:3000/api
```

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for beautiful icons
- PostgreSQL for the robust database system

## 📞 Support

For support, email itsramky234@gmail.com

---

**Built with ❤️ by Ram Krishna**
