import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Printer,
  Download
} from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: any;
}

export function OrderDetailsDialog({ open, onOpenChange, order }: OrderDetailsDialogProps) {
  const [status, setStatus] = useState(order?.status || 'pending');
  const [notes, setNotes] = useState('');

  if (!order) return null;

  const timeline = [
    { label: 'Order Placed', status: 'completed', icon: Package, date: order.date },
    { label: 'Payment Confirmed', status: status !== 'pending' ? 'completed' : 'pending', icon: CreditCard, date: order.date },
    { label: 'Processing', status: ['processing', 'shipped', 'delivered'].includes(status) ? 'completed' : 'pending', icon: Clock, date: '-' },
    { label: 'Shipped', status: ['shipped', 'delivered'].includes(status) ? 'completed' : 'pending', icon: Truck, date: '-' },
    { label: 'Delivered', status: status === 'delivered' ? 'completed' : 'pending', icon: CheckCircle2, date: '-' },
  ];

  const handleStatusUpdate = (newStatus: string) => {
    setStatus(newStatus);
    toast({ 
      title: "Status updated", 
      description: `Order status changed to ${newStatus}` 
    });
  };

  const handlePrint = () => {
    window.print();
    toast({ title: "Printing invoice..." });
  };

  const handleDownload = () => {
    toast({ title: "Downloading invoice...", description: "Invoice PDF will be downloaded" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-8 pt-8 pb-6 border-b bg-muted/30">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold">Order Details</DialogTitle>
              <p className="text-muted-foreground mt-2 text-lg">{order.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="lg" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="lg" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Invoice
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-180px)]">
          <div className="px-8 py-6 space-y-8">
            {/* Order Timeline */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Order Timeline</h3>
              <div className="space-y-4">
                {timeline.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        item.status === 'completed' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        {item.status === 'completed' && (
                          <p className="text-sm text-green-600 dark:text-green-400">Completed</p>
                        )}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className={`absolute left-[2.375rem] mt-16 h-8 w-0.5 ${
                          item.status === 'completed' ? 'bg-green-600' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">john@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">+1 234-567-8901</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">Shipping Address</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-muted-foreground">123 Business St</p>
                    <p className="text-muted-foreground">New York, NY 10001</p>
                    <p className="text-muted-foreground">United States</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Items */}
            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">Order Items</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold">Premium Wireless Headphones</p>
                    <p className="text-sm text-muted-foreground">SKU: PROD-001</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$299.99</p>
                    <p className="text-sm text-muted-foreground">Qty: 1</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${order.total}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${order.total}</span>
                </div>
              </div>
            </Card>

            {/* Update Status */}
            <Card className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">Update Order Status</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Order Status</Label>
                  <Select value={status} onValueChange={handleStatusUpdate}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Order Notes</Label>
                  <Textarea
                    placeholder="Add internal notes about this order..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-24 resize-none"
                  />
                </div>

                <Button className="w-full h-12" onClick={() => toast({ title: "Notes saved" })}>
                  Save Notes
                </Button>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
