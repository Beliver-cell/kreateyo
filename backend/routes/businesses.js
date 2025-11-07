const express = require('express');
const { body } = require('express-validator');
const {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness
} = require('../controllers/businessController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { checkTeamMember, checkRole } = require('../middleware/teamAuth');

const router = express.Router();

// Validation rules
const businessValidation = [
  body('name').trim().notEmpty().withMessage('Business name is required'),
  body('type').isIn(['blogging', 'ecommerce', 'services']).withMessage('Invalid business type'),
  body('accountType').optional().isIn(['solo', 'team']).withMessage('Invalid account type')
];

// Routes
router.use(protect); // All routes require authentication

router.route('/')
  .get(getBusinesses)
  .post(businessValidation, validate, createBusiness);

router.route('/:id')
  .get(checkTeamMember, getBusiness)
  .put(checkTeamMember, checkRole('owner', 'admin'), updateBusiness)
  .delete(deleteBusiness); // Only owner can delete

module.exports = router;
