import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Video, Send, Phone, MessageCircle, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Message {
  id: string;
  business_id: string;
  client_id: string;
  sender_type: 'business' | 'client';
  message: string;
  read: boolean;
  created_at: string;
}

interface Client {
  id: string;
  full_name: string;
  avatar_url: string | null;
  lastMessage?: string;
  unreadCount: number;
}

export default function ClientChat() {
  const { user, profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch clients and their last messages
  useEffect(() => {
    if (!profile?.business_id) return;

    const fetchClients = async () => {
      try {
        // Get unique clients from messages
        const { data: messagesData, error } = await supabase
          .from('business_client_messages')
          .select('client_id, message, created_at, read, sender_type')
          .eq('business_id', profile.business_id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get unique client IDs
        const clientIds = [...new Set(messagesData?.map(m => m.client_id) || [])];

        // Fetch client profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', clientIds);

        if (profilesError) throw profilesError;

        // Build client list with unread counts
        const clientList = profilesData?.map(client => {
          const clientMessages = messagesData?.filter(m => m.client_id === client.id) || [];
          const unreadCount = clientMessages.filter(m => !m.read && m.sender_type === 'client').length;
          const lastMessage = clientMessages[0]?.message || '';

          return {
            ...client,
            lastMessage,
            unreadCount,
          };
        }) || [];

        setClients(clientList);
        if (clientList.length > 0 && !selectedClient) {
          setSelectedClient(clientList[0]);
        }
      } catch (error: any) {
        console.error('Error fetching clients:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [profile?.business_id]);

  // Fetch messages for selected client
  useEffect(() => {
    if (!selectedClient || !profile?.business_id) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('business_client_messages')
          .select('*')
          .eq('business_id', profile.business_id)
          .eq('client_id', selectedClient.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages((data as Message[]) || []);

        // Mark unread messages as read
        await supabase
          .from('business_client_messages')
          .update({ read: true })
          .eq('business_id', profile.business_id)
          .eq('client_id', selectedClient.id)
          .eq('sender_type', 'client')
          .eq('read', false);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('client_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_client_messages',
          filter: `business_id=eq.${profile.business_id}`,
        },
        (payload) => {
          console.log('Message update:', payload);
          if (payload.new && (payload.new as any).client_id === selectedClient.id) {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClient, profile?.business_id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedClient || !profile?.business_id) return;

    try {
      const { error } = await supabase
        .from('business_client_messages')
        .insert({
          business_id: profile.business_id,
          client_id: selectedClient.id,
          sender_type: 'business',
          message: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleStartVideoCall = () => {
    toast({
      title: 'Starting video call...',
      description: 'Zoom meeting will open in a new window',
    });
    // TODO: Integrate with Zoom API
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Client Communication</h1>
        <p className="text-sm md:text-base text-muted-foreground">Chat and video call with your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Clients
              <Badge variant="secondary" className="ml-auto">{clients.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {clients.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No clients yet</p>
                  <p className="text-sm mt-2">Messages from clients will appear here</p>
                </div>
              ) : (
                clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors border-l-4 ${
                      selectedClient?.id === client.id
                        ? 'border-primary bg-muted/50'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Avatar>
                          <AvatarFallback>
                            {client.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{client.full_name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {client.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                      {client.unreadCount > 0 && (
                        <Badge className="flex-shrink-0">{client.unreadCount}</Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedClient ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedClient.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedClient.full_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Active now</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleStartVideoCall}>
                      <Video className="w-4 h-4 mr-2" />
                      Video Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-4 h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_type === 'business' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-[70%] space-y-1">
                          <div
                            className={`p-3 rounded-lg ${
                              msg.sender_type === 'business'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <p className="text-xs text-muted-foreground px-1">
                            {format(new Date(msg.created_at), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="h-[600px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a client to start chatting</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
