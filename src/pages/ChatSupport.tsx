import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Send, Bot, User, Clock, CheckCheck, Phone, Mail, Settings, Zap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const mockConversations = [
  {
    id: 1,
    customer: 'John Doe',
    lastMessage: 'Hi, I need help with my order',
    timestamp: '2 min ago',
    status: 'active',
    unread: 2,
    platform: 'website'
  },
  {
    id: 2,
    customer: 'Jane Smith',
    lastMessage: 'When will my package arrive?',
    timestamp: '15 min ago',
    status: 'pending',
    unread: 1,
    platform: 'whatsapp'
  },
  {
    id: 3,
    customer: 'Bob Johnson',
    lastMessage: 'Thank you for the help!',
    timestamp: '1 hour ago',
    status: 'resolved',
    unread: 0,
    platform: 'website'
  },
];

const mockMessages = [
  { id: 1, sender: 'customer', text: 'Hi, I need help with my order #12345', time: '10:30 AM', read: true },
  { id: 2, sender: 'staff', text: 'Hello! I\'d be happy to help you with that. Let me look up your order.', time: '10:31 AM', read: true },
  { id: 3, sender: 'staff', text: 'I found your order. It\'s currently being processed and will ship tomorrow.', time: '10:32 AM', read: true },
  { id: 4, sender: 'customer', text: 'Great! Can I change the delivery address?', time: '10:33 AM', read: false },
];

const quickReplies = [
  'Thanks for reaching out! How can I help you today?',
  'Your order is being processed and will ship soon.',
  'Let me check that for you right away.',
  'Is there anything else I can help you with?',
  'We\'re working on resolving this issue.',
];

export default function ChatSupport() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [whatsappConnected, setWhatsappConnected] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    });
    setMessage('');
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };

  const handleConnectWhatsApp = () => {
    toast({
      title: "Connect WhatsApp",
      description: "Redirecting to WhatsApp Business integration...",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Chat & Support</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer conversations across all platforms
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={whatsappConnected ? "outline" : "gradient"} onClick={handleConnectWhatsApp}>
            <Phone className="w-4 h-4 mr-2" />
            {whatsappConnected ? 'WhatsApp Connected' : 'Connect WhatsApp'}
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Chats', value: '12', icon: MessageCircle, color: 'text-blue-600' },
          { label: 'Pending', value: '5', icon: Clock, color: 'text-amber-600' },
          { label: 'Resolved Today', value: '28', icon: CheckCheck, color: 'text-green-600' },
          { label: 'Avg Response', value: '2.3 min', icon: Zap, color: 'text-purple-600' },
        ].map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Conversations</span>
              <Badge variant="secondary">{mockConversations.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 text-left hover:bg-muted/50 transition-colors border-l-4 ${
                    selectedConversation.id === conv.id 
                      ? 'border-primary bg-muted/50' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Avatar>
                        <AvatarFallback>{conv.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">{conv.customer}</p>
                          {conv.platform === 'whatsapp' && (
                            <Phone className="w-3 h-3 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-muted-foreground mt-1">{conv.timestamp}</p>
                      </div>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="flex-shrink-0">{conv.unread}</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedConversation.customer.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedConversation.customer}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.status === 'active' ? 'Active now' : selectedConversation.timestamp}
                  </p>
                </div>
              </div>
              <Badge variant={selectedConversation.status === 'active' ? 'default' : 'secondary'}>
                {selectedConversation.status}
              </Badge>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="p-4 h-[400px] overflow-y-auto space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] space-y-1`}>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === 'staff'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <p className="text-xs text-muted-foreground">{msg.time}</p>
                    {msg.sender === 'staff' && (
                      <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-blue-600' : 'text-muted-foreground'}`} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">Quick Replies:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.slice(0, 3).map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs"
                >
                  {reply.substring(0, 30)}...
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Switch
                id="ai-mode"
                checked={aiEnabled}
                onCheckedChange={setAiEnabled}
              />
              <Label htmlFor="ai-mode" className="flex items-center gap-2 text-sm">
                <Bot className="w-4 h-4" />
                AI Auto-Responses {aiEnabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} className="flex-shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            WhatsApp Business Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Direct Messaging', desc: 'Chat with customers directly on WhatsApp' },
              { title: 'Order Updates', desc: 'Send automated order status notifications' },
              { title: 'Quick Replies', desc: 'Use templates for faster responses' },
            ].map((feature, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <p className="font-semibold mb-1">{feature.title}</p>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
