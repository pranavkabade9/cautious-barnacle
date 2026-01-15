/**
 * TasksList Component - Display custom tasks
 */

import React from 'react';
import { Trash2, Edit2, CheckCircle, Circle } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const TasksList = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  loading = false,
  isAdmin = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">No tasks yet. Click the + button to add one!</p>
      </div>
    );
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityDiff = (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    if (priorityDiff !== 0) return priorityDiff;
    return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      {sortedTasks.map(task => (
        <div
          key={task.id}
          className={`card p-4 hover:shadow-md transition-all ${
            task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Completion toggle */}
            <button
              onClick={() => onToggleComplete(task.id, !task.completed)}
              className="text-gray-400 hover:text-blue-600 flex-shrink-0 mt-1"
            >
              {task.completed ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <Circle size={20} />
              )}
            </button>

            {/* Task content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                {task.notes}
              </p>

              {task.dueDate && (
                <p className="text-xs text-gray-500 mt-2">
                  Due: {formatDate(task.dueDate)}
                </p>
              )}

              {/* Action Buttons */}
              {isAdmin && !task.completed && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onEdit(task)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksList;
