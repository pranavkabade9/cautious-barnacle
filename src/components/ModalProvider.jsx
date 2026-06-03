/**
 * ModalProvider - centralized overlay/surface coordinator.
 * Ensures only one modal, drawer, or lightweight search surface owns focus at a time.
 */

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [activeSurface, setActiveSurface] = useState(null);
  const activeRef = useRef(null);

  const releaseSurface = useCallback((id) => {
    setActiveSurface((current) => {
      if (!current || current.id !== id) return current;
      activeRef.current = null;
      return null;
    });
  }, []);

  const requestSurface = useCallback((surface) => {
    const previous = activeRef.current;

    if (previous && previous.id !== surface.id) {
      previous.onClose?.('replaced');
    }

    activeRef.current = surface;
    setActiveSurface(surface);
  }, []);

  const closeSurface = useCallback((id, reason = 'programmatic') => {
    const current = activeRef.current;
    if (!current || (id && current.id !== id)) return;

    activeRef.current = null;
    setActiveSurface(null);
    current.onClose?.(reason);
  }, []);

  const value = useMemo(
    () => ({ activeSurface, requestSurface, releaseSurface, closeSurface }),
    [activeSurface, requestSurface, releaseSurface, closeSurface]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalManager = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalManager must be used inside ModalProvider');
  }
  return context;
};
