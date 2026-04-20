'use client';

import React from 'react';
import { Search, LogOut, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { toast } from 'react-hot-toast';
import { NotificationDropdown } from './NotificationDropdown';

interface TopbarProps {
  title: string;
  sub: string;
}

export const Topbar = ({ title, sub }: TopbarProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out successfully');
    router.push('/login');
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'SA';

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Left — page title */}
      <div>
        <h2 className="text-base font-semibold text-slate-800 leading-none">{title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{today}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-300 transition-all w-52"
          />
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Divider */}
        <div className="w-px h-6 bg-slate-100 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-800 leading-none">{user?.fullName || 'Super Admin'}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Administrator</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="ml-1 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
