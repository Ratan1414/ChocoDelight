# 🍫 ChocoDelight - Premium Chocolate Ecommerce Platform

A full-featured, premium chocolate ecommerce website built with React, Node.js, Express, and MongoDB. Features a beautiful, modern UI with comprehensive admin dashboard and customer-facing store.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd perplexity
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   Create `.env` file in backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/chocodelight
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d
   COOKIE_SECRET=your_cookie_secret_here
   PORT=5000
   ```

5. **Seed Database**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:5000
   - **Admin Panel:** http://localhost:5173/admin

## 🔐 Default Admin Credentials

- **Email:** admin@chocodelight.com
- **Password:** admin123

## 📋 Features

### 🌐 Customer Website Features

#### **User Authentication & Account Management**
- User registration and login
- JWT-based authentication with secure cookies
- Password hashing with bcrypt
- Profile management
- Account blocking/unblocking (admin controlled)

#### **Product Catalog**
- Premium chocolate products across multiple categories:
  - Dark Chocolate
  - Milk Chocolate
  - White Chocolate
  - Gourmet Collections
  - Gift Boxes
  - Seasonal Specials
- Advanced product filtering and search
- Product ratings and reviews
- Featured and best-seller products
- Stock management
- Product tags and categorization

#### **Shopping Experience**
- Intuitive product browsing with categories
- Advanced search and filtering (price, rating, category)
- Product quick view modal
- Wishlist functionality
- Shopping cart with persistent storage
- Cart slide-out drawer
- Secure checkout process
- Multiple payment methods (Cash on Delivery)
- Order tracking and history
- Coupon code system

#### **Premium UI/UX**
- Modern, responsive design
- Smooth animations and transitions
- Loading skeletons for better UX
- Mobile-first responsive design
- Premium chocolate brand aesthetics
- Interactive hover effects
- Sticky navigation with mega menu
- Instagram-style gallery in footer
- Newsletter subscription

#### **Additional Features**
- Product reviews and ratings
- Related products suggestions
- Order status notifications
- Email notifications (framework ready)
- Social media integration
- SEO-friendly URLs
- Fast loading with optimized images

### 🛠️ Admin Dashboard Features

#### **Dashboard Overview**
- Real-time statistics and metrics
- Revenue tracking and analytics
- Order status overview
- User activity monitoring
- Recent orders display
- Quick action buttons

#### **Analytics & Insights**
- Interactive charts and graphs
- Sales analytics by period
- Product performance metrics
- User demographics
- Revenue trends
- Category-wise sales analysis
- Order status distribution

#### **Product Management**
- Complete CRUD operations for products
- Bulk product operations
- Image upload and management
- Stock level monitoring
- Featured/best-seller toggles
- Category management
- Product search and filtering
- Price management with discounts

#### **Order Management**
- View all customer orders
- Order status updates (Processing → Confirmed → Shipped → Delivered)
- Order cancellation with stock restoration
- Order search and filtering
- Customer order history
- Order details with item breakdown
- Shipping address management

#### **User Management**
- View all registered users
- User search and filtering
- Block/unblock user accounts
- Delete user accounts
- User role management
- User activity tracking
- Profile information display

#### **Coupon Management**
- Create and manage discount coupons
- Percentage and fixed amount discounts
- Minimum purchase requirements
- Maximum discount limits
- Expiration date management
- Coupon usage tracking
- Bulk coupon operations

#### **Security & Access Control**
- Role-based access control (Admin/User)
- Protected admin routes
- Secure authentication
- Session management
- Admin activity logging

## 🔧 Admin Management Guide

### Changing Admin Credentials

#### **Method 1: Update Existing Admin (Recommended)**
1. Start the backend server
2. Connect to MongoDB
3. Run this command in MongoDB shell or MongoDB Compass:
   ```javascript
   db.users.updateOne(
     { email: "admin@chocodelight.com" },
     {
       $set: {
         name: "Your Admin Name",
         email: "newadmin@example.com",
         password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fMJyO6QK" // bcrypt hash for 'newpassword123'
       }
     }
   )
   ```

#### **Method 2: Create New Admin via Code**
1. Create a new file `create-admin.js` in backend directory:
   ```javascript
   const mongoose = require('mongoose');
   const User = require('./models/User');
   require('dotenv').config();

   const createAdmin = async () => {
     try {
       await mongoose.connect(process.env.MONGO_URI);
       const admin = new User({
         name: 'New Admin',
         email: 'newadmin@example.com',
         password: 'newpassword123',
         role: 'admin'
       });
       await admin.save();
       console.log('Admin created successfully!');
       process.exit(0);
     } catch (error) {
       console.error('Error:', error);
       process.exit(1);
     }
   };

   createAdmin();
   ```

2. Run the script:
   ```bash
   cd backend
   node create-admin.js
   ```

#### **Method 3: Update via Admin Panel (Future Enhancement)**
- Admin profile management feature can be added to allow password changes through the UI

### Adding Multiple Admins

#### **Method 1: Database Direct Insertion**
```javascript
// Run in MongoDB shell
db.users.insertMany([
  {
    name: "Admin Two",
    email: "admin2@chocodelight.com",
    password: "$2a$12$encrypted_password_hash", // Use bcrypt hash
    role: "admin",
    isBlocked: false,
    createdAt: new Date()
  },
  {
    name: "Admin Three",
    email: "admin3@chocodelight.com",
    password: "$2a$12$encrypted_password_hash", // Use bcrypt hash
    role: "admin",
    isBlocked: false,
    createdAt: new Date()
  }
]);
```

#### **Method 2: Using Seed Script**
Modify `backend/seed.js` to add multiple admins:
```javascript
// Add this before the existing admin creation
const admins = [
  {
    name: 'Primary Admin',
    email: 'admin@chocodelight.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Secondary Admin',
    email: 'admin2@chocodelight.com',
    password: 'admin456',
    role: 'admin'
  }
];

