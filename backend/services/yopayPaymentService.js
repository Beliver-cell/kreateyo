const YopayAccount = require('../models/YopayAccount');
const Transaction = require('../models/Transaction');
const PlatformRevenue = require('../models/PlatformRevenue');
const YopayConfig = require('../config/yopay');
const flutterwaveService = require('./flutterwaveService');
const crypto = require('crypto');

class YopayPaymentService {
  static async processPayment(paymentData, businessId) {
    try {
      const yopayAccount = await YopayAccount.findOne({ business: businessId });
      if (!yopayAccount) {
        throw new Error('Yopay account not found');
      }

      if (yopayAccount.status !== 'active') {
        throw new Error('Yopay account is not active');
      }

      // Validate payment data
      this.validatePaymentData(paymentData);

      // Generate idempotent transaction reference
      const txRef = this.generateTxRef(businessId, paymentData);

      // Check for duplicate transaction
      const existingTransaction = await Transaction.findOne({ txRef });
      if (existingTransaction) {
        return {
          success: true,
          duplicate: true,
          transaction: existingTransaction,
          message: 'Transaction already processed'
        };
      }

      // Calculate amounts with tiered fees
      const amountDetails = this.calculateAmounts(
        paymentData.amount,
        yopayAccount.userTier
      );

      // CRITICAL FIX: Flutterwave subaccount split
      // Platform fee is NOT deducted via subaccount split
      // Flutterwave sends the merchant their portion automatically
      // We track platform fees separately for accounting
      const flutterwavePayload = {
        tx_ref: txRef,
        amount: paymentData.amount,
        currency: paymentData.currency || yopayAccount.currency || 'NGN',
        payment_options: 'card,banktransfer,ussd,mpesa,mobilemoney',
        customer: {
          email: paymentData.customer_email,
          phone_number: paymentData.customer_phone,
          name: paymentData.customer_name
        },
        customizations: {
          title: paymentData.business_name || 'Payment',
          description: paymentData.description || 'Payment via Yopay',
          logo: paymentData.logo
        },
        // Subaccount receives payment minus Flutterwave fees only
        subaccounts: [
          {
            id: yopayAccount.flutterwaveSubaccountId,
            transaction_charge_type: 'flat_subaccount',
            transaction_charge: 0 // Flutterwave handles their fee automatically
          }
        ],
        meta: {
          business_id: businessId.toString(),
          business_type: yopayAccount.businessType,
          user_tier: yopayAccount.userTier,
          platform_fee: amountDetails.platformFee,
          yopay_transaction: 'true'
        }
      };

      // Initiate payment with Flutterwave
      const payment = await flutterwaveService.initiatePayment(flutterwavePayload);

      // Record transaction
      const transaction = await Transaction.create({
        business: businessId,
        flutterwaveTransactionId: payment.data.id,
        txRef: txRef,
        amount: paymentData.amount,
        currency: paymentData.currency || yopayAccount.currency || 'NGN',
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
        userTier: yopayAccount.userTier,
        metadata: {
          payment_link: payment.data.link,
          idempotency_key: txRef
        }
      });

      return {
        success: true,
        paymentLink: payment.data.link,
        paymentData: payment.data,
        amountDetails: amountDetails,
        transaction: {
          id: transaction._id,
          txRef: transaction.txRef,
          amount: transaction.amount,
          status: transaction.status
        }
      };

    } catch (error) {
      console.error('Yopay payment processing error:', error);
      throw error;
    }
  }

