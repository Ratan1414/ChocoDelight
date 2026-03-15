const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, rating, page = 1, limit = 12 } = req.query;
    
    const filters = {
      search,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      sort: sort === 'price_low' ? 'price:asc' : 
            sort === 'price_high' ? 'price:desc' : 
            sort === 'rating' ? 'rating:desc' : 
            sort === 'popular' ? 'num_reviews:desc' : 
            sort === 'newest' ? 'created_at:desc' : undefined,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit)
    };

    const { products, total } = await Product.findAll(filters);

    res.status(200).json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const { products } = await Product.findAll({ featured: true, limit: 8 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const { products } = await Product.findAll({ best_seller: true, limit: 8 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const { products } = await Product.findAll({ 
      category: product.category, 
      limit: 4,
      excludeId: req.params.id 
    });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.updateById(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.deleteById(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
