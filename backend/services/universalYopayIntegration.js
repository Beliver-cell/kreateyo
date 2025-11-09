const YopayConfig = require('../config/yopay');

class UniversalYopayIntegration {
  static async injectYopayPayments(website, yopayAccount) {
    const paymentConfig = {
      provider: 'yopay',
      public_key: process.env.FLUTTERWAVE_PUBLIC_KEY,
      business_id: yopayAccount.business.toString(),
      business_type: yopayAccount.businessType,
      user_tier: yopayAccount.userTier,
      subaccount_id: yopayAccount.flutterwaveSubaccountId,
      fees: {
        platform: yopayAccount.fees.platformPercentage,
        flutterwave: yopayAccount.fees.flutterwavePercentage,
        total: yopayAccount.fees.totalFeePercentage
      }
    };

    const yopayScript = this.generateUniversalScript(paymentConfig, yopayAccount.businessType, website);
    
    return yopayScript;
  }

  static generateUniversalScript(paymentConfig, businessType, website) {
    const bloggingMethods = this.getBloggingMethods(businessType);
    const ecommerceMethods = this.getEcommerceMethods(businessType);
    const servicesMethods = this.getServicesMethods(businessType);

    return `
<!-- Yopay Universal Payment Integration -->
<script src="https://checkout.flutterwave.com/v3.js"></script>
<script>
  window.Yopay = {
    config: ${JSON.stringify(paymentConfig)},
    
    // Universal payment method
    pay: function(options) {
      const config = {
        public_key: this.config.public_key,
        tx_ref: 'YO-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        amount: options.amount,
        currency: options.currency || 'NGN',
        payment_options: 'card, banktransfer, ussd, mobile_money',
        customer: {
          email: options.customer_email,
          phone_number: options.customer_phone,
          name: options.customer_name
        },
        customizations: {
          title: options.business_name || '${website.name || 'Yopay Payment'}',
          description: options.description || 'Payment via Yopay',
          logo: options.logo
        },
        subaccounts: [
          {
            id: this.config.subaccount_id,
            transaction_charge_type: 'flat',
            transaction_charge: this.calculateFlutterwaveFee(options.amount)
          }
        ],
        meta: {
          business_id: this.config.business_id,
          business_type: this.config.business_type,
          user_tier: this.config.user_tier
        },
        callback: options.callback || function(response) {
          console.log('Payment successful:', response);
        },
        onclose: options.onclose || function() {
          console.log('Payment modal closed');
        }
      };
      
      FlutterwaveCheckout(config);
    },
    
    calculateFlutterwaveFee: function(amount) {
      return Math.round(amount * ${paymentConfig.fees.flutterwave} / 100 * 100) / 100;
    },
    
    calculatePlatformFee: function(amount) {
      return Math.round(amount * ${paymentConfig.fees.platform} / 100 * 100) / 100;
    },
    
    calculateTotalFee: function(amount) {
      return this.calculateFlutterwaveFee(amount) + this.calculatePlatformFee(amount);
    },
    
    calculateNetAmount: function(amount) {
      return amount - this.calculateTotalFee(amount);
    }
    
    ${bloggingMethods}
    ${ecommerceMethods}
    ${servicesMethods}
  };
</script>
    `;
  }

  static getBloggingMethods(businessType) {
    if (businessType !== 'blogging') return '';
    
    return `,
    // Blogging payment methods
    payForArticle: function(article, customer) {
      return this.pay({
        amount: article.price,
        description: 'Premium Article: ' + article.title,
        customer_email: customer.email,
        customer_name: customer.name
      });
    },
    
    payForSubscription: function(plan, customer) {
      return this.pay({
        amount: plan.price,
        description: plan.name + ' Subscription',
        customer_email: customer.email,
        customer_name: customer.name
      });
    },
    
    acceptDonation: function(amount, customer) {
      return this.pay({
        amount: amount,
        description: 'Donation',
        customer_email: customer.email,
        customer_name: customer.name
      });
    }`;
  }

  static getEcommerceMethods(businessType) {
    if (businessType !== 'ecommerce') return '';
    
    return `,
    // E-commerce payment methods
    payForProduct: function(product, customer) {
      return this.pay({
        amount: product.price,
        description: product.name,
        customer_email: customer.email,
        customer_name: customer.name,
        customer_phone: customer.phone
      });
    },
    
    payForCart: function(cart, customer) {
      const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return this.pay({
        amount: total,
        description: cart.items.length + ' items',
        customer_email: customer.email,
        customer_name: customer.name,
        customer_phone: customer.phone
      });
    }`;
  }

  static getServicesMethods(businessType) {
    if (businessType !== 'services') return '';
    
    return `,
    // Services payment methods
    payForService: function(service, booking, customer) {
      return this.pay({
        amount: service.price,
        description: service.name + ' - ' + booking.date,
        customer_email: customer.email,
        customer_name: customer.name,
        customer_phone: customer.phone
      });
    },
    
    payDeposit: function(service, amount, customer) {
      return this.pay({
        amount: amount,
        description: 'Deposit for ' + service.name,
        customer_email: customer.email,
        customer_name: customer.name,
        customer_phone: customer.phone
      });
    }`;
  }
}

module.exports = UniversalYopayIntegration;
