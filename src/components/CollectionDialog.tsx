import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection?: any;
}

export function CollectionDialog({ open, onOpenChange, collection }: CollectionDialogProps) {
  const [formData, setFormData] = useState({
    name: collection?.name || '',
    type: 'manual' as 'manual' | 'automated',
    rules: [] as Array<{ field: string; condition: string; value: string }>,
  });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, { field: 'price', condition: 'greater_than', value: '' }]
    }));
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const updateRule = (index: number, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? { ...rule, [key]: value } : rule)
    }));
  };

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
              {collection ? 'Edit Collection' : 'Create Collection'}
            </DialogTitle>
            <AutoSaveIndicator status={saveStatus} />
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-140px)]">
          <div className="px-6 py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name *</Label>
              <Input
                id="collection-name"
                placeholder="e.g. Summer Collection"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="text-lg"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Collection Type</Label>
              <Tabs value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="automated">Automated</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      Manually select products to add to this collection. You'll be able to add products after creating the collection.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="automated" className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-4">
                      Products matching these rules will automatically be added to this collection.
                    </p>

                    <div className="space-y-3">
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1 space-y-2">
                            <Label className="text-xs">Field</Label>
                            <select
                              value={rule.field}
                              onChange={(e) => updateRule(index, 'field', e.target.value)}
                              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                              <option value="price">Product Price</option>
                              <option value="tag">Product Tag</option>
                              <option value="inventory">Inventory</option>
                              <option value="status">Status</option>
                            </select>
                          </div>

                          <div className="flex-1 space-y-2">
                            <Label className="text-xs">Condition</Label>
                            <select
                              value={rule.condition}
                              onChange={(e) => updateRule(index, 'condition', e.target.value)}
                              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                              <option value="greater_than">Greater than</option>
                              <option value="less_than">Less than</option>
                              <option value="equals">Equals</option>
                              <option value="contains">Contains</option>
                            </select>
                          </div>

                          <div className="flex-1 space-y-2">
                            <Label className="text-xs">Value</Label>
                            <Input
                              value={rule.value}
                              onChange={(e) => updateRule(index, 'value', e.target.value)}
                              placeholder="Enter value"
                            />
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-10"
                            onClick={() => removeRule(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addRule}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Rule
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            {collection ? 'Update Collection' : 'Create Collection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
