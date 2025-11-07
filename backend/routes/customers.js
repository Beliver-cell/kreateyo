const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkPermission } = require('../middleware/teamAuth');

// All routes are protected
router.use(protect);
router.use(checkTeamMember);

router.route('/')
  .get(getCustomers)
  .post(checkPermission('write'), createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(checkPermission('write'), updateCustomer)
  .delete(checkPermission('delete'), deleteCustomer);

module.exports = router;
