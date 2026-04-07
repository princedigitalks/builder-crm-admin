'use client';

import React from 'react';
import { Search, Bell, Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-hot-toast';

interface TopbarProps {
  title: string;
  sub: string;
}

export const Topbar = ({ title, sub }: TopbarProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out successfully");
    router.push('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40 backdrop-blur-md bg-white/80">
      <div>
        <h2 className="text-xl font-black text-slate-900 capitalize tracking-tight leading-none mb-1.5">{title}</h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{sub}</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative group hidden sm:block">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
          <input 
            type="text" 
            placeholder="Global search..." 
            className="pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:bg-white focus:border-slate-300 transition-all w-64 shadow-sm"
          />
        </div>

        <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative border border-transparent hover:border-slate-100 shadow-sm group">
          <Bell size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20" />
        </button>

        <button 
          onClick={handleLogout}
          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 shadow-sm group"
          title="Sign Out"
        >
          <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
     
      </div>
    </header>
  );
};
