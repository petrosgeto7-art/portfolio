import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password })
      });
      navigate('/peto');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div className="fixed inset-0 bg-grid z-0 opacity-40 pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl p-10 w-full max-w-md relative z-10 shadow-2xl shadow-primary/10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fde047] to-[#d4af37] flex items-center justify-center shadow-lg shadow-primary/20">
            <Lock size={24} className="text-black" />
          </div>
        </div>
        
        <h1 className="text-3xl font-display font-bold text-center mb-2 text-white">Admin Portal</h1>
        <p className="text-gray-400 text-center mb-8">Sign in to manage your portfolio</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Admin Password</label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary transition-colors" 
              placeholder="••••••••" 
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <Button type="submit" className="w-full h-14 rounded-xl font-bold mt-4" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
