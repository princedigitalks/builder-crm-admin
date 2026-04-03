'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownRight,
  Building2,
  Users2,
  MessageCircle,
  IndianRupee,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';

// --- Mock Data ---
const builders = [
  { id: 1, company: 'Skyline Infra', person: 'Raj Mehta', plan: 'Enterprise', planClass: 'bg-greenbg text-green border-green/30', leads: 3240, users: 18, sites: 5, status: 'Active', statusClass: 'bg-greenbg text-green border-green/30', expiry: '2025-12-31', color: '#22d3a5', initials: 'SI', wa: '+91 98765 43210', site: 'Skyline Heights', apiKey: 'sk_live_a3f2' },
  { id: 2, company: 'Apex Builders', person: 'Priya Shah', plan: 'Pro', planClass: 'bg-accentbg text-accent2 border-accent/30', leads: 2108, users: 12, sites: 3, status: 'Active', statusClass: 'bg-greenbg text-green border-green/30', expiry: '2025-09-15', color: '#6c63ff', initials: 'AB', wa: '+91 87654 32109', site: 'Apex Grand', apiKey: 'sk_live_b8e1' },
  { id: 3, company: 'Prestige Homes', person: 'Sunil Kumar', plan: 'Pro', planClass: 'bg-accentbg text-accent2 border-accent/30', leads: 1892, users: 9, sites: 2, status: 'Active', statusClass: 'bg-greenbg text-green border-green/30', expiry: '2025-11-01', color: '#38bdf8', initials: 'PH', wa: '+91 76543 21098', site: 'Prestige Park', apiKey: 'sk_live_c5d9' },
  { id: 4, company: 'GreenCity Dev', person: 'Anita Patel', plan: 'Basic', planClass: 'bg-card2 text-muted border-border', leads: 940, users: 4, sites: 1, status: 'Trial', statusClass: 'bg-amberbg text-amber border-amber/30', expiry: '2025-08-01', color: '#f59e0b', initials: 'GC', wa: '+91 65432 10987', site: 'GreenCity Phase 1', apiKey: 'sk_live_f2a4' },
  { id: 5, company: 'Orbit Realty', person: 'Vikram Joshi', plan: 'Basic', planClass: 'bg-card2 text-muted border-border', leads: 303, users: 3, sites: 1, status: 'Active', statusClass: 'bg-greenbg text-green border-green/30', expiry: '2025-10-15', color: '#ef4444', initials: 'OR', wa: '+91 54321 09876', site: 'Orbit Tower', apiKey: 'sk_live_d7c3' },
];

const revData = [
  { name: 'Jan', value: 220000 },
  { name: 'Feb', value: 245000 },
  { name: 'Mar', value: 198000 },
  { name: 'Apr', value: 310000 },
  { name: 'May', value: 280000 },
  { name: 'Jun', value: 320000 },
  { name: 'Jul', value: 298000 },
  { name: 'Aug', value: 340000 },
  { name: 'Sep', value: 315000 },
  { name: 'Oct', value: 362400 },
];

const planDistribution = [
  { name: 'Enterprise', value: 5, color: '#22d3a5' },
  { name: 'Pro', value: 13, color: '#6c63ff' },
  { name: 'Basic', value: 6, color: '#8890a4' },
];

// --- Components ---