for (const adminData of admins) {
  const adminExists = await User.findOne({ email: adminData.email });
  if (!adminExists) {
    await User.create(adminData);
    console.log(`  ✓ Admin user created: ${adminData.email}`);
  }
}
```

#### **Method 3: API Endpoint (Recommended for Production)**
Create an admin-only endpoint to create new admins:
```javascript
// Add to backend/routes/admin.js
router.post('/users/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });
    res.status(201).json({ success: true, admin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

## 🏗️ Project Structure

```
perplexity/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Coupon.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── coupons.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   └── reviews.js
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── AdminAnalytics.jsx
│   │   │   ├── AdminCoupons.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── components/
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── pages/
│   │   │   ├── AccountPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
└── README.md
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Hot Toast** - Notification system
- **React Icons** - Icon library

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password
- `GET /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get categories

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Reviews
- `POST /api/reviews/:productId` - Create review
- `GET /api/reviews/:productId` - Get product reviews

### Coupons
- `POST /api/coupons/validate` - Validate coupon

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/users` - All users
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/block` - Block/unblock user
- `GET /api/admin/products` - All products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/cancel` - Cancel order
- `GET /api/admin/coupons` - All coupons
- `POST /api/admin/coupons` - Create coupon
- `PUT /api/admin/coupons/:id` - Update coupon
- `DELETE /api/admin/coupons/:id` - Delete coupon

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (framework ready)
- CORS configuration
- Role-based access control
- Secure admin routes

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chocodelight
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRE=7d
COOKIE_SECRET=your_cookie_secret
PORT=5000
```

### Build Commands
```bash
# Frontend build
cd frontend
npm run build

# Backend production start
cd backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please contact the development team.

---

**🍫 Enjoy your premium chocolate shopping experience!**
#   C h o c o D e l i g h t  
 