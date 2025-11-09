const YopayAccount = require('../models/YopayAccount');
const Transaction = require('../models/Transaction');
const PlatformRevenue = require('../models/PlatformRevenue');
const YopayConfig = require('../config/yopay');
const axios = require('axios');

class YopayPaymentService {
  static async processPayment(paymentData, businessId) {
    try {
      const yopayAccount = await YopayAccount.findOne({ business: businessId });
      if (!yopayAccount) {
        throw new Error('Yopay account not found');
      }

      // Calculate amounts with tiered fees
      const amountDetails = this.calculateAmounts(
        paymentData.amount,
        yopayAccount.userTier
      );

      // Create Flutterwave payment with subaccount split
      const flutterwavePayload = {
        tx_ref: `YO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: paymentData.amount,
        currency: paymentData.currency || 'NGN',
        payment_options: 'card, banktransfer, ussd, mobile_money',
        customer: {
          email: paymentData.customer_email,
          phone_number: paymentData.customer_phone,
          name: paymentData.customer_name
        },
        customizations: {
          title: paymentData.business_name || 'Payment via Yopay',
          description: paymentData.description,
          logo: paymentData.logo
        },
        subaccounts: [
          {
            id: yopayAccount.flutterwaveSubaccountId,
            transaction_charge_type: 'flat',
            transaction_charge: amountDetails.flutterwaveFee
          }
        ],
        meta: {
          business_id: businessId,
          business_type: yopayAccount.businessType,
          user_tier: yopayAccount.userTier,
          platform_fee: amountDetails.platformFee,
          flutterwave_fee: amountDetails.flutterwaveFee
        }
      };

      const payment = await this.initiateFlutterwavePayment(flutterwavePayload);

      // Record transaction with fee breakdown
      const transaction = await Transaction.create({
        business: businessId,
        flutterwaveTransactionId: payment.data.id,
        amount: paymentData.amount,
        currency: paymentData.currency || 'NGN',
        customerEmail: paymentData.customer_email,
        customerName: paymentData.customer_name,
        customerPhone: paymentData.customer_phone,
        description: paymentData.description,
        fees: {
          platform: amountDetails.platformFee,
          flutterwave: amountDetails.flutterwaveFee,
          total: amountDetails.totalFee
        },
        netAmount: amountDetails.netAmount,
        status: 'pending',
        businessType: yopayAccount.businessType,
        userTier: yopayAccount.userTier
      });

      return {
        success: true,
        paymentData: payment.data,
        amountDetails: amountDetails,
        transaction: transaction
      };

    } catch (error) {
      console.error('Yopay payment processing error:', error);
      throw error;
    }
  }

  static calculateAmounts(amount, userTier) {
    const platformPercentage = YopayConfig.tieredFees[userTier];
    const flutterwavePercentage = YopayConfig.flutterwaveFees.transaction;

    const flutterwaveFee = (amount * flutterwavePercentage) / 100;
    const platformFee = (amount * platformPercentage) / 100;
    const totalFee = flutterwaveFee + platformFee;
    const netAmount = amount - totalFee;

    return {
      originalAmount: amount,
      flutterwaveFee: Math.round(flutterwaveFee * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
      totalFee: Math.round(totalFee * 100) / 100,
      netAmount: Math.round(netAmount * 100) / 100,
      platformPercentage: platformPercentage,
      flutterwavePercentage: flutterwavePercentage
    };
  }

  static async handleSuccessfulPayment(transactionId, flutterwaveData) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Update transaction status
      transaction.status = 'successful';
      transaction.processedAt = new Date();
      transaction.flutterwaveReference = flutterwaveData.tx_ref;
      await transaction.save();

      // Record platform revenue
      await PlatformRevenue.create({
        transaction: transactionId,
        business: transaction.business,
        amount: transaction.fees.platform,
        userTier: transaction.userTier,
        businessType: transaction.businessType,
        type: 'platform_fee'
      });

      return {
        success: true,
        transaction: transaction,
        businessReceived: transaction.netAmount - transaction.fees.platform
      };

    } catch (error) {
      console.error('Payment success handling error:', error);
      throw error;
    }
  }

  static async initiateFlutterwavePayment(payload) {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  static async getYopayDashboard(businessId) {
    try {
      const yopayAccount = await YopayAccount.findOne({ business: businessId });
      if (!yopayAccount) {
        throw new Error('Yopay account not found');
      }

      // Get transaction statistics
      const transactions = await Transaction.find({ business: businessId });
      
      const totalRevenue = transactions.reduce((sum, t) => t.status === 'successful' ? sum + t.amount : sum, 0);
      const platformFees = transactions.reduce((sum, t) => t.status === 'successful' ? sum + t.fees.platform : sum, 0);
      const flutterwaveFees = transactions.reduce((sum, t) => t.status === 'successful' ? sum + t.fees.flutterwave : sum, 0);
      const netRevenue = totalRevenue - platformFees - flutterwaveFees;
      
      const successfulTransactions = transactions.filter(t => t.status === 'successful').length;
      const totalTransactions = transactions.length;
      const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions * 100).toFixed(1) : 0;

      return {
        account: yopayAccount,
        revenue: {
          total: totalRevenue.toFixed(2),
          platformFees: platformFees.toFixed(2),
          flutterwaveFees: flutterwaveFees.toFixed(2),
          net: netRevenue.toFixed(2)
        },
        analytics: {
          totalTransactions,
          successfulTransactions,
          successRate
        },
        recentTransactions: transactions.slice(-10).reverse()
      };

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      throw error;
    }
  }
}

module.exports = YopayPaymentService;
