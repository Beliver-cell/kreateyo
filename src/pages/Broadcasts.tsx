import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Send, Mail, MessageSquare, Smartphone, Bell, Users, 
  Clock, CheckCircle2, XCircle, Eye, MousePointer,
  Plus, Calendar, Search, Filter, MoreHorizontal, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const channelIcons = {
  email: Mail,
  whatsapp: MessageSquare,
  sms: Smartphone,
  in_app: Bell,
};

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-500/10 text-blue-500",
  sending: "bg-yellow-500/10 text-yellow-500",
  sent: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
};

export default function Broadcasts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newBroadcast, setNewBroadcast] = useState({
    name: "",
    subject: "",
    content: "",
    channel: "email",
    segment_type: "all",
    scheduled_for: "",
  });

  const { data: broadcasts, isLoading } = useQuery({
    queryKey: ["broadcasts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("broadcasts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createBroadcast = useMutation({
    mutationFn: async (broadcast: typeof newBroadcast) => {
      const { data, error } = await supabase
        .from("broadcasts")
        .insert({
          ...broadcast,
          user_id: user?.id,
          scheduled_for: broadcast.scheduled_for || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
      setIsCreateOpen(false);
      setNewBroadcast({ name: "", subject: "", content: "", channel: "email", segment_type: "all", scheduled_for: "" });
      toast.success("Broadcast created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create broadcast: " + error.message);
    },
  });

  const sendBroadcast = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("broadcasts")
        .update({ status: "sending" })
        .eq("id", id);
      if (error) throw error;
      // In production, this would trigger an edge function to process the broadcast
      toast.success("Broadcast is being sent");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
    },
  });

  const filteredBroadcasts = broadcasts?.filter((b) => {
    if (activeTab !== "all" && b.status !== activeTab) return false;
    if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: broadcasts?.length || 0,
    sent: broadcasts?.filter(b => b.status === "sent").length || 0,
    scheduled: broadcasts?.filter(b => b.status === "scheduled").length || 0,
    totalDelivered: broadcasts?.reduce((acc, b) => acc + (b.delivered_count || 0), 0) || 0,
    totalOpened: broadcasts?.reduce((acc, b) => acc + (b.opened_count || 0), 0) || 0,
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Broadcasts</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Send messages to your customers across all channels
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Broadcast</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input
                    placeholder="e.g., Holiday Sale Announcement"
                    value={newBroadcast.name}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Channel</Label>
                    <Select
                      value={newBroadcast.channel}
                      onValueChange={(v) => setNewBroadcast({ ...newBroadcast, channel: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="in_app">In-App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Audience</Label>
                    <Select
                      value={newBroadcast.segment_type}
                      onValueChange={(v) => setNewBroadcast({ ...newBroadcast, segment_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="paid">Paid Customers</SelectItem>
                        <SelectItem value="recent">Recent (30 days)</SelectItem>
                        <SelectItem value="vip">VIP (High LTV)</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newBroadcast.channel === "email" && (
                  <div className="space-y-2">
                    <Label>Subject Line</Label>
                    <Input
                      placeholder="Enter email subject"
                      value={newBroadcast.subject}
                      onChange={(e) => setNewBroadcast({ ...newBroadcast, subject: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <Textarea
                    placeholder="Write your message here..."
                    value={newBroadcast.content}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, content: e.target.value })}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {"{name}"} for personalization
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Schedule (Optional)</Label>
                  <Input
                    type="datetime-local"
                    value={newBroadcast.scheduled_for}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, scheduled_for: e.target.value })}
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-primary"
                  onClick={() => createBroadcast.mutate(newBroadcast)}
                  disabled={!newBroadcast.name || !newBroadcast.content || createBroadcast.isPending}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {createBroadcast.isPending ? "Creating..." : "Create Broadcast"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Broadcasts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.sent}</div>
              <p className="text-xs text-muted-foreground">Sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.scheduled}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalDelivered}</div>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalOpened}</div>
              <p className="text-xs text-muted-foreground">Opened</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search broadcasts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Broadcasts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredBroadcasts?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No broadcasts found</p>
                <Button className="mt-4" variant="outline" onClick={() => setIsCreateOpen(true)}>
                  Create your first broadcast
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredBroadcasts?.map((broadcast) => {
              const ChannelIcon = channelIcons[broadcast.channel as keyof typeof channelIcons] || Mail;
              return (
                <Card key={broadcast.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <ChannelIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{broadcast.name}</h3>
                          {broadcast.subject && (
                            <p className="text-sm text-muted-foreground">{broadcast.subject}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={statusColors[broadcast.status as keyof typeof statusColors]}>
                              {broadcast.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {broadcast.segment_type === "all" ? "All customers" : broadcast.segment_type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        {broadcast.status === "sent" && (
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{broadcast.total_recipients}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>{broadcast.delivered_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-blue-500" />
                              <span>{broadcast.opened_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MousePointer className="h-4 w-4 text-purple-500" />
                              <span>{broadcast.clicked_count}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {broadcast.status === "draft" && (
                            <Button 
                              size="sm"
                              onClick={() => sendBroadcast.mutate(broadcast.id)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Send
                            </Button>
                          )}
                          {broadcast.status === "scheduled" && (
                            <Button size="sm" variant="outline">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(broadcast.scheduled_for).toLocaleDateString()}
                            </Button>
                          )}
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
