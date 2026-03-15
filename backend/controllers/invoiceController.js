const Order = require('../models/Order');
const path = require('path');
const fs = require('fs');

exports.getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Generate HTML invoice
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #8B4513; padding-bottom: 20px; margin-bottom: 30px; }
          .company-name { font-size: 28px; color: #8B4513; font-weight: bold; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-details div { flex: 1; }
          .invoice-details h3 { margin-bottom: 10px; color: #8B4513; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f8f8; color: #8B4513; }
          .total-section { text-align: right; margin-top: 20px; }
          .total-row { display: flex; justify-content: flex-end; margin-bottom: 10px; }
          .total-label { width: 150px; text-align: right; margin-right: 20px; }
          .total-value { width: 100px; text-align: right; font-weight: bold; }
          .grand-total { border-top: 2px solid #8B4513; padding-top: 10px; font-size: 18px; color: #8B4513; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">🍫 ChocoDelight</div>
          <p>Premium Chocolate Experience</p>
        </div>

        <div class="invoice-details">
          <div>
            <h3>Bill To:</h3>
            <p><strong>${order.shippingAddress.fullName}</strong></p>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            <p>Phone: ${order.shippingAddress.phone}</p>
          </div>
          <div>
            <h3>Invoice Details:</h3>
            <p><strong>Invoice Number:</strong> ${order.invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.price * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span class="total-label">Subtotal:</span>
            <span class="total-value">₹${order.subtotal}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Shipping:</span>
            <span class="total-value">₹${order.shippingPrice}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Tax (GST 18%):</span>
            <span class="total-value">₹${order.taxPrice}</span>
          </div>
          ${order.discount > 0 ? `
            <div class="total-row">
              <span class="total-label">Discount:</span>
              <span class="total-value">-₹${order.discount}</span>
            </div>
          ` : ''}
          <div class="total-row grand-total">
            <span class="total-label">Total:</span>
            <span class="total-value">₹${order.totalPrice}</span>
          </div>
        </div>

        <div style="margin-top: 50px; text-align: center; color: #666;">
          <p>Thank you for choosing ChocoDelight!</p>
          <p>For any queries, contact us at support@chocodelight.com</p>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${order.invoiceNumber}.html"`);
    res.send(invoiceHTML);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};