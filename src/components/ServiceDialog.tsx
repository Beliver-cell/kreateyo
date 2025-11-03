import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from './RichTextEditor';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: any;
}

export function ServiceDialog({ open, onOpenChange, service }: ServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    duration: service?.duration || '60',
    customDuration: '',
    price: service?.price || '',
    isPriceFree: false,
    isContactForPricing: false,
    location: 'both' as 'online' | 'in-person' | 'both',
    bufferTime: '15',
    requiresIntakeForm: false,
  });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const durationOptions = [
    { value: '30', label: '30 min' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              {service ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <AutoSaveIndicator status={saveStatus} />
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-140px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name *</Label>
                <Input
                  id="service-name"
                  placeholder="e.g. Personal Training Session"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-description">Description</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                  placeholder="Describe your service..."
                  minHeight="200px"
                />
              </div>
            </div>

            {/* Duration & Pricing */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Duration & Pricing</Label>
              
              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="grid grid-cols-5 gap-2">
                  {durationOptions.map(option => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={formData.duration === option.value ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, duration: option.value }))}
                      className="w-full"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {formData.duration === 'custom' && (
                  <Input
                    placeholder="Enter duration in minutes"
                    type="number"
                    value={formData.customDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, customDuration: e.target.value }))}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-price">Price</Label>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="service-price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="pl-7"
                      disabled={formData.isPriceFree || formData.isContactForPricing}
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPriceFree}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          isPriceFree: e.target.checked,
                          isContactForPricing: false,
                          price: e.target.checked ? '0' : prev.price
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">Free</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isContactForPricing}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          isContactForPricing: e.target.checked,
                          isPriceFree: false 
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">Contact for pricing</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Settings */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Booking Settings</Label>

              <div className="space-y-2">
                <Label>Location</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={formData.location === 'online' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, location: 'online' }))}
                  >
                    📍 Online
                  </Button>
                  <Button
                    type="button"
                    variant={formData.location === 'in-person' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, location: 'in-person' }))}
                  >
                    🏢 In-person
                  </Button>
                  <Button
                    type="button"
                    variant={formData.location === 'both' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, location: 'both' }))}
                  >
                    🌐 Both
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buffer-time">Buffer Time Between Appointments</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="buffer-time"
                    type="number"
                    value={formData.bufferTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, bufferTime: e.target.value }))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label htmlFor="intake-form" className="font-medium">Intake Form</Label>
                  <p className="text-sm text-muted-foreground">Require clients to fill out a form before booking</p>
                </div>
                <Switch
                  id="intake-form"
                  checked={formData.requiresIntakeForm}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresIntakeForm: checked }))}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave}>
              Save & Add Another
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              {service ? 'Update Service' : 'Save Service'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
