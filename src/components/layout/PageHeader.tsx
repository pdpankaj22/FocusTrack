import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 pb-5 mb-6 border-b border-border/80">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-xs sm:text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 self-start sm:self-auto">{actions}</div>}
    </div>
  );
}
