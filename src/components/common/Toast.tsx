import { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const typeConfig = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-surface border-forest/30 text-ink',
    iconColor: 'text-forest',
    indicator: 'bg-forest',
  },
  error: {
    icon: XCircle,
    bg: 'bg-surface border-status-error/30 text-ink',
    iconColor: 'text-status-error',
    indicator: 'bg-status-error',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-surface border-status-warning/30 text-ink',
    iconColor: 'text-status-warning',
    indicator: 'bg-status-warning',
  },
  info: {
    icon: Info,
    bg: 'bg-surface border-border text-ink',
    iconColor: 'text-forest',
    indicator: 'bg-forest',
  },
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const config = typeConfig[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={[
        'flex items-center gap-3 p-3.5 rounded-lg border shadow-editorial-md animate-slide-up',
        'max-w-sm w-full pointer-events-auto bg-surface text-ink text-sm',
        config.bg,
      ].join(' ')}
    >
      <div className={['h-2 w-2 rounded-full flex-shrink-0', config.indicator].join(' ')} />
      <Icon className={['h-4 w-4 flex-shrink-0', config.iconColor].join(' ')} />
      <p className="text-xs font-medium text-ink flex-1 leading-snug">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-ink-muted hover:text-ink p-1 rounded transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
