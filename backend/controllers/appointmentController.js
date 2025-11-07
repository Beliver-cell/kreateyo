const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all appointments for a business
// @route   GET /api/businesses/:businessId/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, startDate, endDate, limit = 50, page = 1 } = req.query;
    const query = { business: req.params.businessId };

    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .populate('service', 'name duration price')
      .populate('customer', 'firstName lastName email phone')
      .populate('assignedTo', 'name email')
      .sort({ startTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: appointments,
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

// @desc    Get single appointment
// @route   GET /api/businesses/:businessId/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('service')
      .populate('customer')
      .populate('assignedTo', 'name email');

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create appointment
// @route   POST /api/businesses/:businessId/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    req.body.business = req.params.businessId;

    // Get service to calculate end time
    const service = await Service.findById(req.body.service);
    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    // Calculate end time based on service duration
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(startTime);
    
    if (service.duration.unit === 'minutes') {
      endTime.setMinutes(endTime.getMinutes() + service.duration.value);
    } else if (service.duration.unit === 'hours') {
      endTime.setHours(endTime.getHours() + service.duration.value);
    } else if (service.duration.unit === 'days') {
      endTime.setDate(endTime.getDate() + service.duration.value);
    }

    req.body.endTime = endTime;

    // Update service bookings count
    service.bookingsCount += 1;
    await service.save();

    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment
// @route   PUT /api/businesses/:businessId/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PATCH /api/businesses/:businessId/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    appointment.status = req.body.status;
    
    if (req.body.status === 'cancelled' && req.body.cancellationReason) {
      appointment.cancellationReason = req.body.cancellationReason;
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/businesses/:businessId/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
