/**
 * TimetableGrid Component - Weekly timetable grid display
 * Shows student-friendly weekly schedule
 */

import React from 'react';
import { Trash2 } from 'lucide-react';
import { getDaysOfWeek, formatTime12Hour } from '../utils/formatters';

const TimetableGrid = ({
  timetables,
  onEdit,
  onDelete,
  onExpand,
  loading = false,
  isAdmin = false,
}) => {
  const days = getDaysOfWeek();

  // Group timetables by day and time
  const getEntriesForDay = (day) => {
    return timetables
      .filter(t => t.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-600">Loading timetable...</p>
      </div>
    );
  }

  if (timetables.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">No timetable entries yet. Click the + button to add one!</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Weekly Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-px bg-gray-200 min-h-screen">
          {days.map(day => (
            <div key={day} className="bg-white">
              {/* Day Header */}
              <div className="sticky top-0 bg-blue-600 text-white p-4 text-center font-semibold border-b-2 border-blue-200">
                {day}
              </div>

              {/* Day Content */}
              <div className="p-3 space-y-2">
                {getEntriesForDay(day).length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No classes</p>
                ) : (
                  getEntriesForDay(day).map(entry => (
                    <div
                      key={entry.id}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-3 rounded text-sm hover:shadow-md transition-shadow"
                    >
                      <p className="font-semibold text-gray-900 text-xs">{entry.subject}</p>
                      <p className="text-gray-600 text-xs">{entry.faculty}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {formatTime12Hour(entry.startTime)} - {formatTime12Hour(entry.endTime)}
                      </p>
                      <p className="text-gray-500 text-xs">{entry.room}</p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        <button
                          onClick={() => onExpand?.(entry)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                        >
                          Expand
                        </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(entry)}
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(entry.id)}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;
