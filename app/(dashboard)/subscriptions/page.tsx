'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import PlanModal from '@/components/CreatePlanModal';
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
      await dispatch(updatePlan({ id: plan._id!, data: { status: newStatus } })).unwrap();
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6">
      
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Subscription Tiers</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace Capacity Console</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Search tiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold placeholder:text-slate-200 focus:outline-none focus:bg-white focus:border-slate-300 transition-all w-48 sm:w-64"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="flex items-center gap-2 bg-slate-900 px-5 py-2.5 rounded-xl text-[10px] font-black text-white tracking-widest transition-all shadow-lg shadow-slate-200 uppercase"
          >
            <Plus size={14} strokeWidth={4} />
            Add Plan
          </motion.button>
        </div>
      </div>

      {/* Snapshot Stats (Compact) */}
      <div className="flex items-center gap-6">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-900" />
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Total: {plans.length}</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Active: {plans.filter(p => p.status === 'active').length}</span>
         </div>
      </div>

      {/* Miniature Card Grid */}
      {loading && plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-50">
          <Loader2 size={24} className="animate-spin text-slate-200 mb-4" />
          <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">Syncing</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 border-dashed border-2">
          <p className="text-[10px] font-black text-slate-300 tracking-widest uppercase">No subscription models found</p>
          <button onClick={() => setSearchQuery('')} className="mt-2 text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase">Reset</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan, index) => {
              const theme = PLAN_THEMES[index % PLAN_THEMES.length];
              const isDeleting = deletingId === plan._id;
              const isActive = plan.status === 'active';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  key={plan._id}
                  className={cn(
                    "group relative bg-white border rounded-2xl p-5 flex flex-col transition-all duration-300",
                    isActive ? "border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200" : "border-slate-100 opacity-60 bg-slate-50/50"
                  )}
                >
                  {/* Miniature Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl bg-gradient-to-br", theme.gradient)}>
                      {theme.icon}
                    </div>
                    <div className={cn(
                      "group/switch relative w-9 h-4.5 rounded-full p-[2px] transition-colors cursor-pointer",
                      isActive ? "bg-slate-900" : "bg-slate-200"
                    )} onClick={() => handleToggleStatus(plan)}>
                      <motion.div 
                        animate={{ x: isActive ? 18 : 0 }}
                        className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Body: Compact Title & Price */}
                  <div>
                    <h3 className="text-sm font-black text-slate-900 mb-1 truncate">{plan.planName}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-xs font-bold text-slate-400">₹</span>
                      <span className="text-2xl font-black text-slate-900 leading-none">{plan.price.toLocaleString()}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase ml-1">/{plan.duration.slice(0, 3)}</span>
                    </div>
                  </div>

                  {/* Feature Strip: One-Liner Icons */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-5 mb-5">
                    {[
                      { icon: <Users size={12} />, value: plan.noOfStaff },
                      { icon: <Globe size={12} />, value: plan.noOfSites },
                      { icon: <MessageSquare size={12} />, value: plan.noOfWhatsapp },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 min-w-[32px]">
                        <span className="text-slate-300">{item.icon}</span>
                        <span className="text-xs font-black text-slate-900 leading-none">
                          {item.value === 0 ? <Infinity size={12} strokeWidth={3} /> : item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Integrated Action Row (Visible on Hover in Desktop, always on mobile) */}
                  <div className="mt-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg text-slate-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit3 size={11} strokeWidth={3} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Update</span>
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id!)}
                      disabled={isDeleting}
                      className="p-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-lg text-rose-400 transition-all border border-rose-100"
                    >
                      {isDeleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} strokeWidth={3} />}
                    </button>
                  </div>

                  {/* Small Ghost Badge for Status (if disabled) */}
                  {!isActive && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-100 rounded text-[7px] font-black text-slate-400 uppercase tracking-widest">
                       Disabled
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Ghost Mini Plan Block */}
            <motion.button
               whileTap={{ scale: 0.98 }}
               onClick={handleCreate}
               className="group relative bg-slate-50/50 border-2 border-dashed border-slate-100 hover:border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center transition-all duration-300 min-h-[220px]"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 shadow-sm">
                <Plus size={20} strokeWidth={3} />
              </div>
              <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Tier</p>
            </motion.button>
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedPlan}
      />
    </div>
  );
}
