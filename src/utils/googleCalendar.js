/**
 * Google Calendar Integration
 * 
 * Uses Google Calendar's URL-based integration (no API key required)
 * Opens Google Calendar in a new tab with pre-filled event details
 */

/**
 * Generate Google Calendar event URL
 * @param {Object} event - Event details
 * @param {string} event.title - Event title
 * @param {string} event.date - Date in YYYY-MM-DD format
 * @param {string} event.startTime - Time in HH:MM format
 * @param {string} event.endTime - Time in HH:MM format
 * @param {string} event.description - Event description
 * @returns {string} Google Calendar URL
 */
export const generateGoogleCalendarURL = ({
  title,
  date,
  startTime,
  endTime,
  description = '',
}) => {
  // Convert date and time to ISO 8601 format for Google Calendar
  const [hours, minutes] = startTime.split(':');
  const startDateTime = new Date(`${date}T${startTime}:00`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDateTime = new Date(`${date}T${endTime}:00`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDateTime}/${endDateTime}`,
    details: description,
    location: '',
  });

  return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
};

/**
 * Open Google Calendar in new tab
 */
export const openGoogleCalendar = (event) => {
  const calendarURL = generateGoogleCalendarURL(event);
  window.open(calendarURL, '_blank');
};

/**
 * Generate Google Calendar icon link for event
 */
export const getGoogleCalendarLink = (event) => {
  return generateGoogleCalendarURL(event);
};
