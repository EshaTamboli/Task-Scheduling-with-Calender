/**
 * Format a date to display in various formats
 */
export const formatDate = (date: Date | string, format: string = 'full'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'full':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    case 'month':
      return d.toLocaleDateString('en-US', { month: 'long' });
    case 'monthYear':
      return d.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'iso':
      return d.toISOString();
    case 'yearMonthDay':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    default:
      return d.toLocaleString();
  }
};

/**
 * Get all days in a month
 */
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  
  return days;
};

/**
 * Generate calendar days including padding from previous/next months
 */
export const getCalendarDays = (year: number, month: number): Date[] => {
  const days = getDaysInMonth(year, month);
  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  
  // Add days from previous month to fill the first week
  const daysToAddBefore = firstDay.getDay();
  for (let i = daysToAddBefore - 1; i >= 0; i--) {
    const prevDate = new Date(firstDay);
    prevDate.setDate(prevDate.getDate() - (i + 1));
    days.unshift(prevDate);
  }
  
  // Add days from next month to fill the last week
  const daysToAddAfter = 6 - lastDay.getDay();
  for (let i = 1; i <= daysToAddAfter; i++) {
    const nextDate = new Date(lastDay);
    nextDate.setDate(nextDate.getDate() + i);
    days.push(nextDate);
  }
  
  return days;
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Get the week days (Sun-Sat)
 */
export const getWeekDays = (short: boolean = false): string[] => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return short ? weekdays.map(day => day.substring(0, 3)) : weekdays;
};

/**
 * Get today's date at midnight
 */
export const getTodayStart = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};