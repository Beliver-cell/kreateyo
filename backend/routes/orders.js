const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkPermission } = require('../middleware/teamAuth');

// All routes are protected
router.use(protect);
router.use(checkTeamMember);

router.route('/')
  .get(getOrders)
  .post(checkPermission('write'), createOrder);

router.route('/:id')
  .get(getOrder)
  .put(checkPermission('write'), updateOrder)
  .delete(checkPermission('delete'), deleteOrder);

router.patch('/:id/status', checkPermission('write'), updateOrderStatus);

module.exports = router;
