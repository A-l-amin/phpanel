import React, { useState } from 'react';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { login } from '../services/apiService';
import { AuthUser } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme(); // Use theme context for colors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(username, password);
      onLoginSuccess(user);
    } catch (err) {
      setError('Invalid username or password. Please try again.');
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkBg text-darkText p-4">
      <div className="w-full max-w-md bg-darkCard rounded-xl shadow-2xl border border-darkBorder p-8 space-y-6">
        <div className="flex flex-col items-center">
          {theme.logoUrl && (
            <img src={theme.logoUrl} alt="DX VPN Logo" className="h-24 w-auto mb-4" />
          )}
          <h2 className="text-3xl font-bold text-darkText">DX VPN Admin</h2>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="adminme"
            required
            autoComplete="username"
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            }
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin"
            required
            autoComplete="current-password"
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 1.5h.75l1.5 1.5 1.5-1.5h.75l1.5 1.5 1.5-1.5h.75l1.5 1.5 1.5-1.5h.75M12 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /></svg>
            }
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="text-center text-gray-500 text-sm">
          Forgot your password?{' '}
          <a href="#" className="text-primary hover:underline">
            Reset it
          </a>
        </p>
      </div>
    </div>
  );
};
