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
  Calendar, Filter, ArrowRight, CheckCircle2, XCircle, Crown, Zap, Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PLAN_THEMES = [
  { gradient: 'from-violet-500 to-indigo-600', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', icon: <Crown size={20} /> },
  { gradient: 'from-emerald-400 to-teal-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: <Zap size={20} /> },
  { gradient: 'from-amber-400 to-orange-500', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: <Star size={20} /> },
  { gradient: 'from-pink-500 to-rose-500', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', icon: <Sparkles size={20} /> },
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
    if (!confirm('Permanently delete this plan?')) return;
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

  const activePlans = plans.filter(p => p.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-[10px] font-black text-accent tracking-[4px] uppercase">Super Admin Portal</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Subscription Plans</h1>
          <p className="text-sm text-slate-400 font-medium mt-2">Manage pricing tiers and platform limits for all builders</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-[0.97] w-fit"
        >
          <Plus size={16} strokeWidth={3} />
          ADD NEW PLAN
        </button>
      </div>

      {/* Stats + Search Bar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-2 relative group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-5 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all shadow-sm"
          />
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
            <Filter size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Plans</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">{plans.length}</p>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</p>
            <p className="text-2xl font-black text-emerald-600 leading-none mt-0.5">{activePlans}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-slate-100">
          <Loader2 size={32} className="animate-spin text-accent mb-4" />
          <p className="text-[10px] font-black text-slate-400 tracking-[4px] uppercase">Loading Plans...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5 text-slate-200">
            <Filter size={36} strokeWidth={1} />
          </div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No plans found</p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mt-4 text-xs font-black text-accent hover:underline flex items-center gap-1.5">
              CLEAR SEARCH <ArrowRight size={13} />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlans.map((plan, index) => {
            const theme = PLAN_THEMES[index % PLAN_THEMES.length];
            const isDeleting = deletingId === plan._id;
            return (
              <div
                key={plan._id}
                className={cn(
                  "group bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col",
                  plan.status === 'inactive' ? "border-slate-100 opacity-60" : "border-slate-100 hover:-translate-y-1"
                )}
              >
                {/* Card Top Gradient Banner */}
                <div className={cn("h-2 w-full bg-gradient-to-r", theme.gradient)} />

                <div className="p-6 flex flex-col flex-1 gap-5">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br text-white shadow-lg", theme.gradient)}>
                        {theme.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 group-hover:text-accent transition-colors">{plan.planName}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">#{plan._id?.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                      plan.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {plan.status === 'active' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      {plan.status}
                    </div>
                  </div>

                  {/* Price */}
                  <div className={cn("rounded-2xl p-4 flex items-center justify-between", theme.light, theme.border, "border")}>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className={cn("text-sm font-bold", theme.text)}>₹</span>
                        <span className="text-3xl font-black text-slate-900">{plan.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={cn("flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border text-xs font-black uppercase", theme.border, theme.text)}>
                      <Calendar size={12} />
                      {plan.duration}
                    </div>
                  </div>

                  {/* Limits */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: <Users size={15} />, label: 'Staff', value: plan.noOfStaff, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                      { icon: <Globe size={15} />, label: 'Sites', value: plan.noOfSites, color: 'text-teal-500', bg: 'bg-teal-50' },
                      { icon: <MessageSquare size={15} />, label: 'WhatsApp', value: plan.noOfWhatsapp, color: 'text-amber-500', bg: 'bg-amber-50' },
                    ].map((cap, i) => (
                      <div key={i} className="flex flex-col items-center bg-slate-50 rounded-2xl py-3 px-2 gap-1.5">
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", cap.bg, cap.color)}>
                          {cap.icon}
                        </div>
                        <span className="text-base font-black text-slate-800 leading-none">{cap.value === 0 ? '∞' : cap.value}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight leading-none">{cap.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-auto pt-1">
                    {/* Toggle */}
                    <button
                      onClick={() => handleToggleStatus(plan)}
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 shadow-inner flex-shrink-0",
                        plan.status === 'active' ? "bg-emerald-500" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full shadow transition-transform duration-300",
                        plan.status === 'active' ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest flex-1", plan.status === 'active' ? "text-emerald-500" : "text-slate-400")}>
                      {plan.status === 'active' ? 'Live' : 'Paused'}
                    </span>
                    <button
                      onClick={() => handleEdit(plan)}
                      className="w-9 h-9 bg-slate-50 hover:bg-accent hover:text-white border border-slate-100 rounded-xl text-slate-400 transition-all flex items-center justify-center"
                      title="Edit Plan"
                    >
                      <Edit3 size={15} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id!)}
                      disabled={isDeleting}
                      className="w-9 h-9 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 rounded-xl text-red-400 transition-all flex items-center justify-center disabled:opacity-50"
                      title="Delete Plan"
                    >
                      {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Plan Card */}
          <button
            onClick={handleCreate}
            className="group bg-slate-50 hover:bg-white border-2 border-dashed border-slate-200 hover:border-accent rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 min-h-[320px] hover:shadow-xl hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-accent border border-slate-200 group-hover:border-accent flex items-center justify-center text-slate-300 group-hover:text-white transition-all shadow-sm">
              <Plus size={24} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-slate-400 group-hover:text-accent transition-colors uppercase tracking-widest">New Plan</p>
              <p className="text-xs text-slate-300 font-medium mt-1">Click to create</p>
            </div>
          </button>
        </div>
      )}

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedPlan}
      />
    </div>
  );
}
