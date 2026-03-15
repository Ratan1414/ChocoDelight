require('dotenv').config();
const supabase = require('./config/db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .insert([{
        name: 'Admin User',
        email: 'admin@chocodelight.com',
        password: hashedPassword,
        role: 'admin'
      }])
      .select()
      .single();

    if (adminError && !adminError.message.includes('duplicate')) {
      throw adminError;
    }

    console.log('✓ Admin user created');

    // Create sample products
    const products = [
      {
        name: 'Belgian Dark Truffle',
        description: 'Exquisite Belgian dark truffles handcrafted with 72% single-origin Ghanaian cocoa.',
        price: 599,
        category: 'Dark Chocolate',
        image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500',
        images: ['https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500'],
        stock: 120,
        rating: 4.8,
        num_reviews: 234,
        featured: true,
        best_seller: true,
        tags: ['premium', 'truffle', 'belgian']
      },
      {
        name: 'Milk Chocolate Delight',
        description: 'Smooth and creamy milk chocolate made with the finest ingredients.',
        price: 299,
        category: 'Milk Chocolate',
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500',
        stock: 100,
        rating: 4.5,
        num_reviews: 150,
        featured: false,
        best_seller: true,
        tags: ['creamy', 'milk', 'smooth']
      }
    ];

    const { error: productsError } = await supabase
      .from('products')
      .insert(products);

    if (productsError) throw productsError;

    console.log('✓ Sample products created');

    // Create sample coupon
    const { error: couponError } = await supabase
      .from('coupons')
      .insert([{
        code: 'WELCOME10',
        discount: 10,
        min_purchase: 500,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }]);

    if (couponError && !couponError.message.includes('duplicate')) {
      throw couponError;
    }

    console.log('✓ Sample coupon created');
    console.log('🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

seedDatabase();