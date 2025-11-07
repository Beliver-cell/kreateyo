const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getDomains,
  addDomain,
  verifyDomain,
  setPrimaryDomain,
  deleteDomain
} = require('../controllers/domainController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkRole } = require('../middleware/teamAuth');

// All routes require authentication
router.use(protect);
router.use(checkTeamMember);

router.route('/')
  .get(getDomains)
  .post(checkRole('owner', 'admin'), addDomain);

router.post('/:id/verify', verifyDomain);
router.patch('/:id/primary', checkRole('owner', 'admin'), setPrimaryDomain);
router.delete('/:id', checkRole('owner', 'admin'), deleteDomain);

module.exports = router;
