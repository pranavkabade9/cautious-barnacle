/**
 * Firestore database operations
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Add a new timetable entry
 */
export const addTimetableEntry = async (userId, data) => {
  try {
    const docRef = await addDoc(collection(db, 'timetables'), {
      ...data,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to add timetable: ${error.message}`);
  }
};

/**
 * Fetch timetables for a user
 */
export const fetchTimetables = async (userId) => {
  try {
    const q = query(collection(db, 'timetables'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch timetables: ${error.message}`);
  }
};

/**
 * Real-time subscription to timetables
 */
export const subscribeToTimetables = (userId, callback) => {
  const q = query(collection(db, 'timetables'), where('userId', '==', userId));
  return onSnapshot(
    q,
    snapshot => {
      const timetables = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(timetables);
    },
    error => {
      console.error('Error fetching timetables:', error.message);
      callback([]);
    }
  );
};

/**
 * Update timetable entry
 */
export const updateTimetableEntry = async (docId, data) => {
  try {
    await updateDoc(doc(db, 'timetables', docId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to update timetable: ${error.message}`);
  }
};

/**
 * Delete timetable entry
 */
export const deleteTimetableEntry = async (docId) => {
  try {
    await deleteDoc(doc(db, 'timetables', docId));
  } catch (error) {
    throw new Error(`Failed to delete timetable: ${error.message}`);
  }
};

/**
 * Add a new event
 */
export const addEvent = async (userId, data) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...data,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to add event: ${error.message}`);
  }
};

/**
 * Fetch events for a user
 */
export const fetchEvents = async (userId) => {
  try {
    const q = query(collection(db, 'events'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
};

/**
 * Real-time subscription to events
 */
export const subscribeToEvents = (userId, callback) => {
  const q = query(collection(db, 'events'), where('userId', '==', userId));
  return onSnapshot(
    q,
    snapshot => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(events);
    },
    error => {
      console.error('Error fetching events:', error.message);
      callback([]);
    }
  );
};

/**
 * Update event
 */
export const updateEvent = async (docId, data) => {
  try {
    await updateDoc(doc(db, 'events', docId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (docId) => {
  try {
    await deleteDoc(doc(db, 'events', docId));
  } catch (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
};

/**
 * Add a custom task
 */
export const addCustomTask = async (userId, data) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...data,
      userId,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to add task: ${error.message}`);
  }
};

/**
 * Fetch custom tasks for a user
 */
export const fetchTasks = async (userId) => {
  try {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
};

/**
 * Real-time subscription to tasks
 */
export const subscribeToTasks = (userId, callback) => {
  const q = query(collection(db, 'tasks'), where('userId', '==', userId));
  return onSnapshot(
    q,
    snapshot => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(tasks);
    },
    error => {
      console.error('Error fetching tasks:', error.message);
      callback([]);
    }
  );
};

/**
 * Update task
 */
export const updateTask = async (docId, data) => {
  try {
    await updateDoc(doc(db, 'tasks', docId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
};

/**
 * Delete task
 */
export const deleteTask = async (docId) => {
  try {
    await deleteDoc(doc(db, 'tasks', docId));
  } catch (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
};

/**
 * Check for time conflicts in timetable
 * Returns all conflicting entries
 */
export const checkTimeConflict = async (userId, day, startTime, endTime, room, excludeId = null) => {
  try {
    const timetables = await fetchTimetables(userId);
    const conflicts = timetables.filter(t => {
      if (excludeId && t.id === excludeId) return false;

      const sameDay = t.day === day;
      const sameRoom = t.room?.toLowerCase() === room?.toLowerCase();

      if (!sameDay || !sameRoom) return false;

      const newStart = new Date(`2024-01-01 ${startTime}`);
      const newEnd = new Date(`2024-01-01 ${endTime}`);
      const existingStart = new Date(`2024-01-01 ${t.startTime}`);
      const existingEnd = new Date(`2024-01-01 ${t.endTime}`);

      return newStart < existingEnd && newEnd > existingStart;
    });

    return conflicts;
  } catch (error) {
    throw new Error(`Failed to check conflicts: ${error.message}`);
  }
};
