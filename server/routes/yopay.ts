import { Router } from 'express';
import { db } from '../db';
import { yopayAccounts, yopayOnboardingSessions, yopayTransactions } from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';

export const yopayRoute = Router();

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
}

interface Bank {
  code: string;
  name: string;
}

const nigerianBanks: Bank[] = [
  { code: '044', name: 'Access Bank' },
  { code: '023', name: 'Citibank Nigeria' },
  { code: '063', name: 'Diamond Bank' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '084', name: 'Enterprise Bank' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '030', name: 'Heritage Bank' },
  { code: '301', name: 'Jaiz Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '526', name: 'Parallex Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '101', name: 'Providus Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '068', name: 'Standard Chartered Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '100', name: 'Suntrust Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
];

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'business_verification',
    title: 'Business Information',
    description: 'Verify your business details',
    required: true,
    completed: false,
  },
  {
    id: 'bvn_verification',
    title: 'BVN Verification',
    description: 'Verify your Bank Verification Number',
    required: true,
    completed: false,
  },
  {
    id: 'bank_account',
    title: 'Bank Account',
    description: 'Add your settlement bank account',
    required: true,
    completed: false,
  },
  {
    id: 'kyc_verification',
    title: 'KYC Verification',
    description: 'Complete identity verification',
    required: true,
    completed: false,
  },
];

yopayRoute.get('/:businessId/account', async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        error: 'Business ID is required',
      });
    }

    const [account] = await db
      .select()
      .from(yopayAccounts)
      .where(eq(yopayAccounts.businessId, businessId))
      .limit(1);

    if (account) {
      return res.json({
        success: true,
        data: {
          hasAccount: true,
          status: account.status,
          createdAt: account.createdAt.toISOString(),
        },
      });
    }

    return res.json({
      success: true,
      data: {
        hasAccount: false,
      },
    });
  } catch (error) {
    console.error('Error checking Yopay account:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check Yopay account status',
    });
  }
});

yopayRoute.post('/:businessId/onboarding/start', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { country } = req.body;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        error: 'Business ID is required',
      });
    }

    const existingAccount = await db
      .select()
      .from(yopayAccounts)
      .where(eq(yopayAccounts.businessId, businessId))
      .limit(1);

    if (existingAccount.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Yopay account already exists for this business',
      });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [session] = await db
      .insert(yopayOnboardingSessions)
      .values({
        businessId,
        currentStep: 'business_verification',
        progress: 0,
        stepsCompleted: [],
        formData: { country: country || 'NG' },
        country: country || 'NG',
        expiresAt,
      })
      .returning();

    return res.json({
      success: true,
      data: {
        sessionId: session.id,
        steps: onboardingSteps.map(step => ({
          ...step,
          completed: false,
        })),
        currentStep: 'business_verification',
        progress: 0,
      },
    });
  } catch (error) {
    console.error('Error starting onboarding:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to start onboarding session',
    });
  }
});

