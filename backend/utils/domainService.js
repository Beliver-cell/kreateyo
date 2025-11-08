const dns = require('dns').promises;
const Domain = require('../models/Domain');

class DomainService {
  constructor() {
    this.mainDomain = process.env.MAIN_DOMAIN || 'kreateyo.com';
    this.serverIP = process.env.SERVER_IP || '0.0.0.0';
  }

  // Generate subdomain for business
  generateSubdomain(businessName) {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Create default subdomain for business
  async createDefaultDomain(business) {
    const subdomain = this.generateSubdomain(business.name);
    
    const domain = await Domain.create({
      business: business._id,
      subdomain,
      domain: `${subdomain}.${this.mainDomain}`,
      isCustomDomain: false,
      isPrimary: true,
      status: 'active',
      sslStatus: 'issued'
    });

    return domain;
  }

  // Add custom domain
  async addCustomDomain(businessId, customDomain) {
    const domain = await Domain.create({
      business: businessId,
      domain: customDomain.toLowerCase(),
      subdomain: '', // Custom domains don't use subdomain
      isCustomDomain: true,
      isPrimary: false,
      status: 'pending',
      sslStatus: 'pending',
      dnsRecords: {
        cname: {
          host: 'www',
          value: `${this.mainDomain}.`,
          verified: false
        },
        aRecord: {
          host: '@',
          value: this.serverIP,
          verified: false
        }
      }
    });

    return domain;
  }

  // Verify DNS records
  async verifyDNS(domainId) {
    const domain = await Domain.findById(domainId);
    if (!domain) {
      throw new Error('Domain not found');
    }

    try {
      // Verify A record
      const aRecords = await dns.resolve4(domain.domain);
      const aRecordValid = aRecords.includes(this.serverIP);

      // Verify CNAME record
      let cnameValid = false;
      try {
        const cnameRecords = await dns.resolveCname(`www.${domain.domain}`);
        cnameValid = cnameRecords.some(record => 
          record.includes(this.mainDomain)
        );
      } catch (error) {
        cnameValid = false;
      }

      // Update domain status
      domain.dnsRecords.aRecord.verified = aRecordValid;
      domain.dnsRecords.cname.verified = cnameValid;

      if (aRecordValid && cnameValid) {
        domain.status = 'verified';
        domain.lastVerifiedAt = new Date();
      }

      await domain.save();

      return {
        verified: aRecordValid && cnameValid,
        aRecord: aRecordValid,
        cname: cnameValid
      };
    } catch (error) {
      console.error('DNS verification error:', error);
      return {
        verified: false,
        error: error.message
      };
    }
  }

  // Get domain by subdomain or custom domain
  async getDomainByHost(host) {
    // Remove port if present
    const hostname = host.split(':')[0];
    
    // Check if it's a custom domain
    let domain = await Domain.findOne({
      domain: hostname,
      isCustomDomain: true,
      status: 'active'
    }).populate('business');

    if (domain) {
      return domain;
    }

    // Check if it's a subdomain
    const subdomain = hostname.split('.')[0];
    domain = await Domain.findOne({
      subdomain,
      isCustomDomain: false
    }).populate('business');

    return domain;
  }

  // Set primary domain
  async setPrimaryDomain(businessId, domainId) {
    // Remove primary flag from all domains
    await Domain.updateMany(
      { business: businessId },
      { isPrimary: false }
    );

    // Set new primary domain
    const domain = await Domain.findByIdAndUpdate(
      domainId,
      { isPrimary: true },
      { new: true }
    );

    return domain;
  }
}

module.exports = new DomainService();
