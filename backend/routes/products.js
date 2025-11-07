const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkPermission } = require('../middleware/teamAuth');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', protect, checkTeamMember, checkPermission('write'), createProduct);
router.put('/:id', protect, checkTeamMember, checkPermission('write'), updateProduct);
router.patch('/:id/inventory', protect, checkTeamMember, checkPermission('write'), updateInventory);
router.delete('/:id', protect, checkTeamMember, checkPermission('delete'), deleteProduct);

module.exports = router;
