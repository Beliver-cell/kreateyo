import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  MessageSquare, Link2, Unlink, Bot, Send, Plus, Settings,
  Facebook, Instagram, Twitter, MessageCircle, Loader2, Zap
} from 'lucide-react';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
  autoReply: boolean;
  triggerWords: string[];
}

interface SocialConversation {
  id: string;
  platform: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  aiReplied: boolean;
}

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'bg-black' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-sky-500' },
];

export default function SocialHub() {
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [newTriggerWord, setNewTriggerWord] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<SocialConversation | null>(null);

  // Simulated social accounts (in production, this would come from database)
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'facebook', username: '', connected: false, autoReply: false, triggerWords: ['price', 'buy', 'order'] },
    { id: '2', platform: 'instagram', username: '', connected: false, autoReply: false, triggerWords: ['dm', 'info', 'available'] },
    { id: '3', platform: 'twitter', username: '', connected: false, autoReply: false, triggerWords: ['help', 'support'] },
    { id: '4', platform: 'whatsapp', username: '', connected: false, autoReply: false, triggerWords: ['hello', 'hi', 'order'] },
    { id: '5', platform: 'telegram', username: '', connected: false, autoReply: false, triggerWords: ['start', 'help'] },
  ]);

  // Simulated conversations
  const [conversations] = useState<SocialConversation[]>([
    { id: '1', platform: 'whatsapp', customerName: 'John Smith', lastMessage: 'Is this still available?', timestamp: '2 min ago', unread: true, aiReplied: false },
    { id: '2', platform: 'instagram', customerName: 'Sarah Johnson', lastMessage: 'What\'s the price?', timestamp: '15 min ago', unread: true, aiReplied: true },
    { id: '3', platform: 'facebook', customerName: 'Mike Davis', lastMessage: 'Thanks for the info!', timestamp: '1 hour ago', unread: false, aiReplied: true },
    { id: '4', platform: 'telegram', customerName: 'Emma Wilson', lastMessage: 'Can I book an appointment?', timestamp: '2 hours ago', unread: false, aiReplied: true },
  ]);

  const connectAccount = (platformId: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.platform === platformId 
        ? { ...acc, connected: true, username: `@kreateyo_${platformId}` }
        : acc
    ));
    toast.success(`Connected to ${platformId}!`);
  };

  const disconnectAccount = (platformId: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.platform === platformId 
        ? { ...acc, connected: false, username: '' }
        : acc
    ));
    toast.success(`Disconnected from ${platformId}`);
  };

  const toggleAutoReply = (platformId: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.platform === platformId 
        ? { ...acc, autoReply: !acc.autoReply }
        : acc
    ));
  };

  const addTriggerWord = (platformId: string) => {
    if (!newTriggerWord.trim()) return;
    setAccounts(prev => prev.map(acc => 
      acc.platform === platformId 
        ? { ...acc, triggerWords: [...acc.triggerWords, newTriggerWord.trim()] }
        : acc
    ));
    setNewTriggerWord('');
    toast.success('Trigger word added');
  };

  const removeTriggerWord = (platformId: string, word: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.platform === platformId 
        ? { ...acc, triggerWords: acc.triggerWords.filter(w => w !== word) }
        : acc
    ));
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    if (!platform) return MessageSquare;
    return platform.icon;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    return platform?.color || 'bg-gray-500';
  };

  const connectedCount = accounts.filter(a => a.connected).length;
  const autoReplyCount = accounts.filter(a => a.autoReply).length;
  const unreadCount = conversations.filter(c => c.unread).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Social Hub</h1>
            <p className="text-muted-foreground">Connect accounts, automate replies, manage conversations</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Link2 className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold">{connectedCount}/5</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><Bot className="h-5 w-5 text-green-500" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Auto-Reply</p>
                <p className="text-2xl font-bold">{autoReplyCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10"><MessageSquare className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Social Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Social Accounts
              </CardTitle>
              <CardDescription>Connect and configure your social platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {PLATFORMS.map((platform) => {
                const account = accounts.find(a => a.platform === platform.id);
                const Icon = platform.icon;
                
                return (
                  <div key={platform.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{platform.name}</p>
                        {account?.connected && (
                          <p className="text-sm text-muted-foreground">{account.username}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {account?.connected && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPlatform(platform.id)}>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Icon className="h-5 w-5" />
                                {platform.name} Settings
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>AI Auto-Reply</Label>
                                  <p className="text-sm text-muted-foreground">Let AI respond to messages</p>
                                </div>
                                <Switch 
                                  checked={account?.autoReply} 
                                  onCheckedChange={() => toggleAutoReply(platform.id)}
                                />
                              </div>
                              <div>
                                <Label>Trigger Words</Label>
                                <p className="text-sm text-muted-foreground mb-2">AI activates on these keywords</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {account?.triggerWords.map(word => (
                                    <Badge 
                                      key={word} 
                                      variant="secondary"
                                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                      onClick={() => removeTriggerWord(platform.id, word)}
                                    >
                                      {word} ×
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Input 
                                    placeholder="Add trigger word..."
                                    value={newTriggerWord}
                                    onChange={(e) => setNewTriggerWord(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addTriggerWord(platform.id)}
                                  />
                                  <Button size="sm" onClick={() => addTriggerWord(platform.id)}>
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {account?.connected ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => disconnectAccount(platform.id)}
                        >
                          <Unlink className="h-4 w-4 mr-1" /> Disconnect
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => connectAccount(platform.id)}
                        >
                          <Link2 className="h-4 w-4 mr-1" /> Connect
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Social Conversations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Conversations
              </CardTitle>
              <CardDescription>Messages from connected platforms</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Connect accounts to see messages</p>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const Icon = getPlatformIcon(conv.platform);
                    return (
                      <div 
                        key={conv.id}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          conv.unread ? 'bg-primary/5' : ''
                        }`}
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
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{conv.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {conv.unread && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                              {conv.aiReplied && (
                                <Badge variant="secondary" className="text-xs">
                                  <Bot className="h-3 w-3 mr-1" /> AI Replied
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Auto-Posting Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Auto-Posting
            </CardTitle>
            <CardDescription>Schedule posts to connected platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">Create content in Content Studio and schedule auto-posts</p>
              <Button variant="outline" onClick={() => window.location.href = '/content-studio'}>
                Go to Content Studio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
