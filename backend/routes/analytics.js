const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAnalytics,
  getAnalyticsSummary,
  recordAnalytics,
  getRevenue
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { checkTeamMember } = require('../middleware/teamAuth');

// All routes are protected
router.use(protect);
router.use(checkTeamMember);

router.get('/', getAnalytics);
router.get('/summary', getAnalyticsSummary);
router.get('/revenue', getRevenue);
router.post('/', recordAnalytics);

module.exports = router;
