import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: any;
}

export function CustomerDialog({ open, onOpenChange, customer }: CustomerDialogProps) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          <AutoSaveIndicator status={saveStatus} />
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" defaultValue={customer?.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" defaultValue={customer?.email} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+1 234-567-8900" defaultValue={customer?.phone} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="City, State" defaultValue={customer?.location} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="123 Main Street" />
            </div>

            <div className="space-y-2">
              <Label>Customer Group</Label>
              <Input placeholder="VIP, Wholesale, etc." />
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="text-sm text-muted-foreground p-4 border rounded-lg">
              {customer ? (
                <>
                  <p>Total Orders: {customer.orders}</p>
                  <p className="mt-2">Total Spent: {customer.totalSpent}</p>
                  <Button variant="link" className="p-0 h-auto mt-2">View All Orders →</Button>
                </>
              ) : (
                <p>No order history yet</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea 
                placeholder="Add notes about this customer (only visible to staff)..." 
                rows={6}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            {customer ? 'Update Customer' : 'Add Customer'}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
