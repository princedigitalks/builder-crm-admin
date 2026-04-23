'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield, Settings2, Hash, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WhatsAppCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  initialData?: any;
}

export default function WhatsAppCredentialsModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData
}: WhatsAppCredentialsModalProps) {
  const [formData, setFormData] = useState({
    accessToken: '',
    apiVersion: '',
    phoneNumberId: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        accessToken: initialData?.accessToken || '',
        apiVersion: initialData?.apiVersion || '',
        phoneNumberId: initialData?.phoneNumberId || '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Shield className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">WhatsApp Credentials</h2>
                  <p className="text-sm text-slate-500">Configure Meta API details for {initialData?.whatsappNumber || 'this number'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 ml-1">Access Token</label>
                <div className="relative group">
                  <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    name="accessToken"
                    type="text" 
                    placeholder="EAAG..." 
                    value={formData.accessToken}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all placeholder:text-slate-300" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">API Version</label>
                  <div className="relative group">
                    <Settings2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      name="apiVersion"
                      type="text" 
                      placeholder="v21.0" 
                      value={formData.apiVersion}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all placeholder:text-slate-300" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Phone Number ID</label>
                  <div className="relative group">
                    <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      name="phoneNumberId"
                      type="text" 
                      placeholder="123456789..." 
                      value={formData.phoneNumberId}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all placeholder:text-slate-300" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 disabled:bg-indigo-400"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Save Credentials
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
