import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  error,
  className = '',
  ...props
}) => {
  const baseStyles = 'block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-darkCard dark:text-darkText dark:ring-darkBorder dark:focus:ring-primary';
  const errorStyles = error ? 'ring-red-500 focus:ring-red-500' : '';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 dark:text-darkText">
          {label}
        </label>
      )}
      <div className="mt-1">
        <textarea
          id={id}
          rows={props.rows || 3}
          className={`${baseStyles} ${errorStyles}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
