/**
 * Modal Component - Reusable, managed modal for forms, profile, and previews.
 */

import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useModalManager } from './ModalProvider';

const getFocusableElements = (node) => {
  if (!node) return [];
  return Array.from(
    node.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'));
};

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  size = 'md',
  variant = 'dialog',
  closeLabel = 'Close modal',
}) => {
  const generatedId = useId();
  const modalId = `modal-${generatedId}`;
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const touchStartYRef = useRef(null);
  const { requestSurface, releaseSurface } = useModalManager();

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    requestSurface({ id: modalId, type: 'modal', onClose });

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusTimer = window.setTimeout(() => {
      const focusable = getFocusableElements(panelRef.current);
      (focusable[0] || panelRef.current)?.focus?.();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.('escape');
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(panelRef.current);
      if (!focusable.length) {
        event.preventDefault();
        panelRef.current?.focus?.();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      releaseSurface(modalId);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, modalId, onClose, releaseSurface, requestSurface]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    fullscreen: 'max-w-5xl',
  };

  const panelClasses = variant === 'sheet'
    ? 'fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:top-5 sm:bottom-5 sm:w-full sm:max-w-xl'
    : `relative w-full mx-4 ${sizeClasses[size] || sizeClasses.md}`;

  const handleOverlayPointerDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.('outside');
    }
  };

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event) => {
    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartYRef.current = null;

    if (typeof startY === 'number' && typeof endY === 'number' && endY - startY > 80) {
      onClose?.('swipe');
    }
  };

  const modalMarkup = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/25 p-4 backdrop-blur-[10px] animate-overlayIn"
      onMouseDown={handleOverlayPointerDown}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${modalId}-title`}
        tabIndex={-1}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`${panelClasses} max-h-[92vh] overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-2xl shadow-slate-900/20 backdrop-blur-xl outline-none animate-modalIn`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 px-5 py-4 sm:px-6">
          <div>
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" aria-hidden="true" />
            <h2 id={`${modalId}-title`} className="text-xl font-semibold text-slate-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={() => onClose?.('button')}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={closeLabel}
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[calc(92vh-4.75rem)] overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
};

export default Modal;
