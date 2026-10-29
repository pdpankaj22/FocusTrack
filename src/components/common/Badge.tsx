import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'terracotta';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-secondary text-ink-muted border border-border',
  success: 'bg-forest-light text-forest-dark border border-forest/20',
  warning: 'bg-[#FAF3E8] text-[#8C5D24] border border-[#EADBCA]',
  danger: 'bg-status-error-bg text-status-error border border-status-error/20',
  info: 'bg-surface-secondary text-ink-muted border border-border',
  primary: 'bg-forest-light text-forest-dark border border-forest/25',
  terracotta: 'bg-terracotta-light text-terracotta-dark border border-terracotta/25',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
