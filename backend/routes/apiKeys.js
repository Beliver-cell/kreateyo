const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey
} = require('../controllers/apiKeyController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkRole } = require('../middleware/teamAuth');

// All routes require authentication and admin/owner role
router.use(protect);
router.use(checkTeamMember);
router.use(checkRole('owner', 'admin'));

router.route('/')
  .get(getApiKeys)
  .post(createApiKey);

router.route('/:id')
  .put(updateApiKey)
  .delete(deleteApiKey);

module.exports = router;
