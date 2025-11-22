const passport = require('passport');
const { generateTokenPair } = require('../middleware/auth');
const User = require('../models/User');

// Initiate Google OAuth
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
});

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  try {
    // User is attached by passport strategy
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    // Generate token pair
    const { accessToken, refreshToken } = generateTokenPair(req.user._id);

    // Store refresh token
    req.user.refreshToken = refreshToken;
    await req.user.save();

    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`);
  }
};
