const express = require('express');
const router = express.Router();
const { getInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

router.get('/:id', protect, getInvoice);

module.exports = router;