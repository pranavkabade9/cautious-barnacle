/**
 * Dashboard - Main application page
 * Displays timetable, events, and tasks
 */

import React, { useState } from 'react';
import { LogOut, BookOpen, Calendar, ClipboardList } from 'lucide-react';
import {
  FloatingMenu,
  Modal,
  TimetableForm,
  EventForm,
  CustomTaskForm,
  TimetableGrid,
  EventsList,
  TasksList,
} from '../components';
import {
  addTimetableEntry,
  addEvent,
  addCustomTask,
  deleteTimetableEntry,
  deleteEvent,
  deleteTask,
  updateTask,
} from '../firebase/firestore';
import { useTimetables, useEvents, useTasks, useCheckConflict } from '../hooks/useFirestore';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../firebase/auth';

const Dashboard = ({ user, userRole, onLogout }) => {
  const [activeTab, setActiveTab] = useState('timetable'); // timetable, events, tasks
  const [openModal, setOpenModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data
  const { timetables, loading: loadingTimetables } = useTimetables(user?.uid);
  const { events, loading: loadingEvents } = useEvents(user?.uid);
  const { tasks, loading: loadingTasks } = useTasks(user?.uid);
  const { conflicts, checkConflict } = useCheckConflict(user?.uid);

  const isAdmin = userRole === 'admin';

  // Handle floating menu selection
  const handleMenuSelect = async (option) => {
    setOpenModal(option);
  };

  // Handle timetable form submission
  const handleAddTimetable = async (formData) => {
    setLoading(true);
    try {
      // Check conflicts
      const conflictResults = await checkConflict(
        formData.day,
        formData.startTime,
        formData.endTime,
        formData.room
      );

      await addTimetableEntry(user.uid, formData);
      setOpenModal(null);
    } catch (error) {
      alert('Error adding timetable: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle event form submission
  const handleAddEvent = async (formData) => {
    setLoading(true);
    try {
      await addEvent(user.uid, formData);
      setOpenModal(null);
    } catch (error) {
      alert('Error adding event: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle task form submission
  const handleAddTask = async (formData) => {
    setLoading(true);
    try {
      await addCustomTask(user.uid, formData);
      setOpenModal(null);
    } catch (error) {
      alert('Error adding task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete operations
  const handleDeleteTimetable = async (id) => {
    if (!confirm('Delete this timetable entry?')) return;
    try {
      await deleteTimetableEntry(id);
    } catch (error) {
      alert('Error deleting timetable: ' + error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
    } catch (error) {
      alert('Error deleting event: ' + error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
    } catch (error) {
      alert('Error deleting task: ' + error.message);
    }
  };

  const handleToggleTaskComplete = async (id, completed) => {
    try {
      await updateTask(id, { completed });
    } catch (error) {
      alert('Error updating task: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Floating Menu - Fixed at top-left */}
      <FloatingMenu onSelectOption={handleMenuSelect} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">College Scheduling</h1>
            <p className="text-gray-600 text-sm mt-1">
              {user?.email} • {isAdmin ? 'Admin' : 'Student'} Role
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow-sm p-2 w-fit">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'timetable'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookOpen size={18} />
            Timetable
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar size={18} />
            Events
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ClipboardList size={18} />
            Tasks
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'timetable' && (
          <div>
            <TimetableGrid
              timetables={timetables}
              loading={loadingTimetables}
              isAdmin={isAdmin}
              onEdit={(entry) => {
                // Edit functionality can be extended
                console.log('Edit timetable:', entry);
              }}
              onDelete={handleDeleteTimetable}
            />
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <EventsList
              events={events}
              loading={loadingEvents}
              isAdmin={isAdmin}
              onEdit={(event) => {
                // Edit functionality can be extended
                console.log('Edit event:', event);
              }}
              onDelete={handleDeleteEvent}
            />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <TasksList
              tasks={tasks}
              loading={loadingTasks}
              isAdmin={isAdmin}
              onEdit={(task) => {
                // Edit functionality can be extended
                console.log('Edit task:', task);
              }}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleTaskComplete}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={openModal === 'timetable'}
        title="Add Timetable Entry"
        onClose={() => setOpenModal(null)}
        size="md"
      >
        <TimetableForm
          onSubmit={handleAddTimetable}
          onCancel={() => setOpenModal(null)}
          loading={loading}
          conflicts={conflicts}
        />
      </Modal>

      <Modal
        isOpen={openModal === 'event'}
        title="Add Event"
        onClose={() => setOpenModal(null)}
        size="md"
      >
        <EventForm
          onSubmit={handleAddEvent}
          onCancel={() => setOpenModal(null)}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={openModal === 'task'}
        title="Create Custom Task"
        onClose={() => setOpenModal(null)}
        size="md"
      >
        <CustomTaskForm
          onSubmit={handleAddTask}
          onCancel={() => setOpenModal(null)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
