'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { MoreVertical, Mail, Phone, Calendar, Layers, HardHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAllBuilders } from '@/redux/slices/builderSlice';
import CommonTable from '@/components/CommonTable';
import { motion } from 'framer-motion';

export default function BuildersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { builders, loading, pagination } = useSelector((state: RootState) => state.builder);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(fetchAllBuilders({ page, search: searchTerm }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, page, dispatch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
    setPage(1); // Reset to first page on search
  };

  const columns = [
    {
      header: "Builder & Company",
      key: "companyName",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[11px] uppercase">
             {item.companyName.slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{item.companyName}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-500 font-medium">{item.userId?.fullName}</span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] text-slate-500 font-medium lowercase italic">{item.userId?.email}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Contact Details",
      key: "phone",
      render: (item: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
             <Phone size={11} className="text-slate-400" />
             {item.userId?.phone}
          </div>
          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 overflow-hidden max-w-[150px] truncate">
             {item.address}
          </div>
        </div>
      )
    },
    {
      header: "Plan & Resources",
      key: "planId",
      render: (item: any) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
              item.planId?.planName === 'Enterprise' ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
            )}>
              {item.planId?.planName}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{item.planId?.duration}</span>
          </div>
          <div className="flex gap-2 text-[10px] font-bold text-slate-500">
             <span className="flex items-center gap-1"><HardHat size={10} /> {item.planId?.noOfSites}</span>
             <span className="flex items-center gap-1"><Layers size={10} /> {item.planId?.noOfStaff}</span>
          </div>
        </div>
      )
    },
    {
      header: "Financials",
      key: "amountPaid",
      render: (item: any) => (
        <div className="space-y-1">
          <div className="text-sm font-black text-slate-900">₹{item.amountPaid?.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase transition-colors hover:text-accent cursor-pointer group">
             <Calendar size={10} />
             {new Date(item.subscriptionEndDate).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      header: "Status",
      key: "isActive",
      render: (item: any) => (
        <span className={cn(
          "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase",
          item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        )}>
          {item.isActive ? 'Active' : 'Suspended'}
        </span>
      )
    },
    {
      header: "Actions",
      key: "actions",
      className: "text-right",
      render: () => (
        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical size={16} />
        </button>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <CommonTable 
        title="Building Ecosystem"
        columns={columns}
        data={builders}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
        searchPlaceholder="Search by company or address..."
        actionButton={
          <button className="bg-accent text-white px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95">
            + New Builder
          </button>
        }
      />
    </motion.div>
  );
}
