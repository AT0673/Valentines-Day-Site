import { useState, useEffect, useRef } from 'react';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export function useCountdown(targetDate: Date): CountdownData {
  const [countdown, setCountdown] = useState<CountdownData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  // Use timestamp for stable dependency comparison
  const targetTimestamp = targetDate.getTime();

  useEffect(() => {
    isMountedRef.current = true;
    let timeoutId: number | null = null;

    const calculateCountdown = () => {
      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;

      const now = Date.now();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        if (isMountedRef.current) {
          setCountdown({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isComplete: true,
          });
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (isMountedRef.current) {
        setCountdown({
          days,
          hours,
          minutes,
          seconds,
          isComplete: false,
        });
        timeoutId = setTimeout(calculateCountdown, 1000);
      }
    };

    // Initial calculation
    calculateCountdown();

    return () => {
      isMountedRef.current = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [targetTimestamp]); // Use timestamp instead of Date object for stable comparison

  return countdown;
}
