import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  text?: string;
}

export function Loading({ className, text = 'Loading...' }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
