import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[var(--primary-navy)] text-white hover:bg-[var(--primary-navy-dark)] focus:ring-[var(--primary-navy-light)] active:scale-[0.98] shadow-sm hover:shadow-md',
    secondary: 'bg-[var(--gold-accent)] text-[var(--primary-navy)] hover:bg-[var(--gold-accent-dark)] focus:ring-[var(--gold-accent-light)] active:scale-[0.98] shadow-sm hover:shadow-md',
    outline: 'border-2 border-[var(--primary-navy)] text-[var(--primary-navy)] hover:bg-[var(--primary-navy)] hover:text-white focus:ring-[var(--primary-navy-light)] active:scale-[0.98]',
    ghost: 'text-[var(--primary-navy)] hover:bg-[var(--gray-100)] focus:ring-[var(--gray-300)] active:scale-[0.98]',
    danger: 'bg-[var(--error)] text-white hover:bg-[var(--error-dark)] focus:ring-[var(--error-light)] active:scale-[0.98] shadow-sm hover:shadow-md',
    success: 'bg-[var(--success)] text-white hover:bg-[var(--success-dark)] focus:ring-[var(--success-light)] active:scale-[0.98] shadow-sm hover:shadow-md',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm gap-1.5',
    md: 'px-6 py-3.5 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
