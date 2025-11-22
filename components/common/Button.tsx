import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  let baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variantStyles = '';
  let sizeStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 dark:shadow-primary/30 focus:ring-primary';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-700 hover:bg-gray-600 text-white dark:bg-gray-600 dark:hover:bg-gray-500 focus:ring-gray-500';
      break;
    case 'danger':
      variantStyles = 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 dark:shadow-red-600/30 focus:ring-red-500';
      break;
    case 'outline':
      variantStyles = 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary';
      break;
  }

  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-sm';
      if (icon && children) sizeStyles += ' space-x-1.5';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-base';
      if (icon && children) sizeStyles += ' space-x-2';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3 text-lg';
      if (icon && children) sizeStyles += ' space-x-2.5';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
