/**
 * EventsList Component - Display events with Google Calendar integration
 */

import React from 'react';
import { Trash2, Calendar } from 'lucide-react';
import { openGoogleCalendar, generateGoogleCalendarURL } from '../utils/googleCalendar';
import { formatDate, formatTime12Hour } from '../utils/formatters';

const EventsList = ({
  events,
  onEdit,
  onDelete,
  loading = false,
  isAdmin = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">No events yet. Click the + button to add one!</p>
      </div>
    );
  }

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateCompare = new Date(a.date) - new Date(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="space-y-4">
      {sortedEvents.map(event => (
        <div key={event.id} className="card p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <Calendar size={16} />
                <span>{formatDate(event.date)}</span>
                <span className="text-gray-400">•</span>
                <span>{formatTime12Hour(event.time)}</span>
              </div>
              <p className="text-gray-700 mt-3">{event.description}</p>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {/* Google Calendar Integration */}
                <button
                  onClick={() => openGoogleCalendar({
                    title: event.title,
                    date: event.date,
                    startTime: event.time,
                    endTime: event.time, // Same as start for single-time events
                    description: event.description,
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                  title="Add to Google Calendar"
                >
                  <Calendar size={16} />
                  <span>Google Calendar</span>
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => onEdit(event)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
