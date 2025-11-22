import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Toggle } from './common/Toggle';
import { Button } from './common/Button';

interface HeaderProps {
  title: string;
  onLogout: () => void; // Added onLogout prop
}

export const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  const { theme, toggleDarkMode } = useTheme();

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 z-40 bg-darkBg/90 backdrop-blur-lg border-b border-darkBorder p-4 flex items-center justify-between h-16 transition-all duration-300">
      <h1 className="text-xl font-bold text-darkText hidden lg:block">{title}</h1>
      <div className="flex items-center space-x-4 ml-auto">
        <Toggle
          id="darkModeToggle"
          checked={theme.isDarkMode}
          onChange={toggleDarkMode}
          label="Dark Mode"
          className="text-darkText"
        />
        {/* User profile / settings */}
        <div className="relative">
          <button className="flex items-center space-x-2 text-darkText hover:text-primary transition-colors duration-200">
            <span className="sr-only">Open user menu</span>
            <img className="h-8 w-8 rounded-full" src="https://picsum.photos/40/40?random=admin" alt="Admin Avatar" />
            <span className="hidden md:block">Admin</span>
          </button>
        </div>
        <Button variant="secondary" size="sm" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};