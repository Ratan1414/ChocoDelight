const Order = require('../models/Order');
const Product = require('../models/Product');

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
};

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, discount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    let subtotal = 0;
    const orderItems = [];
    const missingProducts = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        missingProducts.push(item.product);
        continue;
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
      }
      subtotal += product.price * item.quantity;
      orderItems.push({
        product: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    if (missingProducts.length > 0) {
      return res.status(404).json({
        success: false,
        message: `Products not found: ${missingProducts.join(',')}`
      });
    }

    const shippingPrice = subtotal > 500 ? 0 : 50;
    const taxPrice = Math.round(subtotal * 0.18); // 18% GST
    const totalPrice = subtotal + shippingPrice + taxPrice - (discount || 0);

    const orderData = {
      user_id: req.user.id,
      items: orderItems,
      shipping_address: shippingAddress,
      payment_method: paymentMethod || 'COD',
      subtotal,
      shipping_price: shippingPrice,
      discount: discount || 0,
      tax_price: taxPrice,
      total_price: totalPrice,
      coupon_code: couponCode,
      invoice_number: generateInvoiceNumber()
    };

    const order = await Order.create(orderData);

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      await Product.updateById(item.product, { stock: product.stock - item.quantity });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    // Check if order belongs to user or user is admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updateData = { status: req.body.status };
    if (req.body.status === 'Delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const updatedOrder = await Order.updateById(req.params.id, updateData);
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'Processing') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        await Product.updateById(item.product, { stock: product.stock + item.quantity });
      }
    }

    const updatedOrder = await Order.updateById(req.params.id, { status: 'Cancelled' });
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
