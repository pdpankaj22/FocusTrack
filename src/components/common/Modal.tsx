import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Modal({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Editorial warm darkened backdrop */}
      <div
        className="absolute inset-0 bg-[#252720]/40 backdrop-blur-[2px] transition-opacity animate-fade-in"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={[
          'relative w-full bg-surface rounded-xl border border-border shadow-editorial-lg animate-slide-up overflow-hidden',
          maxWidthClasses[maxWidth],
        ].join(' ')}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-secondary/40">
            <h2 className="font-serif text-lg font-semibold text-ink tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-ink-muted hover:bg-surface-secondary hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
