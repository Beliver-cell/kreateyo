const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const BlogPost = require('../models/BlogPost');
const Product = require('../models/Product');
const Service = require('../models/Service');

/**
 * User Site Routes - Serve business sites on subdomains
 * Accessed via: {subdomain}.kreateyo.com
 */

// Get business site data by subdomain
router.get('/site-data', async (req, res) => {
  try {
    const subdomain = req.headers['x-subdomain'];
    
    if (!subdomain) {
      return res.status(400).json({
        success: false,
        error: 'Subdomain not provided'
      });
    }

    // Find business by subdomain
    const domain = await Domain.findOne({ 
      subdomain: subdomain,
      isCustomDomain: false,
      status: 'active'
    }).populate('business');

    if (!domain || !domain.business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }

    const business = domain.business;

    // Get business-specific data based on type
    let siteData = {
      business: {
        name: business.name,
        type: business.businessType,
        description: business.description,
        logo: business.logo,
        theme: business.theme
      }
    };

    // Load content based on business type
    switch (business.businessType) {
      case 'blogging':
        const posts = await BlogPost.find({ 
          business: business._id,
          status: 'published' 
        }).sort({ publishedAt: -1 }).limit(10);
        siteData.posts = posts;
        break;

      case 'ecommerce':
        const products = await Product.find({ 
          business: business._id,
          status: 'active' 
        }).sort({ createdAt: -1 });
        siteData.products = products;
        break;

      case 'services':
        const services = await Service.find({ 
          business: business._id,
          status: 'active' 
        });
        siteData.services = services;
        break;
    }

    res.json({
      success: true,
      data: siteData
    });

  } catch (error) {
    console.error('Site data fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load site data'
    });
  }
});

// Get single blog post (for blogging sites)
router.get('/posts/:slug', async (req, res) => {
  try {
    const subdomain = req.headers['x-subdomain'];
    const { slug } = req.params;

    const domain = await Domain.findOne({ 
      subdomain: subdomain 
    }).populate('business');

    if (!domain) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const post = await BlogPost.findOne({
      business: domain.business._id,
      slug: slug,
      status: 'published'
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Post fetch error:', error);
    res.status(500).json({ error: 'Failed to load post' });
  }
});

// Get single product (for ecommerce sites)
router.get('/products/:id', async (req, res) => {
  try {
    const subdomain = req.headers['x-subdomain'];
    const { id } = req.params;

    const domain = await Domain.findOne({ 
      subdomain: subdomain 
    }).populate('business');

    if (!domain) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const product = await Product.findOne({
      _id: id,
      business: domain.business._id,
      status: 'active'
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

module.exports = router;
