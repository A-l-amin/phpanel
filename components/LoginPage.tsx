
import React, { useState } from 'react';
import { DxvpnLogo, UserIcon, EyeIcon, EyeOffIcon } from './Icons'; // Assuming EyeOffIcon is also available

interface LoginPageProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('usertrial2@gmail.com');
  const [password, setPassword] = useState('password'); // Default password for demo
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would involve API calls and proper credential validation.
    // For this demo, any non-empty username/password will "authenticate"
    // or specifically check for the screenshot's username.
    if (username === 'usertrial2@gmail.com' && password === 'password') { // Simplified check
      setIsAuthenticated(true);
      console.log('Login successful for admin!');
    } else {
      alert('Invalid username or password. (Hint: usertrial2@gmail.com / password)');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-68px)] bg-dx-dark bg-grid-pattern relative">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div> {/* Dark overlay */}
      <div className="bg-dx-light-2 dark:bg-dx-dark-2 p-8 sm:p-10 rounded-2xl shadow-xl border border-dx-light-3 dark:border-dx-dark-3 w-full max-w-sm z-10 text-center">
        <div className="flex flex-col items-center mb-6">
          <DxvpnLogo className="h-12 w-12 text-dx-accent mb-4" />
          <h2 className="text-2xl font-bold text-dx-dark dark:text-white font-montserrat">Admin Sign In</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-dx-light-3 dark:bg-dx-dark-3 border-2 border-transparent focus:border-dx-accent outline-none text-dx-dark dark:text-dx-light"
              required
              aria-label="Username"
            />
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dx-gray" />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-dx-light-3 dark:bg-dx-dark-3 border-2 border-transparent focus:border-dx-accent outline-none text-dx-dark dark:text-dx-light"
              required
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dx-gray hover:text-dx-accent transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dx-gray" /> {/* Reusing UserIcon for password lock */}
          </div>
          <button
            type="submit"
            className="w-full bg-dx-accent text-dx-dark font-bold py-3 rounded-lg hover:opacity-80 transition-opacity shadow-lg shadow-dx-accent/30"
          >
            Sign In
          </button>
        </form>
        <a href="#" className="block mt-4 text-sm text-dx-accent hover:underline transition-colors">
          Forgot Password?
        </a>
      </div>
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};
