'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend should have a admin login endpoint
      const response = await axios.post('/admin/login', formData);
      if (response.data.success) {
        console.log("[Admin Login] Success, Authorizing...");
        dispatch(setAuth({
          user: response.data.data.user,
          token: response.data.token
        }));
        
        // Middleware will check this cookie
        document.cookie = `admin_token=${response.data.token}; path=/; max-age=86400; SameSite=Lax`;
        
        toast.success("Access Granted. Welcome, Admin.");
        console.log("[Admin Login] Redirecting to root dashboard...");
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Unauthorized Access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 selection:bg-indigo-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-50 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-50 blur-[100px] rounded-full opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white border border-slate-100 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-12"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white font-bold text-3xl mx-auto mb-8 shadow-2xl shadow-indigo-200 rotate-3">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Super Admin</h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">BuildFlow Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Identity</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                <Mail size={20} strokeWidth={2.5} />
              </div>
              <input 
                type="email"
                required
                className="w-full pl-14 pr-6 py-4.5 rounded-[1.5rem] bg-slate-50 border border-slate-100 text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all font-bold text-sm placeholder:text-slate-300"
                placeholder="admin@buildflow.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                <Lock size={20} strokeWidth={2.5} />
              </div>
              <input 
                type="password"
                required
                className="w-full pl-14 pr-6 py-4.5 rounded-[1.5rem] bg-slate-50 border border-slate-100 text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all font-bold text-sm placeholder:text-slate-300"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-[1.5rem] bg-slate-900 hover:bg-indigo-600 text-white font-black shadow-xl shadow-slate-200 flex items-center justify-center gap-3 transition-all disabled:opacity-70 mt-4 tracking-widest uppercase text-xs"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Access"}
            {!loading && <ArrowRight size={20} strokeWidth={3} />}
          </motion.button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-300 text-[9px] uppercase font-black tracking-[0.3em]">Restricted Infrastructure</p>
        </div>
      </motion.div>
    </div>
  );
}
