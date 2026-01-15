/**
 * Date and time formatting utilities
 */

/**
 * Format time range
 */
export const formatTimeRange = (startTime, endTime) => {
  return `${startTime} – ${endTime}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get day name from date
 */
export const getDayName = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

/**
 * Get week of the month (1-5)
 */
export const getWeekOfMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
};

/**
 * Get start and end of week
 */
export const getWeekDates = (date = new Date()) => {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay();

  const weekStart = new Date(curr.setDate(first));
  const weekEnd = new Date(curr.setDate(first + 6));

  return {
    start: weekStart.toISOString().split('T')[0],
    end: weekEnd.toISOString().split('T')[0],
  };
};

/**
 * Get all days of the week
 */
export const getDaysOfWeek = () => {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
};

/**
 * Convert 24-hour time to 12-hour format
 */
export const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
