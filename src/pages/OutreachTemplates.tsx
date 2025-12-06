import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, FileText, Mail, MessageSquare, Phone, Loader2, Pencil, Trash2, Copy } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  channel: string;
  subject: string | null;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
}

export default function OutreachTemplates() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'general',
    channel: 'email',
    subject: '',
    content: '',
    is_active: true,
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['outreach_templates'],
    queryFn: async () => {
      const response = await api.get<{ data: Template[] }>('/data/outreach_templates');
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const variables = (data.content.match(/{{(\w+)}}/g) || []).map(v => v.replace(/[{}]/g, ''));
      
      await api.post('/data/outreach_templates', {
        name: data.name,
        category: data.category,
        channel: data.channel,
        subject: data.subject || null,
        content: data.content,
        variables,
        is_active: data.is_active,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach_templates'] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Template created');
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const variables = (data.content.match(/{{(\w+)}}/g) || []).map(v => v.replace(/[{}]/g, ''));
      
      await api.patch(`/data/outreach_templates/${data.id}`, {
        name: data.name,
        category: data.category,
        channel: data.channel,
        subject: data.subject || null,
        content: data.content,
        variables,
        is_active: data.is_active,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach_templates'] });
      setEditingTemplate(null);
      resetForm();
      toast.success('Template updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/data/outreach_templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach_templates'] });
      toast.success('Template deleted');
    },
  });

  const resetForm = () => {
    setFormData({ name: '', category: 'general', channel: 'email', subject: '', content: '', is_active: true });
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      channel: template.channel,
      subject: template.subject || '',
      content: template.content,
      is_active: template.is_active,
    });
  };

  const handleSubmit = () => {
    if (editingTemplate) {
      updateMutation.mutate({ ...formData, id: editingTemplate.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const copyTemplate = (template: Template) => {
    navigator.clipboard.writeText(template.content);
    toast.success('Template copied to clipboard');
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'sms': return <Phone className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'b2b': return 'bg-blue-500/10 text-blue-500';
      case 'digital': return 'bg-purple-500/10 text-purple-500';
      case 'service': return 'bg-green-500/10 text-green-500';
      case 'cold': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const isFormOpen = isCreateOpen || editingTemplate !== null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Outreach Templates</h1>
            <p className="text-muted-foreground">Create and manage message templates</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingTemplate(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create Template'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Template Name</Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="B2B Introduction"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="b2b">B2B</SelectItem>
                        <SelectItem value="digital">Digital Products</SelectItem>
                        <SelectItem value="service">Services</SelectItem>
                        <SelectItem value="cold">Cold Outreach</SelectItem>
                        <SelectItem value="followup">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Channel</Label>
                    <Select value={formData.channel} onValueChange={(v) => setFormData({ ...formData, channel: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch 
                      checked={formData.is_active} 
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                {formData.channel === 'email' && (
                  <div>
                    <Label>Subject Line</Label>
                    <Input 
                      value={formData.subject} 
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Quick question about your business"
                    />
                  </div>
                )}
                <div>
                  <Label>Message Content</Label>
                  <Textarea 
                    value={formData.content} 
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Hi {{name}},

I noticed that..."
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Variables: {"{{name}}"}, {"{{email}}"}, {"{{phone}}"}, {"{{company}}"}
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending || !formData.name || !formData.content}
                >
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-4">Create templates to speed up your outreach</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className={!template.is_active ? 'opacity-60' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(template.channel)}
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                  </div>
                  {template.subject && (
                    <CardDescription className="truncate">Subject: {template.subject}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">{template.content}</p>
                  {template.variables && template.variables.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((v) => (
                        <Badge key={v} variant="outline" className="text-xs">{`{{${v}}}`}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => copyTemplate(template)}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(template)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
