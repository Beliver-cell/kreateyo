import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { CalendlySettings, CalendlyEventType } from '@/types/calendly';
import {
  Calendar,
  ExternalLink,
  RefreshCw,
  Unlink,
  Link as LinkIcon,
  Check,
  Settings,
  Clock,
  Video,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CalendlyIntegrationProps {
  settings?: CalendlySettings;
  onConnect?: (accessToken: string) => void;
  onDisconnect?: () => void;
  onSync?: () => void;
}

const mockEventTypes: CalendlyEventType[] = [
  {
    uri: 'https://api.calendly.com/event_types/1',
    name: '30 Minute Consultation',
    active: true,
    slug: '30-min-consultation',
    schedulingUrl: 'https://calendly.com/your-business/30-min-consultation',
    duration: 30,
    kind: 'solo',
    type: 'StandardEventType',
    color: '#0069FF',
    descriptionPlain: 'A quick 30-minute consultation call to discuss your needs.',
  },
  {
    uri: 'https://api.calendly.com/event_types/2',
    name: '60 Minute Strategy Session',
    active: true,
    slug: '60-min-strategy',
    schedulingUrl: 'https://calendly.com/your-business/60-min-strategy',
    duration: 60,
    kind: 'solo',
    type: 'StandardEventType',
    color: '#00A651',
    descriptionPlain: 'An in-depth strategy session to plan your next steps.',
  },
];

export function CalendlyIntegration({
  settings,
  onConnect,
  onDisconnect,
  onSync,
}: CalendlyIntegrationProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [isConnected, setIsConnected] = useState(settings?.isConnected || false);
  const [eventTypes, setEventTypes] = useState<CalendlyEventType[]>([]);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [autoCreateCalls, setAutoCreateCalls] = useState(true);

  useEffect(() => {
    if (isConnected) {
      setEventTypes(mockEventTypes);
    }
  }, [isConnected]);

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your Calendly access token.',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConnected(true);
      setEventTypes(mockEventTypes);
      setShowConnectDialog(false);
      onConnect?.(accessToken);
      
      toast({
        title: 'Connected',
        description: 'Successfully connected to Calendly.',
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Unable to connect to Calendly. Please check your access token.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsConnected(false);
    setEventTypes([]);
    setAccessToken('');
    onDisconnect?.();
    
    toast({
      title: 'Disconnected',
      description: 'Calendly integration has been removed.',
    });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSync?.();
      
      toast({
        title: 'Synced',
        description: 'Calendar events have been synchronized.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card data-testid="calendly-integration">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-base">Calendly Integration</CardTitle>
            <CardDescription>
              Sync your Calendly events and auto-create video calls
            </CardDescription>
          </div>
        </div>
        <Badge variant={isConnected ? 'default' : 'secondary'}>
          {isConnected ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Connected
            </>
          ) : (
            'Not Connected'
          )}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Connect Calendly</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Link your Calendly account to automatically create video calls when
              clients book appointments.
            </p>
            <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-connect-calendly">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Connect Calendly
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Calendly</DialogTitle>
                  <DialogDescription>
                    Enter your Calendly API access token to connect your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessToken">Access Token</Label>
                    <Input
                      id="accessToken"
                      type="password"
                      placeholder="Enter your Calendly access token"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      data-testid="input-calendly-token"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>To get your access token:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to Calendly &gt; Integrations &gt; API & Webhooks</li>
                      <li>Create a new Personal Access Token</li>
                      <li>Copy and paste it above</li>
                    </ol>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowConnectDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    data-testid="button-confirm-connect"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Auto-create video calls</span>
              </div>
              <Switch
                checked={autoCreateCalls}
                onCheckedChange={setAutoCreateCalls}
                data-testid="switch-auto-create-calls"
              />
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Synced Event Types</h4>
              <div className="space-y-2">
                {eventTypes.map((eventType) => (
                  <div
                    key={eventType.uri}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: eventType.color }}
                      />
                      <div>
                        <p className="text-sm font-medium">{eventType.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {eventType.duration} min
                          {autoCreateCalls && (
                            <>
                              <Video className="h-3 w-3 ml-2" />
                              Auto video call
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => window.open(eventType.schedulingUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSync}
                disabled={isSyncing}
                className="flex-1"
                data-testid="button-sync-calendly"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Events'}
              </Button>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="text-destructive hover:text-destructive"
                data-testid="button-disconnect-calendly"
              >
                <Unlink className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
