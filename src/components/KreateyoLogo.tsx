import { cn } from '@/lib/utils';
import logo from '@/assets/kreateyo-logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img 
        src={logo} 
        alt="Kreateyo" 
        className={cn('object-contain font-bold', sizeClasses[size])}
      />
    </div>
  );
}
