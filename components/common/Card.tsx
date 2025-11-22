import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  value?: string | number;
  icon?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, value, icon }) => {
  return (
    <div
      className={`bg-darkCard rounded-xl shadow-lg border border-darkBorder p-6 transition-all duration-300 ${className}`}
    >
      {title && value !== undefined ? ( // For dashboard stats cards
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
            <p className="text-3xl font-bold text-darkText">{value}</p>
          </div>
          {icon && <div className="text-primary opacity-70">{icon}</div>}
        </div>
      ) : ( // For general content cards
        <>
          {title && <h3 className="text-xl font-semibold text-darkText mb-4">{title}</h3>}
          {children}
        </>
      )}
    </div>
  );
};