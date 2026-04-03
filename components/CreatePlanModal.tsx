'use client';

import React, { useState, useEffect } from 'react';
import { X, Layers, IndianRupee, Clock, Users, Globe, MessageSquare, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createPlan, updatePlan, Plan, PlanState } from '@/redux/slices/planSlice';
import { toast } from 'react-hot-toast';

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
        toast.success('Plan updated successfully!');
      } else {
        await dispatch(createPlan(formData)).unwrap();
        toast.success('Plan created successfully!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error || 'Failed to save plan');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />
      <div
        className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">{initialData ? 'Edit Plan' : 'Create New Plan'}</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Plan Configuration</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-slate-600 border border-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[75vh] scrollbar-hide">
          <div className="space-y-5">
            <div className="group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 block px-1">Plan Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors">
                  <Layers size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Pro"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 block px-1">Price (₹)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors">
                    <IndianRupee size={18} />
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-200 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 block px-1">Duration</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors">
                    <Clock size={18} />
                  </div>
                  <select
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all appearance-none"
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

            <div className="p-6 bg-slate-50 rounded-3xl space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-accent" size={16} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Resource Limits</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                   <div className="relative group/field w-full">
                      <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-accent" />
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full pl-9 pr-3 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-accent transition-all"
                        value={formData.noOfStaff || ''}
                        onChange={(e) => setFormData({ ...formData, noOfStaff: Number(e.target.value) })}
                      />
                   </div>
                   <span className="text-[8px] font-black text-slate-400 mt-2 uppercase">Staff</span>
                </div>
                <div className="flex flex-col items-center">
                   <div className="relative group/field w-full">
                      <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-accent" />
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full pl-9 pr-3 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-accent transition-all"
                        value={formData.noOfSites || ''}
                        onChange={(e) => setFormData({ ...formData, noOfSites: Number(e.target.value) })}
                      />
                   </div>
                   <span className="text-[8px] font-black text-slate-400 mt-2 uppercase">Sites</span>
                </div>
                <div className="flex flex-col items-center">
                   <div className="relative group/field w-full">
                      <MessageSquare size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-accent" />
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full pl-9 pr-3 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-accent transition-all"
                        value={formData.noOfWhatsapp || ''}
                        onChange={(e) => setFormData({ ...formData, noOfWhatsapp: Number(e.target.value) })}
                      />
                   </div>
                   <span className="text-[8px] font-black text-slate-400 mt-2 uppercase">WA</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest leading-none">Use 0 for Unlimited</p>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-3xl text-sm font-bold transition-all border border-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 px-4 bg-accent text-white rounded-3xl text-sm font-black transition-all shadow-xl shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                initialData ? 'SAVE CHANGES' : 'CREATE PLAN'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