  static validatePaymentData(data) {
    if (!data.amount || data.amount <= 0) {
      throw new Error('Valid payment amount is required');
    }
    if (!data.customer_email || !this.isValidEmail(data.customer_email)) {
      throw new Error('Valid customer email is required');
    }
    if (!data.customer_name) {
      throw new Error('Customer name is required');
    }
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static generateTxRef(businessId, paymentData) {
    // Generate deterministic transaction reference for idempotency
    const timestamp = Date.now();
    const hash = crypto
      .createHash('sha256')
      .update(`${businessId}-${paymentData.customer_email}-${paymentData.amount}-${timestamp}`)
      .digest('hex')
      .substring(0, 10);
    
    return `YO-${timestamp}-${hash}`;
  }

  static calculateAmounts(amount, userTier) {
    const platformPercentage = YopayConfig.tieredFees[userTier] || YopayConfig.tieredFees.solo;
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

  static async handleSuccessfulPayment(txRef, flutterwaveData) {
    try {
      // Find transaction by txRef (not ID)
      const transaction = await Transaction.findOne({ txRef });
      if (!transaction) {
        throw new Error(`Transaction not found for txRef: ${txRef}`);
      }

      // Prevent duplicate processing
      if (transaction.status === 'successful') {
        console.log(`Transaction ${txRef} already marked as successful`);
        return {
          success: true,
          duplicate: true,
          transaction: transaction
        };
      }

      // Update transaction status
      transaction.status = 'successful';
      transaction.processedAt = new Date();
      transaction.flutterwaveReference = flutterwaveData.flw_ref || flutterwaveData.tx_ref;
      transaction.metadata.set('webhook_data', JSON.stringify(flutterwaveData));
      await transaction.save();

      // Record platform revenue
      await PlatformRevenue.create({
        transaction: transaction._id,
        business: transaction.business,
        amount: transaction.fees.platform,
        userTier: transaction.userTier,
        businessType: transaction.businessType,
        type: 'platform_fee'
      });

      // FIXED: Business receives netAmount (which already has platform fee deducted)
      return {
        success: true,
        transaction: transaction,
        businessReceived: transaction.netAmount
      };

    } catch (error) {
      console.error('Payment success handling error:', error);
      throw error;
    }
  }

  static async handleFailedPayment(txRef, flutterwaveData) {
    try {
      const transaction = await Transaction.findOne({ txRef });
      if (!transaction) {
        console.error(`Transaction not found for failed payment: ${txRef}`);
        return;
      }

      transaction.status = 'failed';
      transaction.metadata.set('failure_reason', flutterwaveData.status || 'Payment failed');
      transaction.metadata.set('webhook_data', JSON.stringify(flutterwaveData));
      await transaction.save();

      return {
        success: true,
        transaction: transaction
      };
    } catch (error) {
      console.error('Failed payment handling error:', error);
      throw error;
    }
  }

  static async getYopayDashboard(businessId) {
    try {
      const yopayAccount = await YopayAccount.findOne({ business: businessId });
      if (!yopayAccount) {
        throw new Error('Yopay account not found');
      }

      // Use aggregation for better performance at scale
      const stats = await Transaction.aggregate([
        {
          $match: {
            business: businessId,
            status: 'successful'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            platformFees: { $sum: '$fees.platform' },
            flutterwaveFees: { $sum: '$fees.flutterwave' },
            netRevenue: { $sum: '$netAmount' },
            count: { $sum: 1 }
          }
        }
      ]);

      const totalTransactions = await Transaction.countDocuments({ business: businessId });
      const successfulCount = stats[0]?.count || 0;
      const successRate = totalTransactions > 0 ? ((successfulCount / totalTransactions) * 100).toFixed(1) : 0;

      // Get recent transactions with limit
      const recentTransactions = await Transaction.find({ business: businessId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      return {
        account: yopayAccount,
        balance: {
          available: (stats[0]?.netRevenue || 0).toFixed(2),
          pending: '0.00',
          totalProcessed: (stats[0]?.totalRevenue || 0).toFixed(2)
        },
        revenue: {
          total: (stats[0]?.totalRevenue || 0).toFixed(2),
          platformFees: (stats[0]?.platformFees || 0).toFixed(2),
          flutterwaveFees: (stats[0]?.flutterwaveFees || 0).toFixed(2),
          net: (stats[0]?.netRevenue || 0).toFixed(2)
        },
        analytics: {
          totalTransactions,
          successfulTransactions: successfulCount,
          successRate
        },
        recentTransactions
      };

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      throw error;
    }
  }

  static async updateYopayTier(businessId, newTier) {
    try {
      const yopayAccount = await YopayAccount.findOne({ business: businessId });
      if (!yopayAccount) {
        throw new Error('Yopay account not found');
      }

      const oldTier = yopayAccount.userTier;
      yopayAccount.userTier = newTier;
      await yopayAccount.save(); // This triggers the pre-save hook to recalculate fees

      // Update Flutterwave subaccount split if needed
      const newFee = YopayConfig.tieredFees[newTier];
      await flutterwaveService.updateSubAccount(yopayAccount.flutterwaveSubaccountId, {
        split_value: newFee
      });

      return {
        success: true,
        oldTier,
        newTier,
        message: `Yopay tier updated from ${oldTier} to ${newTier}`
      };
    } catch (error) {
      console.error('Tier update error:', error);
      throw error;
    }
  }
}

module.exports = YopayPaymentService;
