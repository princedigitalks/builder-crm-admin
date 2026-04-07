'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import PlanModal from '@/components/CreatePlanModal';
import CommonTable from '@/components/ui/CommonTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchPlans, Plan, PlanState, updatePlan, deletePlan } from '@/redux/slices/planSlice';
import {
  Loader2, Plus, Users, Globe, MessageSquare,
  Search, Trash2, Edit3, Sparkles,
  Filter, CheckCircle2, Crown, Zap, Star,
  ShieldCheck, BarChart3, Infinity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PLAN_THEMES = [
  { 
    gradient: 'from-indigo-600 to-violet-600', 
    light: 'bg-indigo-50', 
    text: 'text-indigo-600', 
    border: 'border-indigo-100', 
    icon: <Crown size={16} /> 
  },
  { 
    gradient: 'from-emerald-500 to-teal-500', 
    light: 'bg-emerald-50', 
    text: 'text-emerald-600', 
    border: 'border-emerald-100', 
    icon: <Zap size={16} /> 
  },
  { 
    gradient: 'from-amber-500 to-orange-500', 
    light: 'bg-amber-50', 
    text: 'text-amber-600', 
    border: 'border-amber-100', 
    icon: <Star size={16} /> 
  },
  { 
    gradient: 'from-rose-500 to-pink-500', 
    light: 'bg-pink-50', 
    text: 'text-pink-600', 
    border: 'border-pink-100', 
    icon: <Sparkles size={16} /> 
  },
];

export default function SubscriptionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { plans, loading } = useSelector((state: RootState) => state.plan as PlanState);

  useEffect(() => { dispatch(fetchPlans()); }, [dispatch]);

  const handleCreate = () => { setSelectedPlan(null); setIsModalOpen(true); };
  const handleEdit = (plan: Plan) => { setSelectedPlan(plan); setIsModalOpen(true); };

  const handleToggleStatus = async (plan: Plan) => {
    const newStatus = plan.status === 'active' ? 'inactive' : 'active';
    try {
      await dispatch(updatePlan({ id: plan._id!, data: { ...plan, status: newStatus } })).unwrap();
      toast.success(`Plan ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (err: any) {
      toast.error(err || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this tier?')) return;
    setDeletingId(id);
    try {
      await dispatch(deletePlan(id)).unwrap();
      toast.success('Plan removed');
    } catch (err: any) {
      toast.error(err || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPlans = plans.filter(p =>
    p.planName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Tier Information',
      key: 'planName',
      render: (item: Plan) => {
        const index = plans.indexOf(item);
        const theme = PLAN_THEMES[index % PLAN_THEMES.length];
        return (
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm bg-gradient-to-br", theme.gradient)}>
              {theme.icon}
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 tracking-tight">{item.planName}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.duration}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Pricing',
      key: 'price',
      render: (item: Plan) => (
        <div className="flex items-baseline gap-0.5 font-black text-slate-900">
          <span className="text-[10px] text-slate-400 font-bold">₹</span>
          <span className="text-sm tracking-tight">{item.price.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Capacity',
      key: 'limits',
      render: (item: Plan) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <Users size={10} className="text-slate-300 mb-0.5" />
            <span className="text-[10px] font-black text-slate-600">{item.noOfStaff || '∞'}</span>
          </div>
          <div className="w-[1px] h-4 bg-slate-100" />
          <div className="flex flex-col items-center">
            <Globe size={10} className="text-slate-300 mb-0.5" />
            <span className="text-[10px] font-black text-slate-600">{item.noOfSites || '∞'}</span>
          </div>
          <div className="w-[1px] h-4 bg-slate-100" />
          <div className="flex flex-col items-center">
            <MessageSquare size={10} className="text-slate-300 mb-0.5" />
            <span className="text-[10px] font-black text-slate-600">{item.noOfWhatsapp || '∞'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: Plan) => (
        <div 
          onClick={() => handleToggleStatus(item)}
          className={cn(
            "w-8 h-4.5 rounded-full p-[2px] transition-colors cursor-pointer",
            item.status === 'active' ? "bg-slate-900" : "bg-slate-200"
          )}
        >
          <motion.div 
            animate={{ x: item.status === 'active' ? 14 : 0 }}
            className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"
          />
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (item: Plan) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-1.5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg text-slate-400 transition-all border border-transparent"
          >
            <Edit3 size={12} strokeWidth={3} />
          </button>
          <button
            onClick={() => handleDelete(item._id!)}
            className="p-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-lg text-rose-400 transition-all border border-rose-100"
          >
            <Trash2 size={12} strokeWidth={3} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-6">
      
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">Subscription Tiers</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace Capacity Console</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 active:scale-95"
          >
            <Plus size={16} strokeWidth={4} />
            Create Plan
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Tiers', value: plans.filter(p => p.status === 'active').length, icon: Crown, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Global Users', value: '1,240', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Sites', value: '42', icon: Globe, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Projected Revenue', value: '₹4.2M', icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Directory Table */}
      <CommonTable 
        title="Plan Directory"
        columns={columns}
        data={filteredPlans}
        loading={loading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onPageChange={() => {}}
        pagination={{
          totalItems: filteredPlans.length,
          totalPages: 1,
          currentPage: 1,
          limit: 100
        }}
        searchPlaceholder="Filter tiers..."
      />

      {/* Modal */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedPlan}
      />
    </div>
  );
}
