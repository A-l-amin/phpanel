import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { ThemeSettings } from '../types';
import { DEFAULT_THEME } from '../constants';

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newSettings: Partial<ThemeSettings>) => void;
  toggleDarkMode: () => void;
  primaryColorClasses: string;
  accentColorClasses: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    // Initialize theme from localStorage or use defaults
    const savedTheme = localStorage.getItem('dxVpnAdminTheme');
    try {
      return savedTheme ? JSON.parse(savedTheme) : DEFAULT_THEME;
    } catch (e) {
      console.error("Failed to parse saved theme from localStorage, using default.", e);
      return DEFAULT_THEME;
    }
  });

  useEffect(() => {
    // Apply dark mode class to HTML element
    if (theme.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply custom colors as CSS variables
    document.documentElement.style.setProperty('--color-primary-default', theme.primaryColor);
    document.documentElement.style.setProperty('--color-primary-light', theme.primaryColor + '99'); // Simplified light/dark for dynamic colors
    document.documentElement.style.setProperty('--color-primary-dark', theme.primaryColor + 'cc'); // Simplified light/dark for dynamic colors
    
    document.documentElement.style.setProperty('--color-accent-default', theme.accentColor);
    document.documentElement.style.setProperty('--color-accent-light', theme.accentColor + '99'); // Simplified light/dark for dynamic colors
    document.documentElement.style.setProperty('--color-accent-dark', theme.accentColor + 'cc'); // Simplified light/dark for dynamic colors


    // Persist theme settings to localStorage
    localStorage.setItem('dxVpnAdminTheme', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = useCallback((newSettings: Partial<ThemeSettings>) => {
    setTheme(prevTheme => ({ ...prevTheme, ...newSettings }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    updateTheme({ isDarkMode: !theme.isDarkMode });
  }, [theme.isDarkMode, updateTheme]);

  // Dynamically generate Tailwind-like class strings for primary and accent colors
  // This is a workaround since Tailwind's JIT doesn't process dynamic CSS variables directly in component classNames.
  // In a real app, you might use PostCSS with Tailwind to process custom properties or a more complex solution.
  // For this example, we directly set CSS variables and rely on them.
  const primaryColorClasses = `bg-primary text-white hover:bg-primary-dark`; // text-white for dark background
  const accentColorClasses = `bg-accent text-white hover:bg-accent-dark`; // text-white for dark background

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, toggleDarkMode, primaryColorClasses, accentColorClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};