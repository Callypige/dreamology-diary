// src/components/ui/Toast.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { TbX, TbCheck, TbExclamationMark, TbInfoCircle } from 'react-icons/tb';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, isVisible, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-600 text-green-100';
      case 'error':
        return 'bg-red-900/90 border-red-600 text-red-100';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-600 text-yellow-100';
      case 'info':
        return 'bg-blue-900/90 border-blue-600 text-blue-100';
      default:
        return 'bg-slate-900/90 border-slate-600 text-slate-100';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <TbCheck className="w-5 h-5 text-green-400" />;
      case 'error':
        return <TbX className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <TbExclamationMark className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <TbInfoCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className={`
        ${getToastStyles()}
        border rounded-lg p-4 shadow-xl backdrop-blur-sm
        max-w-md flex items-start gap-3
        transition-all duration-300 ease-out
      `}>
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          <TbX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Hook to manage toast state
export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  };
}