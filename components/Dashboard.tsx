import React, { useEffect, useState } from 'react';
import { DashboardStats, ChartDataPoint } from '../types';
import { getDashboardStats, getActiveConnectionsToday, getNewUsersThisWeek } from '../services/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from './common/Card';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeConnections, setActiveConnections] = useState<ChartDataPoint[]>([]);
  const [newUsers, setNewUsers] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, connectionsData, newUsersData] = await Promise.all([
          getDashboardStats(),
          getActiveConnectionsToday(),
          getNewUsersThisWeek(),
        ]);
        setStats(dashboardStats);
        setActiveConnections(connectionsData);
        setNewUsers(newUsersData);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-darkText">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-red-500">
        Error: {error}
      </div>
    );
  }

  const chartTextColor = theme.isDarkMode ? '#e0e0e0' : '#333333';
  const gridStroke = theme.isDarkMode ? '#3f4b63' : '#e0e0e0';

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-darkText">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Users" value={stats?.totalUsers || 0} icon={<UserIcon />} />
        <Card title="Active Premium" value={stats?.activePremiumUsers || 0} icon={<PremiumIcon />} />
        <Card title="Free Users" value={stats?.freeUsers || 0} icon={<FreeIcon />} />
        <Card title="Total Servers" value={stats?.totalServers || 0} icon={<ServerIcon />} />
        <Card title="Online Servers" value={stats?.onlineServers || 0} icon={<OnlineIcon />} />
        <Card title="Offline Servers" value={stats?.offlineServers || 0} icon={<OfflineIcon />} />
        <Card title="Total Connections" value={stats?.totalConnections || 0} icon={<ConnectionIcon />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4" title="Active Connections Today">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activeConnections} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" stroke={chartTextColor} />
              <YAxis stroke={chartTextColor} />
              <Tooltip
                contentStyle={{ backgroundColor: theme.isDarkMode ? '#1a1a2e' : '#ffffff', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: chartTextColor }}
                labelStyle={{ color: chartTextColor }}
              />
              <Line type="monotone" dataKey="value" stroke={theme.accentColor} strokeWidth={2} dot={{ fill: theme.accentColor }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4" title="New Users This Week">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={newUsers} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" stroke={chartTextColor} />
              <YAxis stroke={chartTextColor} />
              <Tooltip
                contentStyle={{ backgroundColor: theme.isDarkMode ? '#1a1a2e' : '#ffffff', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: chartTextColor }}
                labelStyle={{ color: chartTextColor }}
              />
              <Bar dataKey="value" fill={theme.primaryColor} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
{/*dxplusdev*/}

{renderContent()}
                <footer className="mt-8 text-center text-sm text-dx-gray pt-4 border-t border-dx-light-3 dark:border-dx-dark-3">
                    THIS APP IS CREATED BY DX PLUS DEV
                </footer>
            </main>
        </div>
    );
};


// Icon components for cards (placeholder SVGs)
const UserIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const PremiumIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.123 5.145 5.503.475c.428.073.497.68.121.986l-4.513 3.96 1.32 5.679c.08.34-.272.636-.585.493L12 18.232l-5.483 2.879c-.313.164-.665-.134-.586-.493l1.32-5.679-4.513-3.959c-.376-.307-.307-.913.121-.986l5.503-.475L11.48 3.5Z" /></svg>;
const FreeIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const ServerIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const OnlineIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.082-3.141a.75.75 0 1 0-1.164-1.038l-4.116 4.614a1.125 1.125 0 0 0 1.633 1.585L11.144 13.1a3.75 3.75 0 0 1 5.31-4.141.75.75 0 0 0 1.113-1.066 5.25 5.25 0 0 0-7.439-5.187Z" clipRule="evenodd" /></svg>;
const OfflineIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-400"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-2.78 2.78a.75.75 0 1 0 1.06 1.06L12 13.06l2.78 2.78a.75.75 0 0 0 1.06-1.06L13.06 12l2.78-2.78a.75.75 0 0 0-1.06-1.06L12 10.94l-2.78-2.78Z" clipRule="evenodd" /></svg>;
const ConnectionIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.712A2.25 2.25 0 0 1 10.5 14.25H12a2.25 2.25 0 0 1 2.25 2.25V21m-4.5 0h6m-6 0h-3v-2.25A2.25 2.25 0 0 0 3 16.5v-6a2.25 2.25 0 0 1 2.25-2.25h1.372c.516 0 .966.351 1.091.852l1.107 4.423a1.125 1.125 0 0 0 .961.852h6.161a1.125 1.125 0 0 0 .961-.852l1.107-4.423c.125-.501.575-.852 1.091-.852h1.372c.585 0 1.154.16 1.612.457m-18.04 5.97L3 16.5M19.5 7.5c-1.257 0-2.503.003-3.746.003h-1.372c-.516 0-.966-.351-1.091-.852l-1.107-4.423A1.125 1.125 0 0 0 10.5 1.5H12a2.25 2.25 0 0 1 2.25 2.25V21" /></svg>;
