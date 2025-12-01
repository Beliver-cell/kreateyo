import { cn } from '@/lib/utils';
import logo from '@/assets/kreateyo-logo.png';

interface KreateyoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function KreateyoLogo({ className, size = 'md', showText = true }: KreateyoLogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img 
        src={logo} 
        alt="Kreateyo" 
        className={cn('object-contain', sizeClasses[size])}
      />
    </div>
  );
}
