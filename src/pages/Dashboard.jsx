/**
 * Dashboard - Main application page
 * Displays timetable, events, and tasks with stable global modal/search UX.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Calendar, CheckCircle, ClipboardList, LogOut, Search, Settings, Star, X } from 'lucide-react';
import {
  FloatingMenu,
  Modal,
  TimetableForm,
  EventForm,
  CustomTaskForm,
  TimetableGrid,
  EventsList,
  TasksList,
  useModalManager,
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
import { logoutUser } from '../firebase/auth';

const SearchPanel = ({ isOpen, query, items, onClear, onClose, onPreview }) => {
  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;
  const filteredItems = hasQuery
    ? items.filter((item) => item.searchText.includes(query.trim().toLowerCase()))
    : items;

  const groups = [
    { title: 'Recent Clips', icon: ClipboardList, items: filteredItems.slice(0, 4) },
    { title: 'Recent Notes', icon: BookOpen, items: filteredItems.filter((item) => item.type === 'task').slice(0, 4) },
    { title: 'Pinned Items', icon: Star, items: filteredItems.filter((item) => item.pinned).slice(0, 4) },
    { title: 'Recently Saved', icon: CheckCircle, items: filteredItems.slice(0, 6) },
  ];

  return (
    <div className="absolute left-0 right-0 top-full z-30 mt-3 rounded-3xl border border-white/70 bg-white/95 p-3 shadow-2xl shadow-slate-900/15 backdrop-blur-xl animate-searchIn">
      <div className="max-h-[min(28rem,65vh)] overflow-y-auto pr-1">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <section key={group.title} className="mb-3 last:mb-0">
              <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Icon size={14} />
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.length ? group.items.map((item) => (
                  <button
                    key={`${group.title}-${item.id}`}
                    type="button"
                    onClick={() => onPreview(item)}
                    className="w-full rounded-2xl px-3 py-2 text-left transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="truncate text-xs text-slate-500">{item.subtitle}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">
                        {item.type}
                      </span>
                    </div>
                  </button>
                )) : (
                  <p className="rounded-2xl px-3 py-2 text-sm text-slate-400">No matching items.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
        <span>Press Esc to close</span>
        <button type="button" onClick={onClear} className="font-semibold text-blue-600 hover:text-blue-700">
          Clear and close
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ user, userRole, onLogout }) => {
  const [activeTab, setActiveTab] = useState('timetable');
  const [openModal, setOpenModal] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const { requestSurface, releaseSurface } = useModalManager();

  const { timetables, loading: loadingTimetables } = useTimetables(user?.uid);
  const { events, loading: loadingEvents } = useEvents(user?.uid);
  const { tasks, loading: loadingTasks } = useTasks(user?.uid);
  const { conflicts, checkConflict } = useCheckConflict(user?.uid);

  const isAdmin = userRole === 'admin';

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    searchInputRef.current?.blur();
  }, []);

  useEffect(() => {
    if (!searchOpen) return undefined;

    requestSurface({ id: 'dashboard-search', type: 'search', onClose: closeSearch });

    const handlePointerDown = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      releaseSurface('dashboard-search');
    };
  }, [closeSearch, releaseSurface, requestSurface, searchOpen]);

  useEffect(() => {
    closeSearch();
  }, [activeTab, closeSearch]);

  const searchItems = useMemo(() => {
    const timetableItems = timetables.map((entry) => ({
      id: `timetable-${entry.id}`,
      type: 'timetable',
      title: entry.subject || 'Untitled class',
      subtitle: `${entry.day || 'Any day'} • ${entry.room || 'No room'} • ${entry.faculty || 'No faculty'}`,
      body: `${entry.subject || ''}\n${entry.faculty || ''}\n${entry.day || ''} ${entry.startTime || ''} - ${entry.endTime || ''}\n${entry.room || ''}`,
      pinned: Boolean(entry.room),
      original: entry,
    }));

    const eventItems = events.map((event) => ({
      id: `event-${event.id}`,
      type: 'event',
      title: event.title || 'Untitled event',
      subtitle: `${event.date || 'No date'} • ${event.time || 'No time'}`,
      body: event.description || 'No description added.',
      pinned: Boolean(event.date),
      original: event,
    }));

    const taskItems = tasks.map((task) => ({
      id: `task-${task.id}`,
      type: 'task',
      title: task.title || 'Untitled task',
      subtitle: `${task.priority || 'normal'} priority${task.dueDate ? ` • due ${task.dueDate}` : ''}`,
      body: task.notes || 'No notes added.',
      pinned: task.priority === 'high',
      original: task,
    }));

    return [...timetableItems, ...eventItems, ...taskItems].map((item) => ({
      ...item,
      searchText: `${item.title} ${item.subtitle} ${item.body}`.toLowerCase(),
    }));
  }, [events, tasks, timetables]);

  const handleMenuSelect = async (option) => {
    closeSearch();
    setPreviewItem(null);
    setOpenModal(option);
  };

  const handleAddTimetable = async (formData) => {
    setLoading(true);
    try {
      await checkConflict(formData.day, formData.startTime, formData.endTime, formData.room);
      await addTimetableEntry(user.uid, formData);
      setOpenModal(null);
    } catch (error) {
      alert('Error adding timetable: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
      closeSearch();
      await logoutUser();
      onLogout();
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  const profileName = user?.displayName || user?.email?.split('@')[0] || 'Profile';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 font-sans text-slate-900">
      <FloatingMenu onSelectOption={handleMenuSelect} />

      {searchOpen && (
        <div className="pointer-events-none fixed inset-0 z-20 bg-white/20 backdrop-blur-[3px]" aria-hidden="true" />
      )}

      <header className="sticky top-0 z-10 border-b border-white/70 bg-white/75 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Cloud Clipboard</h1>
            <p className="mt-1 text-sm text-slate-500">Unified clips, notes, schedules, and tasks</p>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:max-w-3xl lg:flex-row lg:items-center lg:justify-end">
            <div ref={searchRef} className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={18} />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search clips, notes, events..."
                className="h-12 w-full rounded-2xl border border-white/70 bg-white/90 pl-11 pr-12 text-sm shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10"
                aria-expanded={searchOpen}
                aria-controls="dashboard-search-panel"
              />
              {(searchOpen || searchQuery) && (
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Clear search and close suggestions"
                >
                  <X size={17} />
                </button>
              )}
              <div id="dashboard-search-panel">
                <SearchPanel
                  isOpen={searchOpen}
                  query={searchQuery}
                  items={searchItems}
                  onClear={closeSearch}
                  onClose={closeSearch}
                  onPreview={(item) => {
                    closeSearch();
                    setPreviewItem(item);
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                closeSearch();
                setOpenModal('profile');
              }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 lg:min-w-56"
              aria-label="Open profile and settings"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-500/20">
                {profileName.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">{profileName}</span>
                <span className="block truncate text-xs text-slate-500">{isAdmin ? 'Admin' : 'Student'} • Settings</span>
              </span>
              <Settings size={18} className="text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex w-full flex-wrap gap-2 rounded-2xl border border-white/70 bg-white/80 p-2 shadow-sm backdrop-blur md:w-fit">
          {[
            { id: 'timetable', label: 'Timetable', icon: BookOpen },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'tasks', label: 'Tasks', icon: ClipboardList },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium transition md:flex-none ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'timetable' && (
          <TimetableGrid
            timetables={timetables}
            loading={loadingTimetables}
            isAdmin={isAdmin}
            onEdit={(entry) => console.log('Edit timetable:', entry)}
            onDelete={handleDeleteTimetable}
            onExpand={(entry) => setPreviewItem(searchItems.find((item) => item.id === `timetable-${entry.id}`))}
          />
        )}

        {activeTab === 'events' && (
          <EventsList
            events={events}
            loading={loadingEvents}
            isAdmin={isAdmin}
            onEdit={(event) => console.log('Edit event:', event)}
            onDelete={handleDeleteEvent}
            onExpand={(event) => setPreviewItem(searchItems.find((item) => item.id === `event-${event.id}`))}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksList
            tasks={tasks}
            loading={loadingTasks}
            isAdmin={isAdmin}
            onEdit={(task) => console.log('Edit task:', task)}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleTaskComplete}
            onExpand={(task) => setPreviewItem(searchItems.find((item) => item.id === `task-${task.id}`))}
          />
        )}
      </main>

      <Modal isOpen={openModal === 'profile'} title="Profile & Settings" onClose={() => setOpenModal(null)} size="lg">
        <div className="space-y-5">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur">
                {profileName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-bold">{profileName}</p>
                <p className="truncate text-sm text-blue-100">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{isAdmin ? 'Admin' : 'Student'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">Cloud Clipboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </Modal>

      <Modal isOpen={openModal === 'timetable'} title="Add Timetable Entry" onClose={() => setOpenModal(null)} size="md">
        <TimetableForm onSubmit={handleAddTimetable} onCancel={() => setOpenModal(null)} loading={loading} conflicts={conflicts} />
      </Modal>

      <Modal isOpen={openModal === 'event'} title="Add Event" onClose={() => setOpenModal(null)} size="md">
        <EventForm onSubmit={handleAddEvent} onCancel={() => setOpenModal(null)} loading={loading} />
      </Modal>

      <Modal isOpen={openModal === 'task'} title="Create Custom Task" onClose={() => setOpenModal(null)} size="md">
        <CustomTaskForm onSubmit={handleAddTask} onCancel={() => setOpenModal(null)} loading={loading} />
      </Modal>

      <Modal
        isOpen={Boolean(previewItem)}
        title={previewItem?.title || 'Expanded View'}
        onClose={() => setPreviewItem(null)}
        size="fullscreen"
        variant="sheet"
      >
        {previewItem && (
          <article className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700">{previewItem.type}</span>
              <span className="text-sm text-slate-500">{previewItem.subtitle}</span>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{previewItem.body}</pre>
            </div>
          </article>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
