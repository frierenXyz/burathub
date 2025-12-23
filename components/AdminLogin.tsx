import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import Button from './Button';
import { ADMIN_ACCESS_KEY } from '../constants';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_ACCESS_KEY) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 border border-zinc-700">
            <ShieldAlert className="text-emerald-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Access</h2>
          <p className="text-zinc-400 text-sm mt-2">Enter your credentials to manage the system.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1.5 ml-1">ACCESS KEY</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-700 focus:ring-emerald-500/50 focus:border-emerald-500/50'}`}
                placeholder="••••••••••••"
                autoFocus
              />
              <Lock className="absolute right-3 top-3.5 text-zinc-600 w-5 h-5" />
            </div>
            {error && <p className="text-red-500 text-xs mt-2 ml-1">Access denied. Invalid key.</p>}
          </div>

          <Button type="submit" fullWidth rightIcon={<ArrowRight size={16} />}>
            Authenticate
          </Button>
          
          <button 
            type="button" 
            onClick={onBack}
            className="w-full text-zinc-500 text-xs hover:text-zinc-300 transition-colors py-2"
          >
            Return to User View
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;