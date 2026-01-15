/**
 * FloatingMenu Component - Floating action button with dropdown menu
 * Positioned at TOP-LEFT corner
 */

import React, { useState, useRef, useEffect } from 'react';
import { Plus, BookOpen, Calendar, ClipboardList } from 'lucide-react';

const FloatingMenu = ({ onSelectOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      id: 'timetable',
      label: 'Add Timetable',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      id: 'event',
      label: 'Add Event',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      id: 'task',
      label: 'Custom Task',
      icon: ClipboardList,
      color: 'text-purple-600',
    },
  ];

  const handleSelectOption = (option) => {
    onSelectOption(option);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-6 left-6 z-40" ref={menuRef}>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Open menu"
      >
        <Plus size={24} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectOption(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
              >
                <IconComponent size={18} className={item.color} />
                <span className="text-gray-700 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FloatingMenu;
