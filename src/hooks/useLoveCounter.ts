import { useState, useEffect } from 'react';

interface LoveCounterData {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useLoveCounter(startDate: Date): LoveCounterData {
  const [counter, setCounter] = useState<LoveCounterData>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      // Calculate time units
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      // Calculate years and months more accurately
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();

      if (months < 0) {
        years--;
        months += 12;
      }

      // Adjust for day of month
      if (now.getDate() < startDate.getDate()) {
        months--;
        if (months < 0) {
          years--;
          months += 12;
        }
      }

      // Calculate remaining days in current month
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      let remainingDays = now.getDate() - startDate.getDate();
      if (remainingDays < 0) {
        remainingDays += lastDayOfMonth;
      }

      setCounter({
        years,
        months,
        days: remainingDays,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };

    // Calculate immediately
    calculateTime();

    // Update every second
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return counter;
}
