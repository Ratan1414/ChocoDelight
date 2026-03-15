import React from 'react';

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-xl transition focus:outline-none focus:ring-2 focus:ring-chocolate-500/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const variants = {
    primary:
      'bg-chocolate-700 text-cream hover:bg-chocolate-800 focus:ring-chocolate-400',
    secondary:
      'bg-chocolate-100 text-chocolate-800 hover:bg-chocolate-200 focus:ring-chocolate-300',
    outline:
      'border border-chocolate-200 text-chocolate-700 hover:bg-chocolate-50 focus:ring-chocolate-300',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    ghost:
      'bg-transparent text-chocolate-700 hover:bg-chocolate-50 focus:ring-chocolate-200',
  };

  const variantClass = variants[variant] ?? variants.primary;
  const sizeClass = sizes[size] ?? sizes.md;

  return (
    <button
      type={type}
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}
