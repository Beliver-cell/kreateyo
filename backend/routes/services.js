const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkPermission } = require('../middleware/teamAuth');

// Public routes
router.get('/', getServices);
router.get('/:id', getService);

// Protected routes
router.post('/', protect, checkTeamMember, checkPermission('write'), createService);
router.put('/:id', protect, checkTeamMember, checkPermission('write'), updateService);
router.delete('/:id', protect, checkTeamMember, checkPermission('delete'), deleteService);

module.exports = router;
