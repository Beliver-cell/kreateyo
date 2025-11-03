import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: any;
}

export function ClientDialog({ open, onOpenChange, client }: ClientDialogProps) {
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
          <DialogTitle>{client ? 'Edit Client' : 'Add Client'}</DialogTitle>
          <AutoSaveIndicator status={saveStatus} />
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" defaultValue={client?.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" defaultValue={client?.email} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+1 234-567-8900" defaultValue={client?.phone} />
              </div>
              <div className="space-y-2">
                <Label>Client Status</Label>
                <Select defaultValue={client?.status || 'active'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Emergency Contact</Label>
              <Input placeholder="Emergency contact name and number" />
            </div>

            <div className="space-y-2">
              <Label>Medical Notes</Label>
              <Textarea 
                placeholder="Any medical conditions or allergies to be aware of..." 
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="text-sm text-muted-foreground p-4 border rounded-lg">
              {client ? (
                <>
                  <p>Total Bookings: {client.totalBookings}</p>
                  <p className="mt-2">Next Appointment: {client.nextAppointment}</p>
                  <p className="mt-2">Total Spent: {client.totalSpent}</p>
                  <Button variant="link" className="p-0 h-auto mt-2">View All Bookings →</Button>
                </>
              ) : (
                <p>No booking history yet</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-2">
              <Label>Client Notes</Label>
              <Textarea 
                placeholder="Add notes about this client (only visible to staff)..." 
                rows={8}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            {client ? 'Update Client' : 'Add Client'}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
