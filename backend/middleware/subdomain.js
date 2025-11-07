const domainService = require('../utils/domainService');

// Subdomain middleware
const subdomainHandler = async (req, res, next) => {
  try {
    const host = req.headers.host;
    const mainDomain = process.env.MAIN_DOMAIN || 'nexuscreate.com';
    
    // Skip if it's the main platform (app, www, or localhost)
    const subdomain = host.split('.')[0];
    if (subdomain === 'app' || subdomain === 'www' || host.includes('localhost')) {
      return next();
    }

    // Get business by domain/subdomain
    const domain = await domainService.getDomainByHost(host);
    
    if (!domain) {
      return res.status(404).json({
        success: false,
        error: 'Site not found'
      });
    }

    // Attach business and domain to request
    req.userSite = {
      business: domain.business,
      domain: domain.domain,
      subdomain: domain.subdomain,
      isCustomDomain: domain.isCustomDomain
    };

    next();
  } catch (error) {
    console.error('Subdomain handler error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = { subdomainHandler };
