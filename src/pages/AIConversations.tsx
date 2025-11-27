import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { MessageSquare, Search, Mail, Phone, User, Loader2, Bot, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  subject?: string;
  sent_at: string;
  channel?: string;
}

interface Conversation {
  id: string;
  lead_id: string;
  campaign_id: string | null;
  channel: string;
  status: string;
  messages: Message[];
  sentiment: string;
  last_message_at: string;
  created_at: string;
  leads?: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export default function AIConversations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['ai_conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select(`
          *,
          leads (name, email, phone)
        `)
        .order('last_message_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(c => ({
        ...c,
        messages: (Array.isArray(c.messages) ? c.messages : []) as unknown as Message[]
      })) as Conversation[];
    },
  });

  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchTerm.toLowerCase();
    return (
      conv.leads?.name?.toLowerCase().includes(searchLower) ||
      conv.leads?.email?.toLowerCase().includes(searchLower) ||
      conv.leads?.phone?.includes(searchTerm)
    );
  });

  const stats = {
    total: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    positive: conversations.filter(c => c.sentiment === 'positive').length,
    negative: conversations.filter(c => c.sentiment === 'negative').length,
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/10 text-green-500';
      case 'negative': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'sms': return <Phone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">AI Conversations</h1>
            <p className="text-muted-foreground">Monitor all AI-powered conversations with leads</p>
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
              <div className="p-2 rounded-lg bg-blue-500/10"><Bot className="h-5 w-5 text-blue-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><ArrowRight className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Positive</p>
                <p className="text-2xl font-bold">{stats.positive}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10"><ArrowRight className="h-5 w-5 text-red-500 rotate-180" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Negative</p>
                <p className="text-2xl font-bold">{stats.negative}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedConversation?.id === conv.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {conv.leads?.name?.charAt(0) || <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium truncate">{conv.leads?.name || conv.leads?.email || 'Unknown'}</p>
                            {getChannelIcon(conv.channel)}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {(conv.messages as Message[])?.[0]?.content?.substring(0, 50)}...
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getSentimentColor(conv.sentiment)} variant="secondary">
                              {conv.sentiment}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {conv.last_message_at ? format(new Date(conv.last_message_at), 'MMM d') : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Conversation Detail */}
          <Card className="md:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedConversation.leads?.name?.charAt(0) || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {selectedConversation.leads?.name || 'Unknown Lead'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.leads?.email || selectedConversation.leads?.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getChannelIcon(selectedConversation.channel)}
                      <Badge className={getSentimentColor(selectedConversation.sentiment)}>
                        {selectedConversation.sentiment}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {(selectedConversation.messages as Message[])?.map((message, idx) => (
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
                            {message.subject && (
                              <p className="font-medium text-sm mb-1">Subject: {message.subject}</p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${message.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                              {message.sent_at ? format(new Date(message.sent_at), 'MMM d, h:mm a') : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </>
            ) : (
              <CardContent className="h-[500px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view details</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
