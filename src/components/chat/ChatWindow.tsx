import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { MoreVertical, Phone, Video, Archive, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  senderType: 'customer' | 'staff' | 'system';
  content: string;
  attachments?: string[];
  readAt?: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  customerName?: string;
  customerEmail?: string;
  subject?: string;
  status: 'active' | 'archived' | 'closed';
}

interface ChatWindowProps {
  conversation: Conversation | null;
  currentUserId: string;
  onClose?: () => void;
  onArchive?: (conversationId: string) => void;
}

export function ChatWindow({ conversation, currentUserId, onClose, onArchive }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!conversation) return;

    const socket = io('/chat', {
      path: '/socket.io',
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join:conversation', conversation.id);
    });

    socket.on('message:received', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('typing:update', ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        if (isTyping && !prev.includes(userId)) {
          return [...prev, userId];
        }
        if (!isTyping) {
          return prev.filter(id => id !== userId);
        }
        return prev;
      });
    });

    socket.on('messages:marked-read', () => {
      setMessages(prev => prev.map(msg => ({
        ...msg,
        readAt: msg.readAt || new Date().toISOString(),
      })));
    });

    return () => {
      socket.emit('leave:conversation', conversation.id);
      socket.disconnect();
    };
  }, [conversation?.id]);

  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/chat/conversations/${conversation.id}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string, attachments?: string[]) => {
    if (!conversation || !socketRef.current) return;

    socketRef.current.emit('message:send', {
      conversationId: conversation.id,
      senderId: currentUserId,
      senderType: 'staff',
      content,
      attachments,
    });
  };

  const handleTypingStart = () => {
    if (!conversation || !socketRef.current) return;
    socketRef.current.emit('typing:start', {
      conversationId: conversation.id,
      userId: currentUserId,
    });
  };

  const handleTypingStop = () => {
    if (!conversation || !socketRef.current) return;
    socketRef.current.emit('typing:stop', {
      conversationId: conversation.id,
      userId: currentUserId,
    });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">Select a conversation</p>
          <p className="text-sm mt-1">Choose a conversation from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold">
              {conversation.customerName || conversation.customerEmail || 'Anonymous'}
            </h3>
            {conversation.subject && (
              <p className="text-sm text-muted-foreground">{conversation.subject}</p>
            )}
          </div>
          <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
            {conversation.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onArchive?.(conversation.id)}>
                <Archive className="h-4 w-4 mr-2" />
                Archive conversation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Close
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwnMessage={message.senderId === currentUserId}
                senderName={message.senderType === 'customer' ? conversation.customerName : undefined}
              />
            ))}
            {typingUsers.length > 0 && (
              <div className="text-sm text-muted-foreground italic">
                Someone is typing...
              </div>
            )}
          </>
        )}
      </ScrollArea>

      <ChatInput
        onSend={handleSend}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        disabled={conversation.status !== 'active'}
        placeholder={conversation.status !== 'active' ? 'This conversation is closed' : undefined}
      />
    </div>
  );
}
