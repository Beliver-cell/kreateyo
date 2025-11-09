const axios = require('axios');

class FlutterwaveService {
  constructor() {
    this.baseURL = 'https://api.flutterwave.com/v3';
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    this.publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
  }

  getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json'
    };
  }

  async createSubAccount(data) {
    try {
      const response = await axios.post(
        `${this.baseURL}/subaccounts`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Flutterwave subaccount creation error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create subaccount');
    }
  }

  async updateSubAccount(subaccountId, data) {
    try {
      const response = await axios.put(
        `${this.baseURL}/subaccounts/${subaccountId}`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Flutterwave subaccount update error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update subaccount');
    }
  }

  async getSubAccount(subaccountId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/subaccounts/${subaccountId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Flutterwave subaccount fetch error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch subaccount');
    }
  }

  async initiatePayment(payload) {
    try {
      const response = await axios.post(
        `${this.baseURL}/payments`,
        payload,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Flutterwave payment initiation error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to initiate payment');
    }
  }

  async verifyTransaction(transactionId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transactions/${transactionId}/verify`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Flutterwave transaction verification error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to verify transaction');
    }
  }

  async resolveBankAccount(accountNumber, bankCode) {
    try {
      const response = await axios.post(
        `${this.baseURL}/accounts/resolve`,
        {
          account_number: accountNumber,
          account_bank: bankCode
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Bank account resolution error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to resolve bank account');
    }
  }

  async getBanks(country = 'NG') {
    try {
      const response = await axios.get(
        `${this.baseURL}/banks/${country}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Banks fetch error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch banks');
    }
  }

  verifyWebhookSignature(signature, expectedSecret) {
    return signature === expectedSecret;
  }
}

module.exports = new FlutterwaveService();
