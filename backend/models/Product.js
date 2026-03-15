const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [8, 'Price cannot exceed 8 digits']
  },
  originalPrice: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    required: [true, 'Please enter product category'],
    enum: [
      'Dark Chocolate',
      'Milk Chocolate',
      'Caramel Candy',
      'Hazelnut Chocolate',
      'Fruit Chocolate',
      'Chocolate Bars',
      'Chocolate Gift Boxes'
    ]
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    default: 1
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
