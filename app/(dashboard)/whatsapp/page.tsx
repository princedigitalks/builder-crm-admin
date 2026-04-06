'use client';

import React, { useState } from 'react';
import { MessageSquare, Settings, Activity, Search, Phone, History, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { builders } from '@/lib/mock-data';

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6">
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">WhatsApp Hub</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Messaging Infrastructure</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-emerald-100">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">API Online</span>
          </div>
        </div>
      </div>

      {/* Snapshot Stats (Compact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Numbers', value: '18', icon: <Phone size={14} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Messages Sent Today', value: '6,420', icon: <MessageSquare size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'API Quota Used', value: '68%', icon: <Settings size={14} />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
               {stat.icon}
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">{stat.label}</p>
               <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-1 bg-slate-50 p-1 rounded-xl w-fit">
              {['Overview', 'Logs', 'Settings'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[11px] uppercase tracking-widest font-black transition-all",
                    activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-slate-300 transition-all w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Endpoint Number</th>
                  <th className="px-6 py-4">Client (Builder)</th>
                  <th className="px-6 py-4">Linked Site</th>
                  <th className="px-6 py-4">Traffic (30d)</th>
                  <th className="px-6 py-4">Health</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {builders.filter(b => b.company.toLowerCase().includes(searchTerm.toLowerCase())).map((b) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={b.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                               <MessageSquare size={12} fill="currentColor" />
                            </div>
                            <span className="font-bold text-slate-900 text-sm tracking-tight">{b.wa}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-slate-900">{b.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                           {b.site}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <Activity size={12} className="text-slate-300" />
                           <span className="text-xs font-black text-slate-900">{b.leads.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <History size={14} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-1">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
