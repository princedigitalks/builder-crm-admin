'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  Settings,
  LogOut,
  ListTodo
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out successfully");
    router.push('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/', section: 'Management' },
    { id: 'builders', label: 'Builders', icon: Users, href: '/builders', section: 'Management' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, href: '/subscriptions', section: 'Management' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, href: '/whatsapp', section: 'Management' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics', section: 'Management' },
    { id: 'status', label: 'Pipeline Status', icon: ListTodo, href: '/status', section: 'Configuration' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings', section: 'Configuration' },
  ];

  const sections = ['Management', 'Configuration'];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 z-50">
      <div className="p-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-100">
            BF
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">BuildFlow</h1>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded">SUPER ADMIN</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-8 overflow-y-auto mt-2">
        {sections.map(section => (
          <div key={section}>
             <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">{section}</p>
             <div className="space-y-1">
              {navItems.filter(item => item.section === section).map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm",
                    isActive(item.href) 
                      ? "bg-indigo-50 text-indigo-600 font-semibold" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon size={18} className={cn(isActive(item.href) ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                      isActive(item.href) ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/50">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">Super Admin</p>
            <p className="text-[10px] font-medium text-slate-500 truncate">Platform Owner</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 text-sm font-medium group"
        >
          <LogOut size={18} className="text-slate-400 group-hover:text-rose-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
