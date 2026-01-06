import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus-visible:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 focus-visible:ring-secondary',
    success: 'bg-success text-white hover:bg-green-600 focus-visible:ring-success',
    warning: 'bg-warning text-white hover:bg-amber-600 focus-visible:ring-warning',
    danger: 'bg-danger text-white hover:bg-red-600 focus-visible:ring-danger',
    ghost: 'bg-transparent hover:bg-neutral-mid/10 focus-visible:ring-neutral-mid',
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };
  
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
