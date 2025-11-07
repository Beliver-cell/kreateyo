const Customer = require('../models/Customer');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all customers for a business
// @route   GET /api/businesses/:businessId/customers
// @access  Private
exports.getCustomers = async (req, res, next) => {
  try {
    const { status, limit = 20, page = 1, search } = req.query;
    const query = { business: req.params.businessId };

    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Customer.countDocuments(query);

    res.status(200).json({
      success: true,
      data: customers,
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

// @desc    Get single customer
// @route   GET /api/businesses/:businessId/customers/:id
// @access  Private
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create customer
// @route   POST /api/businesses/:businessId/customers
// @access  Private
exports.createCustomer = async (req, res, next) => {
  try {
    req.body.business = req.params.businessId;

    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/businesses/:businessId/customers/:id
// @access  Private
exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/businesses/:businessId/customers/:id
// @access  Private
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
