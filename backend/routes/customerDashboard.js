const express = require('express');
const router = express.Router();
const {
  getServicesDashboard,
  getEcommerceDashboard,
  joinZoomMeeting,
  updateCustomerProfile
} = require('../controllers/customerDashboardController');
const { protectCustomer } = require('../middleware/customerAuth');

// All routes require customer authentication
router.use(protectCustomer);

router.get('/services', getServicesDashboard);
router.get('/ecommerce', getEcommerceDashboard);
router.get('/appointments/:id/join-zoom', joinZoomMeeting);
router.put('/profile', updateCustomerProfile);

module.exports = router;
