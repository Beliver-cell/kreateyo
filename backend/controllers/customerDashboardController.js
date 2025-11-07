const ServiceCustomer = require('../models/ServiceCustomer');
const EcommerceCustomer = require('../models/EcommerceCustomer');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const { AppError } = require('../middleware/errorHandler');
const zoomService = require('../utils/zoomService');

// @desc    Get services customer dashboard
// @route   GET /customer/dashboard/services
// @access  Private (Customer)
exports.getServicesDashboard = async (req, res, next) => {
  try {
    const serviceCustomer = await ServiceCustomer.findOne({ 
      customer: req.customer._id 
    });

    if (!serviceCustomer) {
      return next(new AppError('Service customer profile not found', 404));
    }

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      customer: req.customer._id,
      startTime: { $gte: new Date() },
      status: { $in: ['scheduled', 'confirmed'] }
    })
    .populate('service', 'name duration price')
    .populate('assignedTo', 'fullName email')
    .sort({ startTime: 1 })
    .limit(10);

    // Get past appointments
    const pastAppointments = await Appointment.find({
      customer: req.customer._id,
      $or: [
        { startTime: { $lt: new Date() } },
        { status: { $in: ['completed', 'cancelled', 'no-show'] } }
      ]
    })
    .populate('service', 'name duration price')
    .sort({ startTime: -1 })
    .limit(10);

    res.status(200).json({
      success: true,
      data: {
        profile: serviceCustomer,
        upcomingAppointments,
        pastAppointments,
        stats: serviceCustomer.stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ecommerce customer dashboard
// @route   GET /customer/dashboard/ecommerce
// @access  Private (Customer)
exports.getEcommerceDashboard = async (req, res, next) => {
  try {
    const ecommerceCustomer = await EcommerceCustomer.findOne({ 
      customer: req.customer._id 
    })
    .populate('cart.product')
    .populate('wishlist');

    if (!ecommerceCustomer) {
      return next(new AppError('Ecommerce customer profile not found', 404));
    }

    // Get recent orders
    const recentOrders = await Order.find({
      customer: req.customer._id
    })
    .populate('items.product')
    .sort({ createdAt: -1 })
    .limit(10);

    res.status(200).json({
      success: true,
      data: {
        cart: ecommerceCustomer.cart,
        wishlist: ecommerceCustomer.wishlist,
        addresses: ecommerceCustomer.addresses,
        recentOrders,
        preferences: ecommerceCustomer.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join Zoom meeting
// @route   GET /customer/appointments/:id/join-zoom
// @access  Private (Customer)
exports.joinZoomMeeting = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      customer: req.customer._id
    }).populate('service');

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    if (!appointment.zoomMeetingId) {
      return next(new AppError('No Zoom meeting for this appointment', 400));
    }

    // Check if appointment is within 15 minutes
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const timeDiff = (appointmentTime - now) / (1000 * 60); // in minutes

    if (timeDiff > 15) {
      return next(new AppError(`Meeting can be joined ${Math.round(timeDiff)} minutes before start time`, 400));
    }

    res.status(200).json({
      success: true,
      data: {
        joinUrl: appointment.zoomJoinUrl,
        password: appointment.zoomPassword,
        meetingId: appointment.zoomMeetingId,
        startTime: appointment.startTime
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer profile
// @route   PUT /customer/profile
// @access  Private (Customer)
exports.updateCustomerProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.customer._id,
      { firstName, lastName, phone, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};
