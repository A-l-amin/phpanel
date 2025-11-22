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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            }
          />

          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
            required
            autoComplete="current-password"
            icon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  // Eye-Off Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.5 12c1.396 4.5 5.635 7.5 10.5 7.5 
                        1.933 0 3.748-.45 5.355-1.253M6.228 6.228 
                        A10.45 10.45 0 0 1 12 4.5c4.865 0 9.104 3 10.5 7.5a10.47 10.47 
                        0 0 1-4.51 5.527M6.228 6.228 3 3m3.228 3.228 
                        12.544 12.544m0 0L21 21" />
                  </svg>
                ) : (
                  // Eye Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.5 7.658 
                        4.5 12 4.5c4.342 0 8.577 3 9.964 7.183a1.012 
                        1.012 0 0 1 0 .639C20.577 16.5 16.342 
                        19.5 12 19.5c-4.342 0-8.577-3-9.964-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
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
