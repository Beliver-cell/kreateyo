const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost
} = require('../controllers/blogPostController');
const { protect } = require('../middleware/auth');
const { checkTeamMember, checkPermission } = require('../middleware/teamAuth');
const { limiter } = require('../middleware/rateLimit');

// Public routes
router.get('/', getBlogPosts);
router.get('/:id', getBlogPost);
router.post('/:id/like', limiter, likeBlogPost);

// Protected routes
router.post('/', protect, checkTeamMember, checkPermission('write'), createBlogPost);
router.put('/:id', protect, checkTeamMember, checkPermission('write'), updateBlogPost);
router.delete('/:id', protect, checkTeamMember, checkPermission('delete'), deleteBlogPost);

module.exports = router;
