import { useState, useEffect } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Conversation {
  id: string;
  customerName?: string;
  customerEmail?: string;
  subject?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  status: 'active' | 'archived' | 'closed';
}

interface ChatPageProps {
  businessId: string;
  currentUserId: string;
}

export function ChatPage({ businessId, currentUserId }: ChatPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newConversation, setNewConversation] = useState({
    customerName: '',
    customerEmail: '',
    subject: '',
  });

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/chat/conversations?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [businessId]);

  const handleCreateConversation = async () => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          ...newConversation,
        }),
      });

      if (response.ok) {
        const created = await response.json();
        setConversations(prev => [created, ...prev]);
        setSelectedConversation(created);
        setDialogOpen(false);
        setNewConversation({ customerName: '', customerEmail: '', subject: '' });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleArchive = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });

      if (response.ok) {
        setConversations(prev => 
          prev.map(c => c.id === conversationId ? { ...c, status: 'archived' as const } : c)
        );
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null);
        }
      }
    } catch (error) {
      console.error('Error archiving conversation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background rounded-lg border overflow-hidden">
      <div className="w-80 shrink-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Messages</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
                <DialogDescription>
                  Create a new conversation with a customer
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={newConversation.customerName}
                    onChange={(e) => setNewConversation(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={newConversation.customerEmail}
                    onChange={(e) => setNewConversation(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject (optional)</Label>
                  <Input
                    id="subject"
                    value={newConversation.subject}
                    onChange={(e) => setNewConversation(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="General inquiry"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConversation}>
                  Create Conversation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={setSelectedConversation}
        />
      </div>

      <ChatWindow
        conversation={selectedConversation}
        currentUserId={currentUserId}
        onClose={() => setSelectedConversation(null)}
        onArchive={handleArchive}
      />
    </div>
  );
}
