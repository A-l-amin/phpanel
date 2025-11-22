import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@dxvpn.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock validation
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-600"></div>
       
       <div className="w-full max-w-md px-6">
         <div className="flex flex-col items-center mb-8">
            <ShieldCheck size={48} className="text-primary mb-4" />
            <h1 className="text-3xl font-bold text-white tracking-wider">DX VPN</h1>
         </div>

         <div className="bg-dark-card rounded-2xl p-8 shadow-2xl border border-gray-800">
            <div className="flex justify-center mb-6">
                <ShieldCheck size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-8">Admin Sign In</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <User size={20} />
                        </div>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-dark-input border border-transparent focus:border-primary rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Lock size={20} />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-dark-input border border-transparent focus:border-primary rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            placeholder="Enter your password"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                >
                    Sign In
                </button>

                <div className="text-center">
                    <a href="#" className="text-primary hover:text-primaryHover text-sm font-medium">
                        Forgot Password?
                    </a>
                </div>
            </form>
         </div>
       </div>
    </div>
  );
};

export default Login;
