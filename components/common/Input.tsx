import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  icon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-darkCard dark:text-darkText dark:ring-darkBorder dark:focus:ring-primary';
  const errorStyles = error ? 'ring-red-500 focus:ring-red-500' : '';
  const iconPadding = icon ? 'pl-10' : '';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 dark:text-darkText">
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{icon}</span>
          </div>
        )}
        <input
          id={id}
          className={`${baseStyles} ${errorStyles} ${iconPadding}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
