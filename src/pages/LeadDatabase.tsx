import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, Plus, Search, Filter, Users, UserCheck, UserX, TrendingUp, Loader2, Download, Trash2, Send } from 'lucide-react';
import { format } from 'date-fns';

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  platform: string | null;
  source: string;
  tags: string[];
  status: string;
  score: number;
  segment: string | null;
  lastContact: string | null;
  notes: string | null;
  createdAt: string;
}

export default function LeadDatabase() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', source: 'manual', tags: '', notes: '' });

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', statusFilter],
    queryFn: async () => {
      const response = await api.get<{ data: Lead[] }>('/data/leads');
      let data = response.data || [];
      if (statusFilter !== 'all') {
        data = data.filter((l: Lead) => l.status === statusFilter);
      }
      return data;
    },
  });

  const addLeadMutation = useMutation({
    mutationFn: async (lead: typeof newLead) => {
      await api.post('/data/leads', {
        name: lead.name || null,
        email: lead.email || null,
        phone: lead.phone || null,
        source: lead.source,
        tags: lead.tags ? lead.tags.split(',').map(t => t.trim()) : [],
        notes: lead.notes || null,
        status: 'new',
        score: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsAddDialogOpen(false);
      setNewLead({ name: '', email: '', phone: '', source: 'manual', tags: '', notes: '' });
      toast.success('Lead added successfully');
    },
    onError: (error: any) => toast.error(error.message),
  });

  const importLeadsMutation = useMutation({
    mutationFn: async (file: File) => {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      const leadsToImport = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const lead: Record<string, string> = {};
        headers.forEach((header, i) => {
          lead[header] = values[i] || '';
        });
        return {
          name: lead.name || lead.fullname || lead.full_name || '',
          email: lead.email || lead.mail || '',
          phone: lead.phone || lead.mobile || lead.tel || '',
          source: 'csv_import',
          platform: lead.platform || lead.source || '',
          tags: lead.tags ? lead.tags.split(';') : [],
          notes: lead.notes || lead.description || '',
          status: 'new',
          score: 0,
        };
      }).filter(l => l.email);

      let imported = 0;
      for (const lead of leadsToImport) {
        try {
          await api.post('/data/leads', lead);
          imported++;
        } catch (e) {
          console.error('Failed to import lead:', e);
        }
      }
      
      return { imported, duplicates: leadsToImport.length - imported };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`Imported ${data.imported} leads (${data.duplicates} duplicates skipped)`);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/data/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted');
    },
  });

  const triggerOutreachMutation = useMutation({
    mutationFn: async (leadIds: string[]) => {
      for (const id of leadIds) {
        await api.patch(`/data/leads/${id}`, { status: 'contacted' });
      }
      return { sent: leadIds.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`Outreach sent to ${data.sent} leads`);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const filteredLeads = leads.filter((lead: Lead) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (lead.name?.toLowerCase().includes(searchLower) || false) ||
      (lead.email?.toLowerCase().includes(searchLower) || false) ||
      (lead.phone?.includes(searchTerm) || false)
    );
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l: Lead) => l.status === 'new').length,
    contacted: leads.filter((l: Lead) => l.status === 'contacted').length,
    converted: leads.filter((l: Lead) => l.status === 'converted').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-500';
      case 'queued': return 'bg-yellow-500/10 text-yellow-500';
      case 'contacted': return 'bg-purple-500/10 text-purple-500';
      case 'interested': return 'bg-green-500/10 text-green-500';
      case 'converted': return 'bg-emerald-500/10 text-emerald-500';
      case 'cold': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Lead Database</h1>
            <p className="text-muted-foreground">Manage and track all your leads</p>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importLeadsMutation.mutate(file);
              }}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importLeadsMutation.isPending}>
              {importLeadsMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Import CSV
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> Add Lead</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select value={newLead.source} onValueChange={(v) => setNewLead({ ...newLead, source: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="ads">Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input value={newLead.tags} onChange={(e) => setNewLead({ ...newLead, tags: e.target.value })} placeholder="b2b, high-value" />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea value={newLead.notes} onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })} />
                  </div>
                  <Button className="w-full" onClick={() => addLeadMutation.mutate(newLead)} disabled={addLeadMutation.isPending}>
                    {addLeadMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Add Lead
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><TrendingUp className="h-5 w-5 text-blue-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10"><UserCheck className="h-5 w-5 text-purple-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Contacted</p>
                <p className="text-2xl font-bold">{stats.contacted}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><UserX className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Converted</p>
                <p className="text-2xl font-bold">{stats.converted}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search leads..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="secondary" 
                onClick={() => triggerOutreachMutation.mutate(filteredLeads.filter((l: Lead) => ['new', 'queued'].includes(l.status)).map((l: Lead) => l.id))}
                disabled={triggerOutreachMutation.isPending || filteredLeads.filter((l: Lead) => ['new', 'queued'].includes(l.status)).length === 0}
              >
                {triggerOutreachMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Send Outreach
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No leads found. Import or add leads to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead: Lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name || '-'}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {lead.email && <div>{lead.email}</div>}
                            {lead.phone && <div className="text-muted-foreground">{lead.phone}</div>}
                          </div>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        </TableCell>
                        <TableCell>{lead.score}</TableCell>
                        <TableCell>{lead.lastContact ? format(new Date(lead.lastContact), 'MMM d, yyyy') : '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => triggerOutreachMutation.mutate([lead.id])}
                              disabled={triggerOutreachMutation.isPending}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive"
                              onClick={() => deleteLeadMutation.mutate(lead.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
