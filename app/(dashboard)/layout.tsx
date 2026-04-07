'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/') return { title: 'Dashboard Overview', sub: "Welcome back — here's what's happening today" };
    if (pathname.startsWith('/builders')) return { title: 'Builder Management', sub: 'Add, edit and manage all registered builders' };
    if (pathname.startsWith('/subscriptions')) return { title: 'Subscription & Plans', sub: 'Manage plans and track renewals' };
    if (pathname.startsWith('/whatsapp')) return { title: 'WhatsApp Control', sub: 'Monitor API usage and message logs across all builders' };
    if (pathname.startsWith('/analytics')) return { title: 'Global Analytics', sub: 'Platform-wide performance and conversion metrics' };
    if (pathname.startsWith('/status')) return { title: 'Pipeline Status', sub: 'Configure lead stages and Kanban board order' };
    if (pathname.startsWith('/settings')) return { title: 'Settings', sub: 'Manage platform settings and configuration' };
    return { title: 'BuildFlow', sub: 'Super Admin' };
  };

  const { title, sub } = getPageTitle();

  return (
    <div className="flex min-h-screen bg-bg text-text selection:bg-accent/30">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar title={title} sub={sub} />
        <div className="p-8 flex-1 max-w-[1440px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
