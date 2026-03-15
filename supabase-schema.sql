-- Create tables for ChocoDelight

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  google_id VARCHAR(255),
  avatar TEXT,
  role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_blocked BOOLEAN DEFAULT FALSE,
  reset_password_token VARCHAR(255),
  reset_password_expire TIMESTAMP,
  wishlist JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(50) NOT NULL,
  image TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  stock INTEGER DEFAULT 1,
  rating DECIMAL(3,1) DEFAULT 0,
  num_reviews INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  best_seller BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method VARCHAR(10) DEFAULT 'COD',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_price DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  tax_price DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  coupon_code VARCHAR(50),
  invoice_number VARCHAR(50) UNIQUE,
  status VARCHAR(20) DEFAULT 'Processing',
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >=1 AND rating <=5),
  title VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT TRUE,
  helpful JSONB DEFAULT '[]',
  reported BOOLEAN DEFAULT FALSE,
  admin_response JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(order_id, product_id)
);

-- Coupons table
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount DECIMAL(5,2) NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security) if needed
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- etc.

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);