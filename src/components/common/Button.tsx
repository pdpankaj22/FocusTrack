import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'subtle' | 'terracotta';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-forest text-white hover:bg-forest-hover active:bg-[#34432E] focus-visible:ring-forest shadow-editorial border border-transparent disabled:bg-[#B5C5A5] disabled:cursor-not-allowed',
  secondary:
    'bg-surface text-ink border border-border hover:bg-surface-secondary hover:border-border-strong active:bg-surface-tertiary focus-visible:ring-forest shadow-editorial disabled:opacity-50 disabled:cursor-not-allowed',
  terracotta:
    'bg-terracotta text-white hover:bg-terracotta-hover active:bg-[#8C4D32] focus-visible:ring-terracotta shadow-editorial border border-transparent disabled:opacity-50',
  danger:
    'bg-status-error text-white hover:bg-[#A35247] active:bg-[#8E443B] focus-visible:ring-status-error shadow-editorial border border-transparent disabled:opacity-50',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-secondary active:bg-surface-tertiary focus-visible:ring-forest disabled:opacity-40',
  success:
    'bg-status-success text-white hover:bg-[#435D3E] focus-visible:ring-status-success shadow-editorial border border-transparent disabled:opacity-50',
  subtle:
    'bg-forest-light text-forest-dark hover:bg-[#DCE3D4] active:bg-[#D0D9C6] focus-visible:ring-forest border border-forest/10 disabled:opacity-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
  md: 'px-3.5 py-2 text-sm font-medium gap-2',
  lg: 'px-5 py-2.5 text-sm sm:text-base font-medium gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center rounded-md font-sans',
        'transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
