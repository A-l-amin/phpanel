import React from 'react';
import { Page } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { MENU_ITEMS } from '../constants';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isSidebarOpen, onCloseSidebar }) => {
  const { theme } = useTheme();

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={onCloseSidebar}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-darkCard text-darkText shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 flex items-center justify-center border-b border-darkBorder">
          <img src={theme.logoUrl} alt="DX VPN Logo" className="h-12 w-12 mr-3" />
          <span className="text-2xl font-bold text-darkText whitespace-nowrap">DX VPN Admin</span>
        </div>
        <nav className="mt-6">
          <ul>
            {MENU_ITEMS.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => { onNavigate(item.name); onCloseSidebar(); }}
                  className={`flex items-center w-full py-3 px-6 text-lg font-medium transition-colors duration-200 ${
                    currentPage === item.name
                      ? 'bg-primary/20 text-primary border-r-4 border-primary'
                      : 'hover:bg-darkBg hover:text-primary'
                  }`}
                >
                  <span className="mr-3" dangerouslySetInnerHTML={{ __html: item.icon }}></span>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};