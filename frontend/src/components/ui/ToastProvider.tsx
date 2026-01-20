import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Toast from './Toast';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  timestamp: number;
}

interface ToastContextValue {
  queue: ToastItem[];
  enqueueToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
  // Legacy compatibility
  showToast: (message: string, type?: ToastType) => void;
  pushToast: (toast: { message: string; type?: ToastType }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [queue, setQueue] = useState<ToastItem[]>([]);

  const enqueueToast = useCallback((message: string, type: ToastType = 'info') => {
    const newToast: ToastItem = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: Date.now(),
    };

    setQueue((prevQueue) => [...prevQueue, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setQueue((prevQueue) => prevQueue.filter((toast) => toast.id !== id));
  }, []);

  // Legacy compatibility methods
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    enqueueToast(message, type);
  }, [enqueueToast]);

  const pushToast = useCallback((toast: { message: string; type?: ToastType }) => {
    enqueueToast(toast.message, toast.type);
  }, [enqueueToast]);

  const value = useMemo(() => ({
    queue,
    enqueueToast,
    dismissToast,
    showToast,
    pushToast
  }), [queue, enqueueToast, dismissToast, showToast, pushToast]);

  // Only render the first 2 toasts (2-toast limit)
  const visibleToasts = queue.slice(0, 2);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visibleToasts.length > 0 && (
        <div className="toast-container" aria-live="polite" aria-atomic="true">
          {visibleToasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onDismiss={dismissToast}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};
