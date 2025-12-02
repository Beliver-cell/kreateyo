import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VideoCall, formatCallDuration, calculateCallCost } from '@/types/calls';
import {
  Video,
  Phone,
  Calendar,
  Clock,
  Users,
  Play,
  Download,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CallCardProps {
  call: VideoCall;
  onJoin?: (call: VideoCall) => void;
  onCancel?: (call: VideoCall) => void;
  onEdit?: (call: VideoCall) => void;
  onViewRecording?: (call: VideoCall) => void;
}

export function CallCard({ call, onJoin, onCancel, onEdit, onViewRecording }: CallCardProps) {
  const scheduledDate = new Date(call.scheduledAt);
  const isUpcoming = call.status === 'scheduled' && !isPast(scheduledDate);
  const isActive = call.status === 'active';
  const isCompleted = call.status === 'completed';

  const getStatusBadge = () => {
    switch (call.status) {
      case 'scheduled':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Scheduled</Badge>;
      case 'active':
        return (
          <Badge className="bg-green-500/20 text-green-500">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live
          </Badge>
        );
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'no_show':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">No Show</Badge>;
      default:
        return null;
    }
  };

  const formatScheduledTime = () => {
    if (isToday(scheduledDate)) {
      return `Today at ${format(scheduledDate, 'h:mm a')}`;
    }
    return format(scheduledDate, 'MMM d, yyyy h:mm a');
  };

  return (
    <Card className="overflow-hidden" data-testid={`call-card-${call.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`p-2 rounded-lg ${call.type === 'video' ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
            {call.type === 'video' ? (
              <Video className={`h-5 w-5 ${call.type === 'video' ? 'text-blue-500' : 'text-green-500'}`} />
            ) : (
              <Phone className={`h-5 w-5 text-green-500`} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base font-medium truncate">{call.title}</CardTitle>
            {call.description && (
              <p className="text-sm text-muted-foreground truncate mt-1">{call.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {getStatusBadge()}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" data-testid={`button-call-menu-${call.id}`}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isUpcoming && (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(call)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(call.id)}>
                    <Copy className="h-4 w-4 mr-2" /> Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => onCancel?.(call)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Cancel
                  </DropdownMenuItem>
                </>
              )}
              {isCompleted && call.recordingUrl && (
                <DropdownMenuItem onClick={() => onViewRecording?.(call)}>
                  <Play className="h-4 w-4 mr-2" /> View Recording
                </DropdownMenuItem>
              )}
              {call.calendlyEventUri && (
                <DropdownMenuItem onClick={() => window.open(call.calendlyEventUri, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" /> View in Calendly
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formatScheduledTime()}</span>
          </div>
          {isUpcoming && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>in {formatDistanceToNow(scheduledDate)}</span>
            </div>
          )}
          {isCompleted && call.durationMinutes && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatCallDuration(call.durationMinutes)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{call.participantUserIds.length + 1} participants</span>
          </div>
        </div>

        {call.participantUserIds.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {call.participantUserIds.slice(0, 3).map((userId, index) => (
                <Avatar key={userId} className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    {userId.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {call.participantUserIds.length > 3 && (
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                  +{call.participantUserIds.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {isCompleted && call.billedMinutes && (
          <div className="flex items-center justify-between pt-3 border-t text-sm">
            <span className="text-muted-foreground">Billing</span>
            <span className="font-medium">
              {formatCallDuration(call.billedMinutes)} - ${calculateCallCost(call.billedMinutes).toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          {(isUpcoming || isActive) && (
            <Button
              className="flex-1"
              onClick={() => onJoin?.(call)}
              data-testid={`button-join-call-${call.id}`}
            >
              {isActive ? (
                <>
                  <Play className="h-4 w-4 mr-2" /> Join Now
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" /> Join Call
                </>
              )}
            </Button>
          )}
          {isCompleted && call.recordingUrl && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewRecording?.(call)}
              data-testid={`button-view-recording-${call.id}`}
            >
              <Play className="h-4 w-4 mr-2" /> View Recording
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
