'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, Building2, Clock, CheckCircle2, XCircle, PhoneCall, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: 'New', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: Clock },
  contacted: { label: 'Contacted', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: PhoneCall },
  converted: { label: 'Converted', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: XCircle },
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 1, currentPage: 1 });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      const res = await axios.get(`/admin-leads?${params}`);
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchLeads(1), 300);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await axios.put(`/admin-leads/${id}`, { status });
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status } : l));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await axios.delete(`/admin-leads/${id}`);
      setLeads(prev => prev.filter(l => l._id !== id));
      toast.success('Lead deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const counts = leads.reduce((acc: any, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Enquiry Leads</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Leads submitted from the landing page</p>
        </div>
        <button onClick={() => fetchLeads(pagination.currentPage)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
              className={cn(
                'p-4 rounded-2xl border text-left transition-all',
                statusFilter === key ? 'ring-2 ring-indigo-500 ring-offset-1' : '',
                cfg.color
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon size={16} />
                <span className="text-2xl font-black">{counts[key] || 0}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
        >
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            {pagination.totalRecords} Total Leads
          </h3>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-400">No leads found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {leads.map((lead) => {
              const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
              const Icon = cfg.icon;
              return (
                <div key={lead._id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                    {lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{lead.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone size={10} /> {lead.phone}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building2 size={10} /> {lead.companyName}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="hidden md:block text-right shrink-0">
                    <p className="text-[11px] text-slate-400 font-medium">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-slate-300">
                      {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider flex items-center gap-1 shrink-0', cfg.color)}>
                    <Icon size={10} />
                    {cfg.label}
                  </span>

                  {/* Status Dropdown */}
                  <select
                    value={lead.status}
                    disabled={updatingId === lead._id}
                    onChange={e => updateStatus(lead._id, e.target.value)}
                    className="text-xs font-semibold px-2 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shrink-0 disabled:opacity-50"
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, c]) => (
                      <option key={key} value={key}>{c.label}</option>
                    ))}
                  </select>

                  {/* Delete */}
                  <button
                    onClick={() => deleteLead(lead._id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage <= 1}
                onClick={() => fetchLeads(pagination.currentPage - 1)}
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Prev
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => fetchLeads(pagination.currentPage + 1)}
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
