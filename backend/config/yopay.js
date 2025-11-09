const YopayConfig = {
  brand: {
    name: 'Yopay',
    slogan: 'Payments by Kreateyo',
    color: {
      primary: '#10B981',
      secondary: '#047857', 
      accent: '#F59E0B'
    }
  },
  
  // TIERED PLATFORM FEES
  tieredFees: {
    solo: 3.5,      // 3.5% for solo users
    team: 2.0,      // 2.0% for team business  
    enterprise: 0.5 // 0.5% for enterprise
  },
  
  // Flutterwave fees (fixed)
  flutterwaveFees: {
    transaction: 1.4,  // 1.4% Flutterwave fee
    currencyConversion: 1.5
  },
  
  supportedCountries: ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ'],
  
  currencies: {
    NG: 'NGN',
    GH: 'GHS',
    KE: 'KES', 
    ZA: 'ZAR',
    UG: 'UGX',
    TZ: 'TZS'
  },
  
  payoutSchedule: {
    default: 'daily',
    options: ['daily', 'weekly', 'monthly']
  }
};

module.exports = YopayConfig;
