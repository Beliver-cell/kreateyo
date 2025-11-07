const Analytics = require('../models/Analytics');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get analytics for a business
// @route   GET /api/businesses/:businessId/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { business: req.params.businessId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const analytics = await Analytics.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics summary
// @route   GET /api/businesses/:businessId/analytics/summary
// @access  Private
exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    const businessId = req.params.businessId;
    const { period = '30' } = req.query; // days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get orders data
    const orders = await Order.find({
      business: businessId,
      createdAt: { $gte: startDate }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;

    // Get appointments data
    const appointments = await Appointment.find({
      business: businessId,
      createdAt: { $gte: startDate }
    });

    // Get customers data
    const newCustomers = await Customer.countDocuments({
      business: businessId,
      createdAt: { $gte: startDate }
    });

    const totalCustomers = await Customer.countDocuments({
      business: businessId
    });

    // Calculate growth rates
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(period));

    const previousOrders = await Order.find({
      business: businessId,
      createdAt: { $gte: previousStartDate, $lt: startDate }
    });

    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(2)
      : 0;

    const ordersGrowth = previousOrders.length > 0
      ? ((totalOrders - previousOrders.length) / previousOrders.length * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        revenue: {
          current: totalRevenue,
          previous: previousRevenue,
          growth: parseFloat(revenueGrowth)
        },
        orders: {
          current: totalOrders,
          previous: previousOrders.length,
          growth: parseFloat(ordersGrowth)
        },
        appointments: {
          total: appointments.length,
          scheduled: appointments.filter(a => a.status === 'scheduled').length,
          completed: appointments.filter(a => a.status === 'completed').length,
          cancelled: appointments.filter(a => a.status === 'cancelled').length
        },
        customers: {
          total: totalCustomers,
          new: newCustomers
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record analytics data
// @route   POST /api/businesses/:businessId/analytics
// @access  Private
exports.recordAnalytics = async (req, res, next) => {
  try {
    req.body.business = req.params.businessId;
    
    // Check if analytics for this date already exists
    const existingAnalytics = await Analytics.findOne({
      business: req.params.businessId,
      date: req.body.date
    });

    let analytics;
    if (existingAnalytics) {
      // Update existing analytics
      analytics = await Analytics.findByIdAndUpdate(
        existingAnalytics._id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new analytics
      analytics = await Analytics.create(req.body);
    }

    res.status(201).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue by period
// @route   GET /api/businesses/:businessId/analytics/revenue
// @access  Private
exports.getRevenue = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query; // day, week, month, year
    const businessId = req.params.businessId;

    const analytics = await Analytics.aggregate([
      {
        $match: { business: businessId }
      },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: period === 'day' ? '%Y-%m-%d' : '%Y-%m',
              date: '$date' 
            }
          },
          revenue: { $sum: '$metrics.revenue' },
          orders: { $sum: '$metrics.orders' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};