yopayRoute.post('/onboarding/:sessionId/step', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { stepId, answers } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required',
      });
    }

    const [session] = await db
      .select()
      .from(yopayOnboardingSessions)
      .where(eq(yopayOnboardingSessions.id, sessionId))
      .limit(1);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Onboarding session not found or expired',
      });
    }

    if (session.expiresAt && new Date() > session.expiresAt) {
      await db.delete(yopayOnboardingSessions).where(eq(yopayOnboardingSessions.id, sessionId));
      return res.status(404).json({
        success: false,
        error: 'Onboarding session has expired',
      });
    }

    if (!stepId) {
      return res.status(400).json({
        success: false,
        error: 'Step ID is required',
      });
    }

    if (stepId === 'business_verification') {
      if (!answers?.business_name || !answers?.business_email) {
        return res.status(400).json({
          success: false,
          error: 'Business name and email are required',
        });
      }
    } else if (stepId === 'bvn_verification') {
      if (!answers?.bvn || answers.bvn.length !== 11) {
        return res.status(400).json({
          success: false,
          error: 'Valid 11-digit BVN is required',
        });
      }
    } else if (stepId === 'bank_account') {
      if (!answers?.bank_code || !answers?.account_number) {
        return res.status(400).json({
          success: false,
          error: 'Bank and account number are required',
        });
      }
    } else if (stepId === 'kyc_verification') {
      if (!answers?.id_type || !answers?.id_number) {
        return res.status(400).json({
          success: false,
          error: 'ID type and number are required',
        });
      }
    }

    const completedSteps = (session.stepsCompleted as string[]) || [];
    if (!completedSteps.includes(stepId)) {
      completedSteps.push(stepId);
    }

    const existingFormData = (session.formData as Record<string, any>) || {};
    const updatedFormData: Record<string, any> = { ...existingFormData, [stepId]: answers };

    const stepOrder = ['business_verification', 'bvn_verification', 'bank_account', 'kyc_verification'];
    const currentIndex = stepOrder.indexOf(stepId);
    const nextIndex = currentIndex + 1;
    const progress = Math.round(((currentIndex + 1) / stepOrder.length) * 100);

    if (nextIndex >= stepOrder.length) {
      const businessVerificationData = updatedFormData['business_verification'] || {};
      const bvnData = updatedFormData['bvn_verification'] || {};
      const bankData = updatedFormData['bank_account'] || {};
      const kycData = updatedFormData['kyc_verification'] || {};

      const bank = nigerianBanks.find(b => b.code === bankData.bank_code);

      await db.insert(yopayAccounts).values({
        businessId: session.businessId,
        businessName: businessVerificationData.business_name,
        businessEmail: businessVerificationData.business_email,
        contactName: businessVerificationData.contact_name,
        businessPhone: businessVerificationData.business_phone,
        bvn: bvnData.bvn,
        bankCode: bankData.bank_code,
        bankName: bank?.name || null,
        accountNumber: bankData.account_number,
        accountName: bankData.account_name,
        idType: kycData.id_type,
        idNumber: kycData.id_number,
        status: 'active',
        kycVerified: true,
      });

      await db.delete(yopayOnboardingSessions).where(eq(yopayOnboardingSessions.id, sessionId));

      return res.json({
        success: true,
        data: {
          completed: true,
          progress: 100,
          message: 'Yopay account activated successfully',
        },
      });
    }

    const nextStep = stepOrder[nextIndex];
    await db
      .update(yopayOnboardingSessions)
      .set({
        currentStep: nextStep,
        progress,
        stepsCompleted: completedSteps,
        formData: updatedFormData,
        updatedAt: new Date(),
      })
      .where(eq(yopayOnboardingSessions.id, sessionId));

    return res.json({
      success: true,
      data: {
        completed: false,
        currentStep: nextStep,
        progress,
        steps: onboardingSteps.map(step => ({
          ...step,
          completed: completedSteps.includes(step.id),
        })),
      },
    });
  } catch (error) {
    console.error('Error processing onboarding step:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process onboarding step',
    });
  }
});

yopayRoute.get('/banks', async (req, res) => {
  try {
    const { country } = req.query;

    if (country && country !== 'NG') {
      return res.json({
        success: true,
        data: [],
        message: 'Only Nigerian banks are currently supported',
      });
    }

    return res.json({
      success: true,
      data: nigerianBanks,
    });
  } catch (error) {
    console.error('Error fetching banks:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bank list',
    });
  }
});

export const yopayDashboardRoute = Router();

yopayDashboardRoute.get('/:businessId/yopay/dashboard', async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        error: 'Business ID is required',
      });
    }

    const [account] = await db
      .select()
      .from(yopayAccounts)
      .where(eq(yopayAccounts.businessId, businessId))
      .limit(1);

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Yopay account not found. Please complete onboarding first.',
      });
    }

    const transactions = await db
      .select()
      .from(yopayTransactions)
      .where(eq(yopayTransactions.businessId, businessId))
      .orderBy(desc(yopayTransactions.createdAt))
      .limit(50);

    const successfulTransactions = transactions.filter(t => t.status === 'successful');
    
    const totalRevenue = successfulTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount || '0'),
      0
    );
    const totalPlatformFees = successfulTransactions.reduce(
      (sum, t) => sum + parseFloat(t.platformFee || '0'),
      0
    );
    const totalFlutterwaveFees = successfulTransactions.reduce(
      (sum, t) => sum + parseFloat(t.flutterwaveFee || '0'),
      0
    );
    const netRevenue = successfulTransactions.reduce(
      (sum, t) => sum + parseFloat(t.netAmount || '0'),
      0
    );
    const successRate = transactions.length > 0
      ? Math.round((successfulTransactions.length / transactions.length) * 100)
      : 0;

    const recentTransactions = transactions.slice(0, 10).map(t => ({
      _id: t.id,
      description: t.description || 'Transaction',
      customerEmail: t.customerEmail || '',
      amount: parseFloat(t.amount || '0'),
      status: t.status as 'successful' | 'pending' | 'failed',
      fees: {
        platform: parseFloat(t.platformFee || '0'),
        flutterwave: parseFloat(t.flutterwaveFee || '0'),
      },
      netAmount: parseFloat(t.netAmount || '0'),
      createdAt: t.createdAt.toISOString(),
    }));

    return res.json({
      success: true,
      data: {
        revenue: {
          total: totalRevenue.toLocaleString(),
          platformFees: totalPlatformFees.toLocaleString(),
          flutterwaveFees: totalFlutterwaveFees.toLocaleString(),
          net: netRevenue.toLocaleString(),
        },
        analytics: {
          successRate: successRate.toString(),
          totalTransactions: transactions.length,
          successfulTransactions: successfulTransactions.length,
        },
        recentTransactions,
      },
    });
  } catch (error) {
    console.error('Error fetching Yopay dashboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
    });
  }
});
