/**
 * useAuth - Custom hook for authentication state and user info
 */

import { useState, useEffect, useContext, createContext } from 'react';
import { auth } from '../firebase/config';
import { watchAuthState, getUserRole } from '../firebase/auth';

const AuthContext = createContext(null);

/**
 * Custom hook to access auth context
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = watchAuthState(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const role = await getUserRole(authUser.uid);
          setUserRole(role);
        } catch (err) {
          setError(err.message);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userRole, loading, error };
};

export { AuthContext };
