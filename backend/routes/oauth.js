const express = require('express');
const passport = require('passport');
const { googleCallback, googleAuth } = require('../controllers/oauthController');

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

module.exports = router;
