/**
 * Validation utilities
 */

/**
 * Validate time format (HH:MM)
 */
export const isValidTimeFormat = (time) => {
  return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (date) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

/**
 * Check if start time is before end time
 */
export const isStartBeforeEnd = (startTime, endTime) => {
  const start = new Date(`2024-01-01 ${startTime}`);
  const end = new Date(`2024-01-01 ${endTime}`);
  return start < end;
};

/**
 * Validate timetable form data
 */
export const validateTimetableForm = (data) => {
  const errors = {};

  if (!data.subject?.trim()) {
    errors.subject = 'Subject name is required';
  }

  if (!data.faculty?.trim()) {
    errors.faculty = 'Faculty name is required';
  }

  if (!data.day) {
    errors.day = 'Day is required';
  }

  if (!data.startTime) {
    errors.startTime = 'Start time is required';
  } else if (!isValidTimeFormat(data.startTime)) {
    errors.startTime = 'Invalid time format';
  }

  if (!data.endTime) {
    errors.endTime = 'End time is required';
  } else if (!isValidTimeFormat(data.endTime)) {
    errors.endTime = 'Invalid time format';
  }

  if (data.startTime && data.endTime) {
    if (!isStartBeforeEnd(data.startTime, data.endTime)) {
      errors.timeRange = 'Start time must be before end time';
    }
  }

  if (!data.room?.trim()) {
    errors.room = 'Room/Lab is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate event form data
 */
export const validateEventForm = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Event title is required';
  }

  if (!data.date) {
    errors.date = 'Date is required';
  } else if (!isValidDateFormat(data.date)) {
    errors.date = 'Invalid date format (YYYY-MM-DD)';
  }

  if (!data.time) {
    errors.time = 'Time is required';
  } else if (!isValidTimeFormat(data.time)) {
    errors.time = 'Invalid time format (HH:MM)';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate custom task form data
 */
export const validateTaskForm = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Task title is required';
  }

  if (!data.notes?.trim()) {
    errors.notes = 'Notes are required';
  }

  if (data.dueDate && !isValidDateFormat(data.dueDate)) {
    errors.dueDate = 'Invalid date format (YYYY-MM-DD)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
