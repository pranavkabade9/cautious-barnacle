/**
 * TimetableForm Component - Form for adding/editing timetable entries
 */

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { validateTimetableForm } from '../utils/validation';
import { getDaysOfWeek } from '../utils/formatters';

const TimetableForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  loading = false,
  conflicts = [],
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      subject: '',
      faculty: '',
      day: '',
      startTime: '',
      endTime: '',
      room: '',
    }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateTimetableForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Check for conflicts warning
    if (conflicts.length > 0) {
      const confirmSubmit = window.confirm(
        `${conflicts.length} conflict(s) found in this time slot. Continue anyway?`
      );
      if (!confirmSubmit) return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Subject Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject Name
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g., Thermodynamics"
          className="input-field"
          disabled={loading}
        />
        {errors.subject && (
          <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
        )}
      </div>

      {/* Faculty Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Faculty Name
        </label>
        <input
          type="text"
          name="faculty"
          value={formData.faculty}
          onChange={handleChange}
          placeholder="e.g., Prof. Sharma"
          className="input-field"
          disabled={loading}
        />
        {errors.faculty && (
          <p className="text-red-500 text-sm mt-1">{errors.faculty}</p>
        )}
      </div>

      {/* Day */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Day
        </label>
        <select
          name="day"
          value={formData.day}
          onChange={handleChange}
          className="input-field"
          disabled={loading}
        >
          <option value="">Select a day</option>
          {getDaysOfWeek().map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        {errors.day && (
          <p className="text-red-500 text-sm mt-1">{errors.day}</p>
        )}
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
          />
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
          />
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>

      {/* Time range validation error */}
      {errors.timeRange && (
        <p className="text-red-500 text-sm">{errors.timeRange}</p>
      )}

      {/* Room / Lab */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room / Lab
        </label>
        <input
          type="text"
          name="room"
          value={formData.room}
          onChange={handleChange}
          placeholder="e.g., Room 203 or Lab A"
          className="input-field"
          disabled={loading}
        />
        {errors.room && (
          <p className="text-red-500 text-sm mt-1">{errors.room}</p>
        )}
      </div>

      {/* Conflicts Warning */}
      {conflicts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
          <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Time Conflict Warning</p>
            <p className="text-sm text-yellow-700">{conflicts.length} existing entry(ies) in this time slot</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Timetable'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 btn-secondary disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TimetableForm;
