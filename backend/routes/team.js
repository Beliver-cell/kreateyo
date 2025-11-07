const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getTeam,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  sendInvitation,
  acceptInvitation,
  declineInvitation
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkRole } = require('../middleware/teamAuth');

// Team management routes
router.get('/', protect, checkTeamMember, getTeam);

router.post('/members', 
  protect, 
  checkTeamMember, 
  checkRole('owner', 'admin'), 
  addTeamMember
);

router.put('/members/:memberId', 
  protect, 
  checkTeamMember, 
  checkRole('owner', 'admin'), 
  updateTeamMember
);

router.delete('/members/:memberId', 
  protect, 
  checkTeamMember, 
  checkRole('owner', 'admin'), 
  removeTeamMember
);

// Invitation routes
router.post('/invitations', 
  protect, 
  checkTeamMember, 
  checkRole('owner', 'admin'), 
  sendInvitation
);

// Public invitation routes (no auth required initially)
router.post('/invitations/accept', protect, acceptInvitation);
router.post('/invitations/decline', declineInvitation);

module.exports = router;
