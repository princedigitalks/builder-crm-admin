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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
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
    <aside className="w-[230px] h-screen bg-sidebar border-r border-border flex flex-col fixed top-0 left-0 z-50">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-syne font-bold text-white">
            BF
          </div>
          <div>
            <div className="font-syne font-bold text-base tracking-tight">BuildFlow</div>
            <div className="text-[9px] bg-accentbg text-accent2 px-1.5 py-0.5 rounded border border-accent/40 font-medium tracking-wider">
              SUPER ADMIN
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {sections.map(section => (
          <React.Fragment key={section}>
            <div className="text-[10px] uppercase tracking-widest text-hint font-semibold px-2 py-3 mt-2">
              {section}
            </div>
            {navItems.filter(item => item.section === section).map(item => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-[13.5px] ${
                  activePage === item.id 
                    ? 'bg-accentbg text-accent2 border border-accent/30' 
                    : 'text-muted hover:bg-card hover:text-text'
                }`}
              >
                <item.icon size={18} className="opacity-80" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-card cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white">
            SA
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium leading-tight">Super Admin</span>
            <span className="text-[11px] text-muted">Platform Owner</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ title, sub }: { title: string, sub: string }) => {
  return (
    <header className="h-16 px-7 border-b border-border flex items-center justify-between bg-bg/80 backdrop-blur-md sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-semibold font-syne">{title}</h1>
        <p className="text-xs text-muted">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-hint" size={14} />
          <input 
            type="text" 
            placeholder="Search builders..." 
            className="bg-card border border-border text-text text-sm rounded-lg pl-9 pr-3 py-1.5 outline-none focus:border-accent/50 transition-colors w-48"
          />
        </div>
        <button className="p-2 rounded-lg border border-border2 bg-card text-text hover:bg-card2 transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red rounded-full" />
        </button>
        <button className="flex items-center gap-2 bg-accent hover:bg-accent2 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} />
          Add Builder
        </button>
      </div>
    </header>
  );
};

const MetricCard = ({ label, value, change, icon: Icon, colorClass, iconClass }: any) => (
  <div className={`bg-card border border-border rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-all hover:border-border2`}>
    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-${colorClass}`} />
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11.5px] text-muted font-medium tracking-wide uppercase">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${colorClass}bg text-${colorClass}`}>
        <Icon size={16} />
      </div>
    </div>
    <div className="text-3xl font-bold font-syne tracking-tight">{value}</div>
    <div className={`text-[11.5px] mt-1.5 flex items-center gap-1 ${change.startsWith('↑') ? 'text-green' : 'text-red'}`}>
      {change}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-syne font-semibold text-sm">Registered Builders</h3>
            <div className="flex items-center gap-3">
              <select className="bg-card2 border border-border text-muted text-[12.5px] rounded-lg px-2.5 py-1 outline-none cursor-pointer">
                <option>All Status</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
              <button className="text-xs text-accent2 hover:underline">View all →</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-hint uppercase tracking-wider border-b border-border">
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Leads</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {builders.slice(0, 5).map(b => (
                  <tr key={b.id} className="hover:bg-card2 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px]"
                          style={{ backgroundColor: `${b.color}22`, color: b.color }}
                        >
                          {b.initials}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium">{b.company}</div>
                          <div className="text-[11px] text-muted">{b.person}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${b.planClass}`}>
                        {b.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[13px]">{b.leads.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${b.statusClass}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-md border border-border hover:bg-card hover:text-text text-muted transition-all">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-syne font-semibold text-sm">Monthly Revenue</h3>
            <button className="text-xs text-accent2 flex items-center gap-1">2025 <ChevronDown size={12} /></button>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="mb-6">
              <div className="text-2xl font-bold font-syne text-blue">₹3,62,400</div>
              <div className="text-[11.5px] text-muted mt-0.5">Total this year: <span className="text-text">₹38.1L</span></div>
            </div>
            <div className="flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revData}>
                  <Bar 
                    dataKey="value" 
                    fill="#6c63ff" 
                    radius={[4, 4, 0, 0]}
                    onMouseOver={(data, index) => {}}
                  >
                    {revData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 9 ? '#6c63ff' : '#6c63ff22'} 
                        stroke={index === 9 ? '#6c63ff' : '#6c63ff44'}
                      />
                    ))}
                  </Bar>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#545c72' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#1a1e28', border: '1px solid #ffffff18', borderRadius: '8px' }}
                    itemStyle={{ color: '#f0f2f8', fontSize: '12px' }}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    <div className="flex gap-1 bg-card2 p-1 rounded-xl w-fit">
      {['All Builders', 'Active', 'Suspended', 'Trial'].map((tab, i) => (
        <button 
          key={tab} 
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${i === 0 ? 'bg-accentbg text-accent2' : 'text-muted hover:text-text'}`}
        >
          {tab}
        </button>
      ))}
    </div>
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-syne font-semibold text-sm">All Registered Builders</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-hint" size={14} />
            <input 
              type="text" 
              placeholder="Search builder..." 
              className="bg-card2 border border-border text-text text-xs rounded-lg pl-9 pr-3 py-1.5 outline-none focus:border-accent/50 transition-colors w-40"
            />
          </div>
          <button className="bg-accent text-white px-3 py-1.5 rounded-lg text-xs font-medium">+ Add Builder</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] text-hint uppercase tracking-wider border-b border-border">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Users</th>
              <th className="px-5 py-3 font-medium">Sites</th>
              <th className="px-5 py-3 font-medium">Leads</th>
              <th className="px-5 py-3 font-medium">Expiry</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {builders.map(b => (
              <tr key={b.id} className="hover:bg-card2 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px]"
                      style={{ backgroundColor: `${b.color}22`, color: b.color }}
                    >
                      {b.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium">{b.company}</div>
                      <div className="text-[11px] text-muted">{b.person}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${b.planClass}`}>{b.plan}</span></td>
                <td className="px-5 py-4 text-muted text-sm">{b.users}</td>
                <td className="px-5 py-4 text-muted text-sm">{b.sites}</td>
                <td className="px-5 py-4 font-medium text-sm">{b.leads.toLocaleString()}</td>
                <td className="px-5 py-4 text-muted text-xs">{b.expiry}</td>
                <td className="px-5 py-4">
                  <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${b.statusClass}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-md border border-border hover:bg-card hover:text-text text-muted transition-all"><MoreVertical size={14} /></button>
                  </div>
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
    className="space-y-6"
  >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-syne font-semibold text-sm">Subscription Plans</h3>
          <button className="bg-accent text-white px-3 py-1.5 rounded-lg text-xs font-medium">+ Create Plan</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Basic', price: '₹4,999', color: 'muted', features: ['5 Users', '1 WhatsApp Number', '500 Leads/mo', '2 Sites'] },
            { name: 'Pro', price: '₹12,999', color: 'accent2', featured: true, features: ['20 Users', '3 WhatsApp Numbers', '5,000 Leads/mo', '10 Sites'] },
            { name: 'Enterprise', price: '₹29,999', color: 'green', features: ['Unlimited Users', '10 WhatsApp Numbers', 'Unlimited Leads', 'Unlimited Sites'] },
          ].map((plan, i) => (
            <div key={i} className={`p-5 rounded-2xl border ${plan.featured ? 'border-accent/50 bg-accentbg' : 'border-border bg-card2'} flex flex-col`}>
              {plan.featured && <div className="text-[9px] bg-accent text-white px-2 py-0.5 rounded w-fit mb-3 font-bold tracking-wider">MOST POPULAR</div>}
              <div className="font-syne font-semibold text-sm">{plan.name}</div>
              <div className="mt-4 mb-1">
                <span className="text-2xl font-bold font-syne" style={{ color: `var(--color-${plan.color})` }}>{plan.price}</span>
                <span className="text-[11px] text-muted"> /month</span>
              </div>
              <div className="space-y-2 mt-4">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 text-[11.5px] text-muted">
                    <div className="w-1 h-1 rounded-full bg-green" />
                    {f}
                  </div>
                ))}
              </div>
              <button className={`mt-6 w-full py-2 rounded-lg text-xs font-medium transition-all ${plan.featured ? 'bg-accent text-white' : 'bg-card border border-border text-text hover:bg-border'}`}>
                Edit Plan
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-syne font-semibold text-sm">Expiring Soon</h3>
        </div>
        <div className="p-5 space-y-3">
          {builders.filter(b => b.status === 'Trial' || b.expiry < '2025-11-01').map((b, i) => (
            <div key={i} className="p-3 bg-card2 border border-border rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium">{b.company}</div>
                <div className="text-[11px] text-muted">{b.plan} Plan</div>
              </div>
              <div className="text-right">
                <div className="text-[11.5px] text-amber font-medium">{b.expiry}</div>
                <div className="text-[10px] text-hint">expiry</div>
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
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard label="Active Numbers" value="18" change="↑ 2 added this week" icon={MessageSquare} colorClass="green" />
      <MetricCard label="Messages Today" value="6,420" change="↑ 12% vs yesterday" icon={BarChart3} colorClass="amber" />
      <MetricCard label="API Usage" value="68%" change="of monthly quota" icon={Settings} colorClass="blue" />
    </div>
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-syne font-semibold text-sm">WhatsApp Numbers — All Builders</h3>
        <button className="bg-card border border-border text-text px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-card2 transition-colors">Export Logs</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] text-hint uppercase tracking-wider border-b border-border">
              <th className="px-5 py-3 font-medium">Number</th>
              <th className="px-5 py-3 font-medium">Builder</th>
              <th className="px-5 py-3 font-medium">Assigned Site</th>
              <th className="px-5 py-3 font-medium">Messages</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">API Key</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {builders.map(b => (
              <tr key={b.id} className="hover:bg-card2 transition-colors">
                <td className="px-5 py-4 font-medium text-[13px]">{b.wa}</td>
                <td className="px-5 py-4 text-muted text-sm">{b.company}</td>
                <td className="px-5 py-4 text-muted text-sm">{b.site}</td>
                <td className="px-5 py-4 font-bold text-accent2 text-[13px]">{b.leads.toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${b.statusClass}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    Active
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-[11px] text-hint">{b.apiKey}</td>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard label="Total Leads (All)" value="12,483" change="↑ 18% MoM" icon={Users2} colorClass="accent" />
      <MetricCard label="Closed Won" value="1,771" change="14.2% conversion" icon={ShieldCheck} colorClass="green" />
      <MetricCard label="Site Visits" value="3,104" change="↑ 8% this month" icon={ExternalLink} colorClass="amber" />
      <MetricCard label="Avg Deal Value" value="₹84L" change="Median: ₹62L" icon={IndianRupee} colorClass="blue" />
    </div>
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-syne font-semibold text-sm">Builder Performance Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] text-hint uppercase tracking-wider border-b border-border">
              <th className="px-5 py-3 font-medium">Builder</th>
              <th className="px-5 py-3 font-medium">Total Leads</th>
              <th className="px-5 py-3 font-medium">Contacted</th>
              <th className="px-5 py-3 font-medium">Site Visits</th>
              <th className="px-5 py-3 font-medium">Closed Won</th>
              <th className="px-5 py-3 font-medium">Conversion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {builders.map(b => (
              <tr key={b.id} className="hover:bg-card2 transition-colors">
                <td className="px-5 py-4 font-medium text-[13px]">{b.company}</td>
                <td className="px-5 py-4 text-sm">{b.leads.toLocaleString()}</td>
                <td className="px-5 py-4 text-muted text-sm">{(b.leads * 0.8).toFixed(0)}</td>
                <td className="px-5 py-4 text-muted text-sm">{(b.leads * 0.15).toFixed(0)}</td>
                <td className="px-5 py-4 font-medium text-green text-sm">{(b.leads * 0.12).toFixed(0)}</td>
                <td className="px-5 py-4"><span className="text-green font-bold">12.4%</span></td>
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
      
      <main className="flex-1 ml-[230px] flex flex-col min-h-screen">
        <Topbar title={title} sub={sub} />
        
        <div className="p-7 flex-1">
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

      {/* Add Builder Modal (Static for UI Demo) */}
      <div className="hidden fixed inset-0 bg-black/70 z-[100] items-center justify-center backdrop-blur-sm">
        <div className="bg-card border border-border2 rounded-2xl p-7 w-[460px] max-w-[90vw] shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-syne font-bold text-lg">Add New Builder</h2>
            <button className="text-muted hover:text-text text-2xl">&times;</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1.5 block font-medium uppercase tracking-wider">Company Name</label>
              <input type="text" placeholder="e.g. Skyline Infra Pvt. Ltd." className="w-full bg-card2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted mb-1.5 block font-medium uppercase tracking-wider">Contact Person</label>
                <input type="text" placeholder="Full name" className="w-full bg-card2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-muted mb-1.5 block font-medium uppercase tracking-wider">Phone</label>
                <input type="text" placeholder="+91 98765 43210" className="w-full bg-card2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted mb-1.5 block font-medium uppercase tracking-wider">Email</label>
              <input type="email" placeholder="admin@company.com" className="w-full bg-card2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-muted mb-1.5 block font-medium uppercase tracking-wider">Assign Plan</label>
              <select className="w-full bg-card2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors">
                <option>Basic — ₹4,999/mo</option>
                <option>Pro — ₹12,999/mo</option>
                <option>Enterprise — ₹29,999/mo</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button className="flex-1 py-2.5 bg-card2 border border-border rounded-lg text-muted text-sm font-medium hover:bg-border transition-colors">Cancel</button>
              <button className="flex-1 py-2.5 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent2 transition-colors shadow-lg shadow-accent/20">Create Builder</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
