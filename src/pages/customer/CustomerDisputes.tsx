import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { 
  Shield, AlertTriangle, Clock, CheckCircle, XCircle,
  FileText, Upload, MessageSquare, DollarSign, Loader2,
  ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Dispute {
  id: string;
  dispute_type: string;
  status: string;
  amount: number;
  refund_amount: number;
  description: string;
  order_id?: string;
  appointment_id?: string;
  created_at: string;
  auto_refund_deadline?: string;
  business_response?: string;
  events: DisputeEvent[];
}

interface DisputeEvent {
  id: string;
  event_type: string;
  actor_type: string;
  description: string;
  created_at: string;
}

export default function CustomerDisputes() {
  const { toast } = useToast();
  const { customer } = useCustomerAuth();
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showNewDispute, setShowNewDispute] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newDispute, setNewDispute] = useState({
    dispute_type: 'delivery',
    amount: '',
    description: '',
    order_id: '',
    evidence_urls: [] as string[]
  });

  useEffect(() => {
    fetchDisputes();
  }, [customer]);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      // Mock data - in production this would fetch from API
      setDisputes([
        {
          id: '1',
          dispute_type: 'delivery',
          status: 'pending_business',
          amount: 150,
          refund_amount: 0,
          description: 'Order not delivered after 2 weeks',
          order_id: 'ORD-12345',
          created_at: '2024-01-20',
          auto_refund_deadline: '2024-01-23',
          events: [
            { id: '1', event_type: 'created', actor_type: 'customer', description: 'Dispute opened', created_at: '2024-01-20' },
            { id: '2', event_type: 'awaiting_response', actor_type: 'system', description: 'Waiting for business response', created_at: '2024-01-20' },
          ]
        },
        {
          id: '2',
          dispute_type: 'quality',
          status: 'resolved',
          amount: 75,
          refund_amount: 75,
          description: 'Product arrived damaged',
          order_id: 'ORD-12344',
          created_at: '2024-01-15',
          business_response: 'We apologize for the inconvenience. Full refund processed.',
          events: [
            { id: '1', event_type: 'created', actor_type: 'customer', description: 'Dispute opened', created_at: '2024-01-15' },
            { id: '2', event_type: 'response', actor_type: 'business', description: 'Business agreed to refund', created_at: '2024-01-16' },
            { id: '3', event_type: 'resolved', actor_type: 'system', description: 'Refund of $75 processed', created_at: '2024-01-16' },
          ]
        },
      ]);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDispute = async () => {
    if (!newDispute.description || !newDispute.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dispute: Dispute = {
        id: Date.now().toString(),
        dispute_type: newDispute.dispute_type,
        status: 'open',
        amount: parseFloat(newDispute.amount),
        refund_amount: 0,
        description: newDispute.description,
        order_id: newDispute.order_id || undefined,
        created_at: new Date().toISOString(),
        auto_refund_deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        events: [
          { id: '1', event_type: 'created', actor_type: 'customer', description: 'Dispute opened', created_at: new Date().toISOString() },
        ]
      };

      setDisputes(prev => [dispute, ...prev]);
      setShowNewDispute(false);
      setNewDispute({
        dispute_type: 'delivery',
        amount: '',
        description: '',
        order_id: '',
        evidence_urls: []
      });
      
      toast({
        title: "Dispute Submitted",
        description: "The business has 72 hours to respond.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit dispute. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'refunded':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Resolved</Badge>;
      case 'pending_business':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Awaiting Response</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Under Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
      case 'auto_refunded':
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Auto-Refunded</Badge>;
      default:
        return <Badge variant="secondary">Open</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return <Clock className="h-4 w-4" />;
      case 'quality':
        return <AlertTriangle className="h-4 w-4" />;
      case 'fraud':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const calculateTimeRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h remaining`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
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
            <Shield className="h-7 w-7 text-primary" />
            Disputes & Protection
          </h1>
          <p className="text-muted-foreground mt-1">
            Get help with orders or services that didn't meet expectations
          </p>
        </div>
        
        <Dialog open={showNewDispute} onOpenChange={setShowNewDispute}>
          <DialogTrigger asChild>
            <Button>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Open Dispute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Open a Dispute</DialogTitle>
              <DialogDescription>
                Describe your issue. The business has 72 hours to respond or a refund will be automatically processed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Issue Type</Label>
                <Select
                  value={newDispute.dispute_type}
                  onValueChange={(v) => setNewDispute(prev => ({ ...prev, dispute_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">Delivery Issue</SelectItem>
                    <SelectItem value="service">Service Not Rendered</SelectItem>
                    <SelectItem value="quality">Quality Problem</SelectItem>
                    <SelectItem value="fraud">Potential Fraud</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Order/Booking ID (if applicable)</Label>
                <Input
                  value={newDispute.order_id}
                  onChange={(e) => setNewDispute(prev => ({ ...prev, order_id: e.target.value }))}
                  placeholder="e.g., ORD-12345"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Disputed Amount ($)</Label>
                <Input
                  type="number"
                  value={newDispute.amount}
                  onChange={(e) => setNewDispute(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Describe the Issue</Label>
                <Textarea
                  value={newDispute.description}
                  onChange={(e) => setNewDispute(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Explain what happened..."
                  rows={4}
                />
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-600">
                    <p className="font-medium">Auto-Protection Enabled</p>
                    <p className="text-blue-600/80">If the business doesn't respond within 72 hours, you'll automatically receive a refund.</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewDispute(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitDispute} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Dispute'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Protection Info */}
      <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">You're Protected</h3>
              <p className="text-muted-foreground mt-1">
                All transactions on KreateYo are protected. If a business fails to deliver or provide the service you paid for, 
                you can open a dispute and get a full refund.
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>72-hour response window</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-green-600" />
                  <span>Auto-refund if ignored</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <span>Mediation support</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disputes List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Disputes</CardTitle>
          <CardDescription>Track the status of your open and resolved disputes</CardDescription>
        </CardHeader>
        <CardContent>
          {disputes.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No disputes yet</p>
              <p className="text-sm text-muted-foreground mt-1">If you have any issues, you can open a dispute above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className={cn(
                    "p-4 rounded-lg border bg-card cursor-pointer hover:bg-accent/50 transition-colors",
                    selectedDispute?.id === dispute.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedDispute(selectedDispute?.id === dispute.id ? null : dispute)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {getTypeIcon(dispute.dispute_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium capitalize">{dispute.dispute_type} Issue</span>
                          {getStatusBadge(dispute.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                          {dispute.description}
                        </p>
                        {dispute.order_id && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Order: {dispute.order_id}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${dispute.amount}</p>
                        {dispute.auto_refund_deadline && dispute.status === 'pending_business' && (
                          <p className="text-xs text-orange-600">
                            {calculateTimeRemaining(dispute.auto_refund_deadline)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        selectedDispute?.id === dispute.id && "rotate-90"
                      )} />
                    </div>
                  </div>
                  
                  {/* Expanded Timeline */}
                  {selectedDispute?.id === dispute.id && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-3">Timeline</h4>
                      <div className="space-y-3">
                        {dispute.events.map((event, index) => (
                          <div key={event.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                index === 0 ? "bg-primary" : "bg-muted-foreground/50"
                              )} />
                              {index < dispute.events.length - 1 && (
                                <div className="w-px h-full bg-border flex-1" />
                              )}
                            </div>
                            <div className="pb-3">
                              <p className="text-sm font-medium">{event.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.created_at).toLocaleString()} • {event.actor_type}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {dispute.business_response && (
                        <div className="mt-4 p-3 rounded-lg bg-muted">
                          <p className="text-sm font-medium mb-1">Business Response:</p>
                          <p className="text-sm text-muted-foreground">{dispute.business_response}</p>
                        </div>
                      )}
                      
                      {dispute.refund_amount > 0 && (
                        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              Refund of ${dispute.refund_amount} processed
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}