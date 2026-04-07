'use client';

import React from 'react';
import { 
  Building2, 
  Users2, 
  MessageCircle, 
  IndianRupee,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
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
import { MetricCard } from '@/components/MetricCard';
import { builders, revData, planDistribution } from '@/lib/mock-data';
import CommonTable from '@/components/ui/CommonTable';

export default function Dashboard() {
  const columns = [
    {
      header: 'Company & Contact',
      key: 'company',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[11px]"
            style={{ backgroundColor: `${item.color}15`, color: item.color }}
          >
            {item.initials}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight mb-0.5">{item.company}</div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{item.person}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Plan Tier',
      key: 'plan',
      render: (item: any) => (
        <span className={cn(
          "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-[0.1em] border",
          item.plan === 'Enterprise' 
            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
            : "bg-indigo-50 text-indigo-700 border-indigo-100"
        )}>
          {item.plan}
        </span>
      )
    },
    {
      header: 'Traffic',
      key: 'leads',
      render: (item: any) => (
        <div className="flex items-center gap-1.5">
          <Users2 size={12} className="text-slate-300" />
          <span className="text-sm font-black text-slate-900">{item.leads.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: any) => (
        <span className={cn(
          "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
          item.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        )}>
          {item.status}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: () => (
        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical size={16} />
        </button>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto pb-20"
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <CommonTable 
            title="Registered Builders"
            columns={columns}
            data={builders.slice(0, 5)}
            loading={false}
            searchValue=""
            onSearchChange={() => {}}
            onPageChange={() => {}}
            pagination={null}
            actionButton={
              <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">
                View All Builders →
              </button>
            }
          />
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Revenue Performance</h3>
            <button className="text-[10px] font-black text-slate-400 border border-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all uppercase tracking-widest">
              Fiscal 2026 
              <ChevronDown size={14} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="mb-10">
              <div className="text-4xl font-black text-slate-900 tracking-tighter">₹3,62,400</div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                Annual Target Progress
                <span className="text-emerald-500">84.2%</span>
              </p>
            </div>
            
            <div className="flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revData}>
                  <Bar 
                    dataKey="value" 
                    fill="#4f46e5" 
                    radius={[6, 6, 0, 0]}
                  >
                    {revData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 9 ? '#4f46e5' : '#f1f5f9'} 
                      />
                    ))}
                  </Bar>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ color: '#0f172a', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                    labelStyle={{ display: 'none' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-50 mt-8">
            <div className="text-[10px] font-black text-slate-400 mb-5 uppercase tracking-[0.2em]">Market Distribution</div>
            <div className="space-y-4">
              {planDistribution.map(plan => (
                <div key={plan.name} className="flex items-center gap-4">
                  <div className="text-[11px] font-bold text-slate-600 w-24 uppercase tracking-tight">{plan.name}</div>
                  <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${(plan.value / 24) * 100}%`, backgroundColor: plan.color }}
                    />
                  </div>
                  <div className="text-[11px] font-black text-slate-900 w-8 text-right">{plan.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">WhatsApp Health</h3>
            <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Configure →</button>
          </div>
          <div className="p-6 space-y-5">
            {[
              { num: '+91 98765 43210', builder: 'Skyline Infra', count: '2,340', color: 'bg-emerald-500' },
              { num: '+91 87654 32109', builder: 'Apex Builders', count: '1,892', color: 'bg-emerald-500' },
              { num: '+91 76543 21098', builder: 'Prestige Homes', count: '1,240', color: 'bg-amber-500' },
              { num: '+91 65432 10987', builder: 'GreenCity Dev', count: '802', color: 'bg-rose-500' },
            ].map((wa, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full shadow-sm animate-pulse", wa.color)} />
                  <div>
                    <div className="text-xs font-black text-slate-900 tracking-wider">{wa.num}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{wa.builder}</div>
                  </div>
                </div>
                <div className="text-xs font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{wa.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Activity</h3>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clear Log</button>
          </div>
          <div className="p-6 space-y-5">
            {[
              { icon: '🚀', text: 'Skyline Infra added 34 new leads', time: '2 min ago', color: 'emerald' },
              { icon: '💎', text: 'Apex Builders renewed Pro plan', time: '18 min ago', color: 'indigo' },
              { icon: '⚠️', text: 'GreenCity Dev WhatsApp limit 90%', time: '1 hr ago', color: 'amber' },
              { icon: '👋', text: 'New builder Orbit Realty registered', time: '3 hr ago', color: 'blue' },
            ].map((act, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-lg shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                  {act.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-bold text-slate-700 leading-tight">
                    {act.text.split(' ').map((word, j) => (
                      builders.some(b => b.company.includes(word)) 
                        ? <span key={j} className="text-indigo-600 font-black">{word} </span> 
                        : word + ' '
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">System Health</h3>
          </div>
          <div className="p-8 flex flex-col items-center justify-center flex-1 text-center">
             <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full border-8 border-slate-50 flex items-center justify-center">
                   <div className="w-20 h-20 rounded-full border-8 border-emerald-500 border-t-transparent animate-spin" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                   <span className="text-xl font-black text-slate-900">99.9</span>
                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest -mt-1">%</span>
                </div>
             </div>
             <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">All Systems Operational</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 max-w-[200px]">
                Global latency: <span className="text-slate-900">42ms</span> • Uptime: <span className="text-slate-900">14d 2h</span>
             </p>
             <button className="mt-8 w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                View Detailed Status
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
