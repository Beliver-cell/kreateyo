const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkPermission } = require('../middleware/teamAuth');

// All routes are protected
router.use(protect);
router.use(checkTeamMember);

router.route('/')
  .get(getAppointments)
  .post(checkPermission('write'), createAppointment);

router.route('/:id')
  .get(getAppointment)
  .put(checkPermission('write'), updateAppointment)
  .delete(checkPermission('delete'), deleteAppointment);

router.patch('/:id/status', checkPermission('write'), updateAppointmentStatus);

module.exports = router;
