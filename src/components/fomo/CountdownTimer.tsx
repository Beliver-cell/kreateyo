import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  enabled: boolean;
  endDate: string | null;
  message: string;
  primaryColor: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({
  enabled,
  endDate,
  message,
  primaryColor,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!enabled || !endDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [enabled, endDate]);

  if (!enabled || !timeLeft) return null;

  const padNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div 
      className="flex flex-col items-center gap-2 py-3 px-4 rounded-lg"
      style={{ backgroundColor: `${primaryColor}10` }}
    >
      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: primaryColor }}>
        <Clock className="w-4 h-4" />
        <span>{message}</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-lg font-bold">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <span className="bg-gray-900 text-white px-2 py-1 rounded">{padNumber(timeLeft.days)}</span>
              <span className="text-xs text-gray-500 mt-1">Days</span>
            </div>
            <span className="text-gray-400">:</span>
          </>
        )}
        <div className="flex flex-col items-center">
          <span className="bg-gray-900 text-white px-2 py-1 rounded">{padNumber(timeLeft.hours)}</span>
          <span className="text-xs text-gray-500 mt-1">Hours</span>
        </div>
        <span className="text-gray-400">:</span>
        <div className="flex flex-col items-center">
          <span className="bg-gray-900 text-white px-2 py-1 rounded">{padNumber(timeLeft.minutes)}</span>
          <span className="text-xs text-gray-500 mt-1">Mins</span>
        </div>
        <span className="text-gray-400">:</span>
        <div className="flex flex-col items-center">
          <span className="bg-gray-900 text-white px-2 py-1 rounded">{padNumber(timeLeft.seconds)}</span>
          <span className="text-xs text-gray-500 mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
}
