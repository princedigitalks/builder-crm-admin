'use client';

import React, { useState, useEffect } from 'react';
import { X, Layers, IndianRupee, Clock, Users, Globe, MessageSquare, Shield, Sparkles, Zap, CheckCircle2, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createPlan, updatePlan, Plan, PlanState } from '@/redux/slices/planSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Plan | null;
}

export default function PlanModal({ isOpen, onClose, initialData }: PlanModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.plan as PlanState);

  const [formData, setFormData] = useState<Plan>({
    planName: '',
    price: 0,
    duration: 'Monthly',
    noOfStaff: 0,
    noOfSites: 0,
    noOfWhatsapp: 0,
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        planName: '',
        price: 0,
        duration: 'Monthly',
        noOfStaff: 0,
        noOfSites: 0,
        noOfWhatsapp: 0,
        status: 'active',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?._id) {
        await dispatch(updatePlan({ id: initialData._id, data: formData })).unwrap();
        toast.success('Changes saved!');
      } else {
        await dispatch(createPlan(formData)).unwrap();
        toast.success('Plan created!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error || 'Failed to save plan');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 ml-64">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Lite Modal Header */}
            <div className="p-8 pb-4 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                   <Zap size={14} className="text-indigo-600" />
                   <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase opacity-70">Configuration</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                   {initialData ? 'Update Tier' : 'New Subscription Plan'}
                </h2>
              </div>
              <motion.button 
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-900 border border-slate-100"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6 overflow-y-auto max-h-[75vh] scrollbar-hide">
              <div className="space-y-5">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Display Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                      <Layers size={18} strokeWidth={2.5} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Enterprise Pro"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold placeholder:text-slate-200 focus:outline-none focus:bg-white focus:border-slate-300 transition-all shadow-sm"
                      value={formData.planName}
                      onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Price (₹)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                        <IndianRupee size={18} strokeWidth={2.5} />
                      </div>
                      <input
                        type="number"
                        required
                        placeholder="0"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold placeholder:text-slate-200 focus:outline-none focus:bg-white focus:border-slate-300 transition-all shadow-sm"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Cycle</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                        <Clock size={18} strokeWidth={2.5} />
                      </div>
                      <select
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-300 transition-all appearance-none shadow-sm cursor-pointer"
                        value={formData.duration}
                        onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Bi-Annually">Bi-Annually</option>
                        <option value="Annually">Annually</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Resource Quotas */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource limits</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: <Users size={15} />, key: 'noOfStaff', label: 'Staff' },
                      { icon: <Globe size={15} />, key: 'noOfSites', label: 'Sites' },
                      { icon: <MessageSquare size={15} />, key: 'noOfWhatsapp', label: 'WA' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="relative group/field">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-slate-900 transition-colors">
                            {item.icon}
                          </div>
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full pl-9 pr-2 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-slate-400 transition-all shadow-sm"
                            value={formData[item.key as keyof Plan] || ''}
                            onChange={(e) => setFormData({ ...formData, [item.key]: Number(e.target.value) })}
                          />
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase text-center">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 text-center uppercase tracking-widest font-black leading-none opacity-50">Set "0" for Unlimited access</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[11px] font-black tracking-widest transition-all uppercase"
                >
                  Discard
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black tracking-widest shadow-xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase"
                >
                  {loading ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {initialData ? <CheckCircle2 size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                      {initialData ? 'Apply Changes' : 'Finalize Tier'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("animate-spin", className)}
  >
    <path d="M12 2v4" />
    <path d="M18 12h4" />
    <path d="m16.2 16.2 2.9 2.9" />
    <path d="M12 18v4" />
    <path d="m4.9 19.1 2.9-2.9" />
    <path d="M2 12h4" />
    <path d="m4.9 4.9 2.9 2.9" />
  </svg>
);
