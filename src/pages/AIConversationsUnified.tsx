import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  MessageSquare, Search, Bot, Send, User, Loader2, Calendar, 
  ShoppingCart, Phone, Mail, Facebook, Instagram, Twitter, MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  type: 'lead' | 'social';
  platform: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  messages: Message[];
  status: string;
  aiEnabled: boolean;
  lastMessageAt: string;
  unread: boolean;
}

export default function AIConversationsUnified() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [globalAiToggle, setGlobalAiToggle] = useState(true);

  // Fetch conversations from database
  const { data: dbConversations = [], isLoading } = useQuery({
    queryKey: ['unified_conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select(`
          *,
          leads (name, email, phone)
        `)
        .order('last_message_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Combine DB conversations with simulated social conversations
  const socialConversations: Conversation[] = [
    {
      id: 'social-1',
      type: 'social',
      platform: 'whatsapp',
      customerName: 'John Smith',
      customerPhone: '+1234567890',
      messages: [
        { role: 'user', content: 'Hi, is this product still available?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { role: 'assistant', content: 'Yes! It\'s available. Would you like me to reserve one for you?', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
      ],
      status: 'active',
      aiEnabled: true,
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      unread: true,
    },
    {
      id: 'social-2',
      type: 'social',
      platform: 'instagram',
      customerName: 'Sarah Johnson',
      messages: [
        { role: 'user', content: 'What\'s the price for this?', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
        { role: 'assistant', content: 'The price is $49.99. We also have a 20% discount this week!', timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString() },
        { role: 'user', content: 'Great! How can I order?', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
      ],
      status: 'active',
      aiEnabled: true,
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      unread: true,
    },
    {
      id: 'social-3',
      type: 'social',
      platform: 'facebook',
      customerName: 'Mike Davis',
      customerEmail: 'mike@example.com',
      messages: [
        { role: 'user', content: 'Do you offer consultations?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
        { role: 'assistant', content: 'Yes! We offer free 30-minute consultations. Would you like me to book one for you?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 120000).toISOString() },
      ],
      status: 'active',
      aiEnabled: true,
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      unread: false,
    },
  ];

  // Convert DB conversations to unified format
  const leadConversations: Conversation[] = dbConversations.map((conv: any) => ({
    id: conv.id,
    type: 'lead' as const,
    platform: conv.channel || 'email',
    customerName: conv.leads?.name || conv.leads?.email || 'Unknown',
    customerEmail: conv.leads?.email,
    customerPhone: conv.leads?.phone,
    messages: (Array.isArray(conv.messages) ? conv.messages : []).map((m: any) => ({
      role: m.role,
      content: m.content,
      timestamp: m.sent_at,
    })),
    status: conv.status,
    aiEnabled: true,
    lastMessageAt: conv.last_message_at,
    unread: conv.status === 'active',
  }));

  const allConversations = [...leadConversations, ...socialConversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  const filteredConversations = allConversations.filter(conv => {
    const searchLower = searchTerm.toLowerCase();
    return (
      conv.customerName.toLowerCase().includes(searchLower) ||
      conv.customerEmail?.toLowerCase().includes(searchLower) ||
      conv.customerPhone?.includes(searchTerm)
    );
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!selectedConversation) throw new Error('No conversation selected');
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 500));
      return message;
    },
    onSuccess: () => {
      setNewMessage('');
      toast.success('Message sent!');
    },
    onError: (error) => toast.error(error.message),
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: async () => {
      // Simulate booking
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    },
    onSuccess: () => {
      toast.success('Appointment booking link sent to customer!');
    },
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      case 'whatsapp': return MessageCircle;
      case 'email': return Mail;
      default: return MessageSquare;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-600';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'twitter': return 'bg-black';
      case 'whatsapp': return 'bg-green-500';
      default: return 'bg-primary';
    }
  };

  const stats = {
    total: allConversations.length,
    unread: allConversations.filter(c => c.unread).length,
    leads: leadConversations.length,
    social: socialConversations.length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">AI Conversations</h1>
            <p className="text-muted-foreground">Unified inbox for leads and social messages</p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="global-ai" className="text-sm">AI Auto-Response</Label>
            <Switch 
              id="global-ai" 
              checked={globalAiToggle} 
              onCheckedChange={setGlobalAiToggle}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><MessageSquare className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10"><MessageSquare className="h-5 w-5 text-red-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{stats.unread}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10"><User className="h-5 w-5 text-purple-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Leads</p>
                <p className="text-2xl font-bold">{stats.leads}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><MessageCircle className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Social</p>
                <p className="text-2xl font-bold">{stats.social}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No conversations</p>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  {filteredConversations.map((conv) => {
                    const Icon = getPlatformIcon(conv.platform);
                    return (
                      <div
                        key={conv.id}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedConversation?.id === conv.id ? 'bg-muted' : ''
                        } ${conv.unread ? 'bg-primary/5' : ''}`}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {conv.customerName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getPlatformColor(conv.platform)} text-white`}>
                              <Icon className="h-3 w-3" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium truncate">{conv.customerName}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {conv.lastMessageAt ? format(new Date(conv.lastMessageAt), 'h:mm a') : ''}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.messages[conv.messages.length - 1]?.content || 'No messages'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={conv.type === 'lead' ? 'default' : 'secondary'} className="text-xs">
                                {conv.type}
                              </Badge>
                              {conv.unread && <Badge variant="destructive" className="text-xs">New</Badge>}
                              {conv.aiEnabled && globalAiToggle && (
                                <Bot className="h-3 w-3 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Conversation Detail */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedConversation.customerName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedConversation.customerName}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {selectedConversation.customerEmail && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {selectedConversation.customerEmail}
                            </span>
                          )}
                          {selectedConversation.customerPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {selectedConversation.customerPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => bookAppointmentMutation.mutate()}
                        disabled={bookAppointmentMutation.isPending}
                      >
                        {bookAppointmentMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <><Calendar className="h-4 w-4 mr-1" /> Book</>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-1" /> Close Sale
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((message, idx) => (
                        <div
                          key={idx}
                          className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === 'assistant'
                                ? 'bg-muted'
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            {message.role === 'assistant' && (
                              <div className="flex items-center gap-1 mb-1">
                                <Bot className="h-3 w-3" />
                                <span className="text-xs font-medium">AI</span>
                              </div>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/70'
                            }`}>
                              {message.timestamp ? format(new Date(message.timestamp), 'h:mm a') : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[40px] max-h-[120px]"
                        rows={1}
                      />
                      <Button 
                        onClick={() => sendMessageMutation.mutate(newMessage)}
                        disabled={sendMessageMutation.isPending || !newMessage.trim()}
                      >
                        {sendMessageMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
