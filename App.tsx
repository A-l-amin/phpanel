import React, { useState, useEffect } from 'react';
import { Page, AuthUser } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
// import { ThemeProvider } from './contexts/ThemeContext'; // Removed ThemeProvider import
import { Dashboard } from './components/Dashboard';
// import { WebsiteManage } from './components/WebsiteManage'; // Removed
import { BannerPage } from './components/BannerManagement'; // Renamed component to BannerPage
import { UserPage } from './components/UserManagement'; // Renamed component to UserPage
import { SubscriptionPage } from './components/SubscriptionManagement'; // Renamed component to SubscriptionPage
import { FAQPage } from './components/FAQManager'; // Renamed component to FAQPage
// import { FeedbackManager } from './components/FeedbackManager'; // Removed
import { SettingsPage } from './components/GeneralSettings'; // Renamed component to SettingsPage
import { AppPage } from './components/AppManage'; // Renamed
import { ServerPage } from './components/ServerManagement'; // Renamed component to ServerPage
import { Button } from './components/common/Button';
import { LoginPage } from './components/LoginPage'; // New Login Page
import { checkAuth, logout } from './services/apiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null for initial loading

  useEffect(() => {
    const authenticate = async () => {
      const user = await checkAuth();
      if (user) {
        setIsAuthenticated(true);
        setCurrentPage(Page.Dashboard); // Redirect to dashboard after auth
      } else {
        setIsAuthenticated(false);
        setCurrentPage(Page.Login); // Redirect to login if not authenticated
      }
    };
    authenticate();
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setIsAuthenticated(true);
    setCurrentPage(Page.Dashboard);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setCurrentPage(Page.Login);
  };

  // Function to determine the component to render based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard />;
      // case Page.WebsiteManage: return <WebsiteManage />; // Removed
      case Page.Banner:
        return <BannerPage />; // Use renamed component
      case Page.User:
        return <UserPage />; // Use renamed component
      case Page.Subscription:
        return <SubscriptionPage />; // Use renamed component
      case Page.FAQ:
        return <FAQPage />; // Use renamed component
      // case Page.FeedbackManager: return <FeedbackManager />; // Removed
      case Page.Settings:
        return <SettingsPage />; // Use renamed component
      case Page.App:
        return <AppPage />;
      case Page.Server:
        return <ServerPage />; // Use renamed component
      case Page.Login:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Set body background based on dark mode status
  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    const observer = new MutationObserver(() => {
      if (htmlElement.classList.contains('dark')) {
        bodyElement.classList.remove('bg-lightBg', 'text-lightText');
        bodyElement.classList.add('bg-darkBg', 'text-darkText');
      } else {
        bodyElement.classList.remove('bg-darkBg', 'text-darkText');
        bodyElement.classList.add('bg-lightBg', 'text-lightText');
      }
    });

    observer.observe(htmlElement, { attributes: true, attributeFilter: ['class'] });

    // Initial check
    if (htmlElement.classList.contains('dark')) {
      bodyElement.classList.add('bg-darkBg', 'text-darkText');
    } else {
      bodyElement.classList.add('bg-lightBg', 'text-lightText');
    }

    return () => observer.disconnect();
  }, []);

  if (isAuthenticated === null) {
    // Show a loading spinner or splash screen while checking auth status
    return (
      <div className="flex justify-center items-center min-h-screen bg-darkBg text-darkText text-xl">
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={closeSidebar}
      />

      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
        <Header title={`DX VPN Admin - ${currentPage}`} onLogout={handleLogout} />

        {/* Mobile sidebar toggle button */}
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            size="sm"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            }
          />
        </div>

        <main className="flex-1 p-4 pt-20"> {/* Add padding-top to account for fixed header */}
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;