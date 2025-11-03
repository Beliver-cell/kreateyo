import { Check, Cloud, CloudOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  status: 'saved' | 'saving' | 'error';
  lastSaved?: Date;
}

export function AutoSaveIndicator({ status, lastSaved }: AutoSaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {status === 'saved' && (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-muted-foreground">
            All changes saved
            {lastSaved && ` • ${lastSaved.toLocaleTimeString()}`}
          </span>
        </>
      )}
      {status === 'saving' && (
        <>
          <Cloud className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}
      {status === 'error' && (
        <>
          <CloudOff className="w-4 h-4 text-destructive" />
          <span className="text-destructive">Failed to save</span>
        </>
      )}
    </div>
  );
}
