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
    if (pathname === '/') return { title: 'Dashboard', sub: "Here's what's happening today" };
    if (pathname.startsWith('/leads')) return { title: 'Enquiry Leads', sub: 'Leads submitted from the landing page' };
    if (pathname.startsWith('/builders')) return { title: 'Builders', sub: 'Manage all registered builders' };
    if (pathname.startsWith('/subscriptions')) return { title: 'Subscriptions', sub: 'Manage plans and track renewals' };
    if (pathname.startsWith('/whatsapp')) return { title: 'WhatsApp', sub: 'Monitor API usage across all builders' };
    if (pathname.startsWith('/analytics')) return { title: 'Analytics', sub: 'Platform-wide performance metrics' };
    if (pathname.startsWith('/status')) return { title: 'Pipeline Status', sub: 'Configure lead stages' };
    if (pathname.startsWith('/settings')) return { title: 'Settings', sub: 'Platform configuration' };
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
