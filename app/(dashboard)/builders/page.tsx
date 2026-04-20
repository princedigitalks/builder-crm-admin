'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { MoreVertical, Mail, Phone, Calendar, Layers, HardHat, Plus, Edit3, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAllBuilders, Builder, Subscription, deleteBuilder } from '@/redux/slices/builderSlice';
import { fetchPlans } from '@/redux/slices/planSlice';
import CommonTable from '@/components/ui/CommonTable';
import { motion, AnimatePresence } from 'framer-motion';
import BuilderModal from '@/components/modals/BuilderModal';
import Swal from 'sweetalert2';

export default function BuildersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { builders, loading, pagination } = useSelector((state: RootState) => state.builder);
  const { plans } = useSelector((state: RootState) => state.plan);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilder, setEditingBuilder] = useState<Builder | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(fetchAllBuilders({ page, search: searchTerm }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, page, dispatch]);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
    setPage(1); // Reset to first page on search
  };

  // Modal handlers
  const handleOpenModal = (builder: Builder | null = null) => {
    setEditingBuilder(builder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBuilder(null);
  };

  // Delete handler
  const handleDelete = async (builder: Builder) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${builder.companyName}"? This will deactivate their account and all associated data.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        title: 'text-lg font-bold text-slate-900',
        htmlContainer: 'text-sm text-slate-600',
        confirmButton: 'px-4 py-2 rounded-lg text-sm font-semibold',
        cancelButton: 'px-4 py-2 rounded-lg text-sm font-semibold'
      }
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteBuilder(builder._id)).unwrap();
        Swal.fire({
          title: 'Deleted!',
          text: 'Builder has been deleted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl',
            title: 'text-lg font-bold text-emerald-600'
          }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete builder. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'rounded-2xl',
            title: 'text-lg font-bold text-red-600'
          }
        });
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const columns = [
    {
      header: "Builder & Company",
      key: "companyName",
      render: (item: Builder) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[11px] uppercase">
             {item?.companyName?.slice(0, 2)}
          </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{item.companyName || 'Not provided'}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-500 font-medium">{item.userId?.fullName || 'Not provided'}</span>
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
      render: (item: Builder) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
             <Phone size={13} className="text-slate-400" />
             {item.userId?.phone}
          </div>
           <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 overflow-hidden max-w-[150px] truncate">
              {item.address || 'Not provided'}
           </div>
        </div>
      )
    },
    {
      header: "Plan & Resources",
      key: "subscriptions",
      render: (item: Builder) => {
        const activeSub = item.subscriptions.find((s: Subscription) => s.status === 'active');
        const upcomingSub = item.subscriptions.find((s: Subscription) => s.status === 'upcoming');
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded",
                activeSub?.planName === 'Enterprise' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"
              )}>
                {activeSub?.planName || 'No Active Plan'}
              </span>
              {upcomingSub && (
                <span className="text-xs font-medium px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-pulse">
                  Upcoming
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-slate-500" title="Staff">
                <Layers size={11} className="text-indigo-400" />
                <span className="font-medium">{item.currentLimits.noOfStaff}</span>
                <span className="text-slate-400">staff</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500" title="Sites">
                <HardHat size={11} className="text-amber-400" />
                <span className="font-medium">{item.currentLimits.noOfSites}</span>
                <span className="text-slate-400">sites</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500" title="WhatsApp Numbers">
                <MessageSquare size={11} className="text-emerald-400" />
                <span className="font-medium">{item.currentLimits.noOfWhatsapp}</span>
                <span className="text-slate-400">wa</span>
              </span>
            </div>
          </div>
        );
      }
    },
    {
      header: "Financials",
      key: "billing",
      render: (item: Builder) => {
        const activeSub = item.subscriptions.find((s: Subscription) => s.status === 'active');
        return (
          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-900">₹{activeSub?.amountPaid?.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
               <Calendar size={11} />
               {activeSub ? new Date(activeSub.endDate).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        );
      }
    },
    {
      header: "Status",
      key: "isActive",
      render: (item: Builder) => (
        <span className={cn(
          "text-xs font-semibold px-2.5 py-1 rounded-full",
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
      render: (item: Builder) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenModal(item)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Edit Builder"
          >
            <Edit3 size={14} />
          </button>
          <div className="relative dropdown-container">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === item._id ? null : item._id)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <MoreVertical size={14} />
            </button>
            {dropdownOpen === item._id && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    handleDelete(item);
                    setDropdownOpen(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Building Ecosystem</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all builder accounts and their subscriptions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={18} />
          Add New Builder
        </button>
      </div>

      <CommonTable
        title=""
        columns={columns}
        data={builders}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
        searchPlaceholder="Search by company or address..."

      />

      {/* Builder Modal */}
      <BuilderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        loading={loading}
        initialData={editingBuilder}
        plans={plans}
      />
    </motion.div>
  );
}
