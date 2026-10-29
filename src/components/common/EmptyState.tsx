import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg bg-surface-secondary text-ink-muted border border-border">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-base font-semibold text-ink mb-1 tracking-tight">{title}</h3>
      {description && (
        <p className="max-w-sm text-xs text-ink-muted leading-relaxed mb-4">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
