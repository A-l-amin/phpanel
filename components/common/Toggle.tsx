import React from 'react';

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  id,
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
          />
          <div
            className={`block ${checked ? 'bg-primary' : 'bg-gray-600 dark:bg-gray-700'} w-14 h-8 rounded-full transition-all duration-300 ease-in-out ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all duration-300 ease-in-out ${checked ? 'translate-x-full' : ''}`}
          ></div>
        </div>
        {label && <span className="ml-3 text-gray-900 dark:text-darkText text-sm font-medium">{label}</span>}
      </label>
    </div>
  );
};
