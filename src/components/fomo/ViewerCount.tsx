import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface ViewerCountProps {
  enabled: boolean;
  minimum: number;
  multiplier: number;
  showOnProduct?: boolean;
  showOnCart?: boolean;
  pageType: 'product' | 'cart' | 'other';
}

export function ViewerCount({
  enabled,
  minimum,
  multiplier,
  showOnProduct = true,
  showOnCart = false,
  pageType,
}: ViewerCountProps) {
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const baseCount = Math.floor(Math.random() * 15) + 3;
    const boostedCount = Math.max(minimum, Math.floor(baseCount * multiplier));
    setViewerCount(boostedCount);

    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        const newCount = Math.max(minimum, prev + change);
        return newCount;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [enabled, minimum, multiplier]);

  const shouldShow = () => {
    if (!enabled) return false;
    if (pageType === 'product' && showOnProduct) return true;
    if (pageType === 'cart' && showOnCart) return true;
    return false;
  };

  if (!shouldShow()) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-orange-600 animate-pulse">
      <Eye className="w-4 h-4" />
      <span className="font-medium">
        {viewerCount} {viewerCount === 1 ? 'person is' : 'people are'} viewing this right now
      </span>
    </div>
  );
}