const Sidebar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (p: string) => void }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
    { id: 'builders', label: 'Builders', icon: Users, section: 'Management', badge: 24 },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, section: 'Management' },
    { id: 'whatsapp', label: 'WhatsApp Control', icon: MessageSquare, section: 'Management' },
    { id: 'analytics', label: 'Global Analytics', icon: BarChart3, section: 'Analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'System' },
  ];

  const sections = Array.from(new Set(navItems.map(item => item.section)));

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 z-50">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-100">
            BF
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">BuildFlow</h1>
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accentbg px-1.5 py-0.5 rounded">SUPER ADMIN</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-8 overflow-y-auto mt-2">
        {sections.map(section => (
          <div key={section}>
             <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">{section}</p>
             <div className="space-y-1">
              {navItems.filter(item => item.section === section).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm",
                    activePage === item.id 
                      ? "bg-accentbg text-accent font-semibold" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon size={18} className={cn(activePage === item.id ? "text-accent" : "text-slate-400 group-hover:text-slate-600")} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                      activePage === item.id ? "bg-accent text-white" : "bg-slate-200 text-slate-600"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-accentbg flex items-center justify-center text-accent font-bold text-sm">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">Super Admin</p>
            <p className="text-[10px] font-medium text-slate-500 truncate">Platform Owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ title, sub }: { title: string, sub: string }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div>
        <h2 className="text-lg font-bold text-slate-900 capitalize tracking-tight">{title}</h2>
        <p className="text-[11px] text-slate-500 font-medium">{sub}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search builders..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all w-64"
          />
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative border border-slate-100">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent2 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100">
          <Plus size={18} />
          Add Builder
        </button>
      </div>
    </header>
  );
};

const MetricCard = ({ label, value, change, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className={cn("p-2 rounded-xl text-white", `bg-${colorClass}`)}>
        <Icon size={18} />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
      <div className={cn("flex items-center gap-1 mt-1 text-xs font-medium", change.startsWith('↑') ? "text-emerald-600" : "text-rose-600")}>
        {change}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Builders" 
          value="24" 
          change="↑ 3 this month" 
          icon={Building2} 
          colorClass="accent" 
        />
        <MetricCard 
          label="Total Leads" 
          value="12,483" 
          change="↑ 18% vs last month" 
          icon={Users2} 
          colorClass="green" 
        />
        <MetricCard 
          label="Messages Sent" 
          value="84.2K" 
          change="↑ 6.4K today" 
          icon={MessageCircle} 
          colorClass="amber" 
        />
        <MetricCard 
          label="Monthly Revenue" 
          value="₹3.6L" 
          change="↑ ₹22K vs last month" 
          icon={IndianRupee} 
          colorClass="blue" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Registered Builders</h3>
            <div className="flex items-center gap-3">
              <select className="bg-slate-50 border border-slate-200 text-slate-500 text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-accent/20">
                <option>All Status</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
              <button className="text-xs font-bold text-accent hover:underline">View all</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Leads</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {builders.slice(0, 5).map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[11px]"
                          style={{ backgroundColor: `${b.color}15`, color: b.color }}
                        >
                          {b.initials}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{b.company}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{b.person}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider", b.plan === 'Enterprise' ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700")}>
                        {b.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 text-sm">{b.leads.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full uppercase", b.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Monthly Revenue</h3>
            <button className="text-xs font-bold text-accent flex items-center gap-1">2025 <ChevronDown size={14} /></button>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="mb-8">
              <div className="text-3xl font-bold text-slate-900 tracking-tight">₹3,62,400</div>
              <p className="text-xs text-slate-500 font-medium mt-1">Total this year: <span className="text-slate-900">₹38.1L</span></p>
            </div>
            <div className="flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revData}>
                  <Bar 
                    dataKey="value" 
                    fill="#4f46e5" 
                    radius={[4, 4, 0, 0]}
                  >
                    {revData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 9 ? '#4f46e5' : '#e2e8f0'} 
                      />
                    ))}
                  </Bar>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: '600' }}
                    labelStyle={{ display: 'none' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-5 pt-0 border-t border-border mt-auto">
            <div className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">Plan Distribution</div>
            <div className="space-y-3">
              {planDistribution.map(plan => (
                <div key={plan.name} className="flex items-center gap-3">
                  <div className="text-[12.5px] text-muted w-20">{plan.name}</div>
                  <div className="flex-1 h-1.5 bg-card2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${(plan.value / 24) * 100}%`, backgroundColor: plan.color }}
                    />
                  </div>
                  <div className="text-xs text-muted w-6 text-right">{plan.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-syne font-semibold text-sm">WhatsApp Activity</h3>
            <button className="text-xs text-accent2 hover:underline">Manage →</button>
          </div>
          <div className="p-5 space-y-4">
            {[
              { num: '+91 98765 43210', builder: 'Skyline Infra', count: '2,340', color: 'green' },
              { num: '+91 87654 32109', builder: 'Apex Builders', count: '1,892', color: 'green' },
              { num: '+91 76543 21098', builder: 'Prestige Homes', count: '1,240', color: 'amber' },
              { num: '+91 65432 10987', builder: 'GreenCity Dev', count: '802', color: 'red' },
            ].map((wa, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${wa.color}`} />
                  <div>
                    <div className="text-[13px] font-medium">{wa.num}</div>
                    <div className="text-[11px] text-muted">{wa.builder}</div>
                  </div>
                </div>
                <div className="text-[13px] font-bold text-accent2">{wa.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-syne font-semibold text-sm">Recent Activity</h3>
            <button className="text-xs text-hint">Clear</button>
          </div>
          <div className="p-5 space-y-4">
            {[
              { icon: '🆕', text: 'Skyline Infra added 34 new leads', time: '2 min ago', color: 'green' },
              { icon: '💳', text: 'Apex Builders renewed Pro plan', time: '18 min ago', color: 'purple' },
              { icon: '⚠️', text: 'GreenCity Dev WhatsApp limit 90%', time: '1 hr ago', color: 'amber' },
              { icon: '👤', text: 'New builder Orbit Realty registered', time: '3 hr ago', color: 'blue' },
            ].map((act, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-card2 flex items-center justify-center text-sm shrink-0">
                  {act.icon}
                </div>
                <div>
                  <div className="text-[12.5px] leading-tight">
                    {act.text.split(' ').map((word, j) => (
                      builders.some(b => b.company.includes(word)) 
                        ? <span key={j} className="text-accent2 font-medium">{word} </span> 
                        : word + ' '
                    ))}
                  </div>
                  <div className="text-[11px] text-hint mt-1">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-syne font-semibold text-sm">Platform Health</h3>
          </div>
          <div className="p-5 space-y-3.5">
            {[
              { label: 'Active Builders', value: '19 / 24', color: 'green' },
              { label: 'Leads This Week', value: '3,241', color: 'accent2' },
              { label: 'API Calls Today', value: '48.6K', color: 'blue' },
              { label: 'Expiring Plans (30d)', value: '4', color: 'amber' },
              { label: 'Avg Conversion Rate', value: '14.2%', color: 'green' },
              { label: 'System Uptime', value: '99.97%', color: 'green' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[12.5px] text-muted">{stat.label}</span>
                <span className="text-sm font-semibold font-syne" style={{ color: `var(--color-${stat.color})` }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BuildersPage = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-6"
  >
    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
      {['All Builders', 'Active', 'Suspended', 'Trial'].map((tab, i) => (
        <button 
          key={tab} 
          className={cn(
            "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
            i === 0 ? "bg-white text-accent shadow-sm" : "text-slate-500 hover:text-slate-900"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">All Registered Builders</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search builder..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all w-48"
            />
          </div>
          <button className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-100">+ Add Builder</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Users</th>
              <th className="px-6 py-4">Sites</th>
              <th className="px-6 py-4">Leads</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {builders.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[11px]"
                      style={{ backgroundColor: `${b.color}15`, color: b.color }}
                    >
                      {b.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{b.company}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{b.person}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase", b.plan === 'Enterprise' ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700")}>
                    {b.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 text-xs font-medium">{b.users} users</td>
                <td className="px-6 py-4 text-slate-600 text-xs font-medium">{b.sites} sites</td>
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">{b.leads.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full uppercase", b.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

const SubscriptionsPage = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="space-y-8"
  >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Subscription Plans</h3>
          <button className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-100">+ Create Plan</button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Basic', price: '₹4,999', color: 'slate-500', features: ['5 Users', '1 WhatsApp Number', '500 Leads/mo', '2 Sites'] },
            { name: 'Pro', price: '₹12,999', color: 'accent', featured: true, features: ['20 Users', '3 WhatsApp Numbers', '5,000 Leads/mo', '10 Sites'] },
            { name: 'Enterprise', price: '₹29,999', color: 'emerald-600', features: ['Unlimited Users', '10 WhatsApp Numbers', 'Unlimited Leads', 'Unlimited Sites'] },
          ].map((plan, i) => (
            <div key={i} className={cn("p-6 rounded-3xl border flex flex-col", plan.featured ? "border-accent/20 bg-accentbg/50" : "border-slate-100 bg-slate-50/50")}>
              {plan.featured && <div className="text-[10px] bg-accent text-white px-2 py-0.5 rounded-lg w-fit mb-4 font-bold tracking-wider">POPULAR</div>}
              <div className="font-bold text-slate-900">{plan.name}</div>
              <div className="mt-4 mb-2 flex items-baseline gap-1">
                <span className={cn("text-2xl font-bold tracking-tight", plan.featured ? "text-accent" : "text-slate-900")}>{plan.price}</span>
                <span className="text-[11px] text-slate-500 font-medium">/mo</span>
              </div>
              <div className="space-y-3 mt-6">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {f}
                  </div>
                ))}
              </div>
              <button className={cn("mt-8 w-full py-2.5 rounded-xl text-xs font-bold transition-all", plan.featured ? "bg-accent text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50")}>
                Edit Plan
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-6">
        <h3 className="font-bold text-slate-900 text-sm mb-6">Expiring Soon</h3>
        <div className="space-y-4">
          {builders.filter(b => b.status === 'Trial' || b.expiry < '2025-11-01').map((b, i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-accent/20 transition-all">
              <div>
                <div className="text-sm font-bold text-slate-900">{b.company}</div>
                <div className="text-[11px] text-slate-500 font-medium">{b.plan} Plan</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-amber-600 font-bold uppercase tracking-wider">{b.expiry}</div>
                <div className="text-[10px] text-slate-400 font-medium">expiry</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const WhatsAppPage = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <MetricCard label="Active Numbers" value="18" change="↑ 2 added this week" icon={MessageSquare} colorClass="emerald-600" />
      <MetricCard label="Messages Today" value="6,420" change="↑ 12% vs yesterday" icon={BarChart3} colorClass="amber-600" />
      <MetricCard label="API Usage" value="68%" change="of monthly quota" icon={Settings} colorClass="indigo-600" />
    </div>
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">WhatsApp Numbers — All Builders</h3>
        <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">Export Logs</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Number</th>
              <th className="px-6 py-4">Builder</th>
              <th className="px-6 py-4">Site</th>
              <th className="px-6 py-4">Messages</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {builders.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">{b.wa}</td>
                <td className="px-6 py-4 text-slate-600 text-sm font-medium">{b.company}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{b.site}</td>
                <td className="px-6 py-4 font-bold text-accent text-sm">{b.leads.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

const AnalyticsPage = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <MetricCard label="Total Leads (All)" value="12,483" change="↑ 18% MoM" icon={Users2} colorClass="accent" />
      <MetricCard label="Closed Won" value="1,771" change="14.2% conversion" icon={ShieldCheck} colorClass="green" />
      <MetricCard label="Site Visits" value="3,104" change="↑ 8% this month" icon={ExternalLink} colorClass="amber" />
      <MetricCard label="Avg Deal Value" value="₹84L" change="Median: ₹62L" icon={IndianRupee} colorClass="blue" />
    </div>
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Builder Performance Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Builder</th>
              <th className="px-6 py-4">Total Leads</th>
              <th className="px-6 py-4">Contacted</th>
              <th className="px-6 py-4">Site Visits</th>
              <th className="px-6 py-4">Closed Won</th>
              <th className="px-6 py-4">Conversion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {builders.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">{b.company}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{b.leads.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{(b.leads * 0.8).toFixed(0)}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{(b.leads * 0.15).toFixed(0)}</td>
                <td className="px-6 py-4 font-bold text-emerald-600 text-sm">{(b.leads * 0.12).toFixed(0)}</td>
                <td className="px-6 py-4"><span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">12.4%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

// --- Main Page ---

export default function SuperAdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');

  const getPageContent = () => {
    switch (activePage) {
      case 'dashboard': return { title: 'Dashboard Overview', sub: 'Welcome back — here\'s what\'s happening today', component: <Dashboard /> };
      case 'builders': return { title: 'Builder Management', sub: 'Add, edit and manage all registered builders', component: <BuildersPage /> };
      case 'subscriptions': return { title: 'Subscription & Plans', sub: 'Manage plans and track renewals', component: <SubscriptionsPage /> };
      case 'whatsapp': return { title: 'WhatsApp Control', sub: 'Monitor API usage and message logs across all builders', component: <WhatsAppPage /> };
      case 'analytics': return { title: 'Global Analytics', sub: 'Platform-wide performance and conversion metrics', component: <AnalyticsPage /> };
      default: return { title: 'Dashboard Overview', sub: 'Welcome back', component: <Dashboard /> };
    }
  };

  const { title, sub, component } = getPageContent();

  return (
    <div className="flex min-h-screen bg-bg text-text selection:bg-accent/30">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar title={title} sub={sub} />
        
        <div className="p-8 flex-1 max-w-[1440px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {component}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Add Builder Modal */}
      <div className="hidden fixed inset-0 bg-slate-900/40 z-[100] items-center justify-center backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-xl text-slate-900">Add New Builder</h2>
            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
              <input type="text" placeholder="e.g. Skyline Infra Pvt. Ltd." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Person</label>
                <input type="text" placeholder="Full name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                <input type="text" placeholder="+91 98765 43210" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <input type="email" placeholder="admin@company.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assign Plan</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none">
                <option>Basic — ₹4,999/mo</option>
                <option>Pro — ₹12,999/mo</option>
                <option>Enterprise — ₹29,999/mo</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all">Cancel</button>
              <button className="flex-1 py-3 bg-accent text-white rounded-2xl font-bold hover:bg-accent2 transition-all shadow-lg shadow-indigo-100">Create Builder</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
