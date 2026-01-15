/**
 * useFirestore - Custom hook for Firestore operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToTimetables,
  subscribeToEvents,
  subscribeToTasks,
  fetchTimetables,
  fetchEvents,
  fetchTasks,
  checkTimeConflict,
} from '../firebase/firestore';

/**
 * Hook for timetable data
 */
export const useTimetables = (userId) => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setTimetables([]);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = subscribeToTimetables(userId, (data) => {
        setTimetables(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [userId]);

  return { timetables, loading, error };
};

/**
 * Hook for events data
 */
export const useEvents = (userId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = subscribeToEvents(userId, (data) => {
        setEvents(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [userId]);

  return { events, loading, error };
};

/**
 * Hook for tasks data
 */
export const useTasks = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = subscribeToTasks(userId, (data) => {
        setTasks(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [userId]);

  return { tasks, loading, error };
};

/**
 * Hook to check time conflicts
 */
export const useCheckConflict = (userId) => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkConflict = useCallback(
    async (day, startTime, endTime, room, excludeId = null) => {
      setLoading(true);
      try {
        const results = await checkTimeConflict(userId, day, startTime, endTime, room, excludeId);
        setConflicts(results);
        return results;
      } catch (error) {
        console.error('Error checking conflicts:', error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { conflicts, loading, checkConflict };
};
