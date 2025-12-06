import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderType: 'customer' | 'staff' | 'system';
  content: string;
  attachments?: string[];
  readAt?: string;
  createdAt: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  senderName?: string;
}

export function ChatMessage({ message, isOwnMessage, senderName }: ChatMessageProps) {
  const getInitials = (name?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    return message.senderType === 'customer' ? 'CU' : 'ST';
  };

  if (message.senderType === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted px-4 py-2 rounded-full text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-3 mb-4', isOwnMessage && 'flex-row-reverse')}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}>
          {getInitials(senderName)}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn('flex flex-col max-w-[70%]', isOwnMessage && 'items-end')}>
        <div className={cn(
          'rounded-2xl px-4 py-2',
          isOwnMessage 
            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
            : 'bg-muted rounded-tl-sm'
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className={cn('flex flex-wrap gap-2 mt-2', isOwnMessage && 'justify-end')}>
            {message.attachments.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Attachment {index + 1}
              </a>
            ))}
          </div>
        )}
        
        <div className={cn('flex items-center gap-1 mt-1', isOwnMessage && 'flex-row-reverse')}>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
          {isOwnMessage && (
            message.readAt ? (
              <CheckCheck className="h-3 w-3 text-primary" />
            ) : (
              <Check className="h-3 w-3 text-muted-foreground" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
