const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all orders for a business
// @route   GET /api/businesses/:businessId/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, limit = 20, page = 1 } = req.query;
    const query = { business: req.params.businessId };

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/businesses/:businessId/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer')
      .populate('items.product');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order
// @route   POST /api/businesses/:businessId/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    req.body.business = req.params.businessId;

    // Generate order number
    const orderCount = await Order.countDocuments({ business: req.params.businessId });
    req.body.orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    // Calculate totals
    let subtotal = 0;
    for (let item of req.body.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new AppError(`Product ${item.product} not found`, 404));
      }
      item.price = product.price;
      item.total = item.price * item.quantity;
      subtotal += item.total;

      // Update inventory
      if (product.inventory.trackInventory) {
        product.inventory.quantity -= item.quantity;
        await product.save();
      }
    }

    req.body.subtotal = subtotal;
    req.body.total = subtotal + req.body.tax + req.body.shipping - req.body.discount;

    const order = await Order.create(req.body);

    // Update customer stats
    await Customer.findByIdAndUpdate(req.body.customer, {
      $inc: { totalOrders: 1, totalSpent: req.body.total },
      lastOrderDate: Date.now()
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/businesses/:businessId/orders/:id
// @access  Private
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/businesses/:businessId/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    order.status = req.body.status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/businesses/:businessId/orders/:id
// @access  Private
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
