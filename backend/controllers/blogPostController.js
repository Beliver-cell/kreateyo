const BlogPost = require('../models/BlogPost');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all blog posts for a business
// @route   GET /api/businesses/:businessId/blog-posts
// @access  Public
exports.getBlogPosts = async (req, res, next) => {
  try {
    const { status, category, limit = 10, page = 1 } = req.query;
    const query = { business: req.params.businessId };

    if (status) query.status = status;
    if (category) query.categories = category;

    const blogPosts = await BlogPost.find(query)
      .populate('author', 'name email')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await BlogPost.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post
// @route   GET /api/businesses/:businessId/blog-posts/:id
// @access  Public
exports.getBlogPost = async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id)
      .populate('author', 'name email');

    if (!blogPost) {
      return next(new AppError('Blog post not found', 404));
    }

    // Increment views
    blogPost.views += 1;
    await blogPost.save();

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog post
// @route   POST /api/businesses/:businessId/blog-posts
// @access  Private
exports.createBlogPost = async (req, res, next) => {
  try {
    req.body.business = req.params.businessId;
    req.body.author = req.user._id;

    // Generate slug from title
    if (!req.body.slug) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const blogPost = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/businesses/:businessId/blog-posts/:id
// @access  Private
exports.updateBlogPost = async (req, res, next) => {
  try {
    let blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return next(new AppError('Blog post not found', 404));
    }

    // Update slug if title changed
    if (req.body.title && req.body.title !== blogPost.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Set publishedAt when status changes to published
    if (req.body.status === 'published' && blogPost.status !== 'published') {
      req.body.publishedAt = Date.now();
    }

    blogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/businesses/:businessId/blog-posts/:id
// @access  Private
exports.deleteBlogPost = async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return next(new AppError('Blog post not found', 404));
    }

    await blogPost.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like blog post
// @route   POST /api/businesses/:businessId/blog-posts/:id/like
// @access  Public
exports.likeBlogPost = async (req, res, next) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return next(new AppError('Blog post not found', 404));
    }

    blogPost.likes += 1;
    await blogPost.save();

    res.status(200).json({
      success: true,
      data: { likes: blogPost.likes }
    });
  } catch (error) {
    next(error);
  }
};
