'use client';

import React from 'react';
import { Users2, ShieldCheck, ExternalLink, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { MetricCard } from '@/components/MetricCard';
import { builders } from '@/lib/mock-data';
import CommonTable from '@/components/ui/CommonTable';

export default function AnalyticsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const columns = [
    {
      header: 'Builder & Organization',
      key: 'company',
      render: (item: any) => (
        <div>
          <div className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{item.company}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.site}</div>
        </div>
      )
    },
    {
      header: 'Total Leads',
      key: 'leads',
      render: (item: any) => (
        <div className="flex items-center gap-2">
           <span className="text-sm font-black text-slate-900 tracking-tight">{item.leads.toLocaleString()}</span>
           <span className="text-[10px] text-emerald-500 font-bold">↑ 12%</span>
        </div>
      )
    },
    {
      header: 'Engagement',
      key: 'contacted',
      render: (item: any) => (
        <div className="flex flex-col gap-1.5 min-w-[120px]">
          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Contacted</span>
            <span>{Math.round(item.leads * 0.8).toLocaleString()}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      )
    },
    {
      header: 'Site Visits',
      key: 'visits',
      render: (item: any) => (
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-slate-600">{(item.leads * 0.15).toFixed(0)}</span>
           <div className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded uppercase border border-amber-100">
             High Intent
           </div>
        </div>
      )
    },
    {
      header: 'Conversion',
      key: 'conversion',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="text-sm font-black text-emerald-600">{(item.leads * 0.12).toFixed(0)}</div>
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg uppercase">
            12.4%
          </span>
        </div>
      )
    }
  ];

  const filteredBuilders = builders.filter(b => 
    b.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto pb-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Leads (All)" value="12,483" change="↑ 18% MoM" icon={Users2} colorClass="accent" />
        <MetricCard label="Closed Won" value="1,771" change="14.2% conversion" icon={ShieldCheck} colorClass="green" />
        <MetricCard label="Site Visits" value="3,104" change="↑ 8% this month" icon={ExternalLink} colorClass="amber" />
        <MetricCard label="Avg Deal Value" value="₹84L" change="Median: ₹62L" icon={IndianRupee} colorClass="blue" />
      </div>

      <CommonTable 
        title="Builder Performance Analytics"
        columns={columns}
        data={filteredBuilders}
        loading={false}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onPageChange={() => {}}
        pagination={{
          totalItems: filteredBuilders.length,
          totalPages: 1,
          currentPage: 1,
          limit: 10
        }}
        searchPlaceholder="Filter performance metrics..."
      />
    </motion.div>
  );
}
