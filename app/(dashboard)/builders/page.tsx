'use client';

import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAllBuilders, Builder } from '@/redux/slices/builderSlice';

export default function BuildersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { builders, loading, error } = useSelector((state: RootState) => state.builder);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Builders');

  useEffect(() => {
    dispatch(fetchAllBuilders());
  }, [dispatch]);

  const filteredBuilders = builders.filter(b => {
    const matchesSearch = 
      b.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'All Builders') return matchesSearch;
    if (activeTab === 'Active') return matchesSearch && b.isActive;
    if (activeTab === 'Suspended') return matchesSearch && !b.isActive;
    return matchesSearch;
  });

  if (loading && builders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 size={32} className="animate-spin text-accent mb-4" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Builders...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['All Builders', 'Active', 'Suspended'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              activeTab === tab ? "bg-white text-accent shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 text-sm">All Registered Builders</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search builder..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all w-full sm:w-48"
              />
            </div>
            <button className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-100 hidden sm:block">
              + Add Builder
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Company & Owner</th>
                <th className="px-6 py-4">Plan & Subscription</th>
                <th className="px-6 py-4">Allocated Resources</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredBuilders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
                      {searchTerm ? 'No builders match your search' : 'No builders found'}
                    </td>
                  </tr>
                ) : (
                  filteredBuilders.map((b) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={b._id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[11px] uppercase">
                            {b.companyName?.slice(0, 2) || 'BR'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{b.companyName || 'Unknown Corp'}</div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {b.userId?.fullName} • {b.userId?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                            b.planId?.planName === 'Enterprise' ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                          )}>
                            {b.planId?.planName || 'No Plan'}
                          </span>
                          <div className="text-[10px] text-slate-400 font-medium lowercase">
                            ends: {new Date(b.subscriptionEndDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600">
                             <span>Staff: {b.planId?.noOfStaff === 0 ? '∞' : b.planId?.noOfStaff}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600">
                             <span>Sites: {b.planId?.noOfSites === 0 ? '∞' : b.planId?.noOfSites}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="text-sm font-bold text-slate-900">₹{b.amountPaid?.toLocaleString()}</div>
                         <div className="text-[10px] text-slate-400 font-medium">{b.planId?.duration}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase",
                          b.isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {b.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
