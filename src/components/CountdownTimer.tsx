import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { formatTime } from '../lib/utils';

interface CountdownTimerProps {
  endTime: Date;
  onComplete?: () => void;
}

export function CountdownTimer({ endTime, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - Date.now();
      setTimeLeft(Math.max(0, difference));

      if (difference <= 0 && onComplete) {
        onComplete();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 10);

    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  const progress = ((endTime.getTime() - Date.now()) / (48 * 3600000)) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Timer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Hackathon Countdown</h2>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:text-blue-200 dark:bg-blue-800">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
              {Math.max(0, Math.min(100, progress)).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900">
          <div
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          />
        </div>
      </div>
      <div className="text-4xl font-mono text-center font-bold text-gray-800 dark:text-white tracking-wider">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
}