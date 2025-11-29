import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, Copy, Users, DollarSign, TrendingUp, 
  Wallet, CreditCard, CheckCircle, Clock, AlertCircle,
  Share2, Link as LinkIcon, ArrowRight, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReferralStats {
  totalInvited: number;
  signedUp: number;
  converted: number;
  totalCommission: number;
  pendingPayout: number;
  paidOut: number;
}

interface Referral {
  id: string;
  referred_email: string;
  status: string;
  commission_amount: number;
  created_at: string;
  converted_at: string | null;
}

interface PayoutAccount {
  id: string;
  account_type: string;
  account_name: string;
  account_number: string;
  bank_name: string | null;
  is_verified: boolean;
}

export default function CustomerReferral() {
  const { toast } = useToast();
  const { customer } = useCustomerAuth();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState<ReferralStats>({
    totalInvited: 0,
    signedUp: 0,
    converted: 0,
    totalCommission: 0,
    pendingPayout: 0,
    paidOut: 0
  });
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [payoutAccount, setPayoutAccount] = useState<PayoutAccount | null>(null);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [accountForm, setAccountForm] = useState({
    account_type: 'bank',
    account_name: '',
    account_number: '',
    bank_name: ''
  });

  // Generate referral code based on customer ID
  useEffect(() => {
    if (customer?.id) {
      const code = `REF-${customer.id.slice(0, 8).toUpperCase()}`;
      setReferralCode(code);
    }
  }, [customer]);

  // Fetch referral data
  useEffect(() => {
    fetchReferralData();
  }, [customer]);

  const fetchReferralData = async () => {
    if (!customer?.id) return;
    
    setLoading(true);
    try {
      // Fetch referrals - using mock data for now since we're using external backend
      // In production, this would fetch from your API
      setStats({
        totalInvited: 12,
        signedUp: 8,
        converted: 5,
        totalCommission: 250,
        pendingPayout: 100,
        paidOut: 150
      });
      
      setReferrals([
        { id: '1', referred_email: 'john@example.com', status: 'converted', commission_amount: 50, created_at: '2024-01-15', converted_at: '2024-01-20' },
        { id: '2', referred_email: 'jane@example.com', status: 'signed_up', commission_amount: 0, created_at: '2024-01-18', converted_at: null },
        { id: '3', referred_email: 'bob@example.com', status: 'pending', commission_amount: 0, created_at: '2024-01-22', converted_at: null },
      ]);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const shareReferral = async () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join and earn rewards!',
          text: 'Sign up using my referral link and we both get rewards!',
          url: link,
        });
      } catch (err) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  const handleWithdraw = async () => {
    if (!payoutAccount) {
      toast({
        title: "No Payout Account",
        description: "Please add a payout account first.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    if (amount > stats.pendingPayout) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough pending commission.",
        variant: "destructive",
      });
      return;
    }

    setWithdrawing(true);
    try {
      // Simulate withdrawal request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal of $${amount} is being processed.`,
      });
      setShowPayoutDialog(false);
      setWithdrawAmount('');
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingPayout: prev.pendingPayout - amount
      }));
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setWithdrawing(false);
    }
  };

  const handleSaveAccount = async () => {
    if (!accountForm.account_name || !accountForm.account_number) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPayoutAccount({
        id: '1',
        account_type: accountForm.account_type,
        account_name: accountForm.account_name,
        account_number: accountForm.account_number,
        bank_name: accountForm.bank_name,
        is_verified: false
      });
      
      toast({
        title: "Account Added",
        description: "Your payout account has been saved.",
      });
      setShowAccountDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Converted</Badge>;
      case 'signed_up':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Signed Up</Badge>;
      case 'paid':
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Paid</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Gift className="h-7 w-7 text-primary" />
            Referral Program
          </h1>
          <p className="text-muted-foreground mt-1">
            Invite friends and earn commissions on their purchases
          </p>
        </div>
      </div>

      {/* Referral Link Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Your Referral Link</h3>
              <div className="flex items-center gap-2 bg-background/80 rounded-lg p-3 border">
                <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <code className="text-sm truncate flex-1">
                  {window.location.origin}/signup?ref={referralCode}
                </code>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyReferralLink} variant="outline" className="flex-1 sm:flex-none">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button onClick={shareReferral} className="flex-1 sm:flex-none">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Invited</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.totalInvited}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Conversions</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.converted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Earned</p>
                <p className="text-xl sm:text-2xl font-bold">${stats.totalCommission}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-orange-500/10 rounded-lg">
                <Wallet className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Available</p>
                <p className="text-xl sm:text-2xl font-bold">${stats.pendingPayout}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="referrals" className="flex-1 sm:flex-none">Referrals</TabsTrigger>
          <TabsTrigger value="payouts" className="flex-1 sm:flex-none">Payouts</TabsTrigger>
          <TabsTrigger value="account" className="flex-1 sm:flex-none">Payout Account</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>Track the status of people you've referred</CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No referrals yet. Share your link to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {referrals.map((referral) => (
                    <div 
                      key={referral.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card gap-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{referral.referred_email}</p>
                        <p className="text-sm text-muted-foreground">
                          Invited on {new Date(referral.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {referral.commission_amount > 0 && (
                          <span className="text-green-600 font-semibold">
                            +${referral.commission_amount}
                          </span>
                        )}
                        {getStatusBadge(referral.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>View your withdrawal history</CardDescription>
              </div>
              <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
                <DialogTrigger asChild>
                  <Button disabled={stats.pendingPayout <= 0}>
                    <Wallet className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Withdrawal</DialogTitle>
                    <DialogDescription>
                      Available balance: ${stats.pendingPayout}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Amount to Withdraw</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="0.00"
                          className="pl-7"
                          max={stats.pendingPayout}
                        />
                      </div>
                    </div>
                    {!payoutAccount && (
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-sm text-yellow-600">
                          Please add a payout account before withdrawing.
                        </p>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPayoutDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleWithdraw} disabled={withdrawing || !payoutAccount}>
                      {withdrawing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Request Withdrawal'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No payouts yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payout Account</CardTitle>
                <CardDescription>Where you'll receive your earnings</CardDescription>
              </div>
              <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
                <DialogTrigger asChild>
                  <Button variant={payoutAccount ? 'outline' : 'default'}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {payoutAccount ? 'Update Account' : 'Add Account'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{payoutAccount ? 'Update' : 'Add'} Payout Account</DialogTitle>
                    <DialogDescription>
                      Enter your account details to receive payouts
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <Select
                        value={accountForm.account_type}
                        onValueChange={(v) => setAccountForm(prev => ({ ...prev, account_type: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Account</SelectItem>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Account Name</Label>
                      <Input
                        value={accountForm.account_name}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, account_name: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number / Email</Label>
                      <Input
                        value={accountForm.account_number}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, account_number: e.target.value }))}
                        placeholder={accountForm.account_type === 'paypal' ? 'email@example.com' : '1234567890'}
                      />
                    </div>
                    {accountForm.account_type === 'bank' && (
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                          value={accountForm.bank_name}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, bank_name: e.target.value }))}
                          placeholder="First Bank"
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAccountDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAccount}>
                      Save Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {payoutAccount ? (
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">{payoutAccount.account_type.replace('_', ' ')}</span>
                        {payoutAccount.is_verified ? (
                          <Badge className="bg-green-500/10 text-green-600">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending Verification</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{payoutAccount.account_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ****{payoutAccount.account_number.slice(-4)}
                      </p>
                      {payoutAccount.bank_name && (
                        <p className="text-sm text-muted-foreground">{payoutAccount.bank_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No payout account added yet</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => setShowAccountDialog(true)}
                  >
                    Add your account <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}