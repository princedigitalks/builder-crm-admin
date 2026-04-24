'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, ToggleLeft as Toggle, ToggleRight, Key, User } from 'lucide-react';
import WhatsAppCredentialsModal from '@/components/modals/WhatsAppCredentialsModal';
import { cn } from '@/lib/utils';
import { getSocket } from '@/lib/socket';
import CommonTable from '@/components/ui/CommonTable';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchAdminWhatsappHubs, updateWhatsappHubStatus, syncHubUpdate, syncStatusUpdate, WhatsappHub } from '@/redux/slices/whatsappSiteSlice';
import Swal from 'sweetalert2';
import axiosInstance from '@/lib/axios';

export default function WhatsAppAdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { hubs, loading } = useSelector((state: RootState) => state.whatsappSite);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState<WhatsappHub | null>(null);

  useEffect(() => {
    dispatch(fetchAdminWhatsappHubs());

    const socket = getSocket();
    socket.on('whatsapp_page_update', (data: { action: 'add' | 'update'; whatsapp: WhatsappHub }) => {
      dispatch(syncHubUpdate(data));
    });

    socket.on('whatsapp_status_update', (update: { whatsappId: string; whatsappStatus: string; chatbotStatus: string }) => {
      dispatch(syncStatusUpdate(update));
    });

    return () => {
      socket.off('whatsapp_page_update');
      socket.off('whatsapp_status_update');
    };
  }, [dispatch]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await dispatch(updateWhatsappHubStatus({ id, data: { whatsappStatus: newStatus.toLowerCase() } })).unwrap();
      toast.success(`Connection status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error || 'Failed to update status');
    }
  };

  const handleChatbotToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await dispatch(updateWhatsappHubStatus({ id, data: { chatbotStatus: newStatus } })).unwrap();
      toast.success(`Chatbot is now ${newStatus}`);
    } catch (error: any) {
      toast.error(error || 'Failed to toggle chatbot');
    }
  };

  const handleUnlink = async (id: string, hubNumber: string) => {
    const result = await Swal.fire({
      title: 'Delete WhatsApp Hub?',
      text: `Do you want to permanently delete hub "${hubNumber}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Keep it',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'rounded-[2rem]',
        title: 'text-xl font-black text-slate-900',
        confirmButton: 'px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest',
        cancelButton: 'px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest'
      }
    });

    if (result.isConfirmed) {
      try {
        await dispatch(updateWhatsappHubStatus({ 
          id, 
          data: { 
            whatsappStatus: 'disconnected', 
            chatbotStatus: 'inactive',
            isDeleted: true
          } 
        })).unwrap();
        toast.success('WhatsApp Hub deleted successfully');
      } catch (error: any) {
        toast.error(error || 'Failed to delete hub');
      }
    }
  };

  const handleOpenCredModal = async (hub: WhatsappHub) => {
    setSelectedHub(hub);
    try {
      const response = await axiosInstance.get(`/site/admin/whatsapp-config/${encodeURIComponent(hub.number)}`);
      if (response.data.data) {
        setSelectedHub({ ...hub, ...response.data.data });
      }
    } catch (error) {
      console.error("Failed to fetch whatsapp config", error);
    }
    setIsCredModalOpen(true);
  };

  const handleSaveCredentials = async (data: any) => {
    if (!selectedHub) return;
    try {
      const payload = {
        number: selectedHub.number,
        builderId: selectedHub.builderId._id,
        ...data
      };
      await axiosInstance.post('/site/admin/whatsapp-config', payload);
      toast.success('Credentials saved successfully');
      setIsCredModalOpen(false);
      dispatch(fetchAdminWhatsappHubs());
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save credentials');
    }
  };

  const filteredData = hubs.filter(h => 
    h.builderId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 10;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    {
      header: 'Builder Name',
      key: 'builder',
      render: (item: WhatsappHub) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase border border-indigo-100">
             {item.builderId?.companyName?.slice(0, 2) || 'B'}
          </div>
          <span className="font-semibold text-slate-900 text-sm">{item.builderId?.companyName || 'Unknown'}</span>
        </div>
      )
    },
    {
      header: 'Number Name',
      key: 'name',
      render: (item: WhatsappHub) => (
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-slate-700">{item.name}</span>
        </div>
      )
    },
    {
      header: 'WhatsApp Number',
      key: 'number',
      render: (item: WhatsappHub) => (
        <div className="flex items-center gap-2">
          <Smartphone size={13} className="text-slate-400" />
          <span className="text-sm text-slate-600">{item.number}</span>
        </div>
      )
    },
    {
      header: 'Connection Health',
      key: 'whatsappStatus',
      render: (item: WhatsappHub) => (
        <select
          value={item.whatsappStatus === 'connected' ? 'Connected' : 'Disconnected'}
          onChange={(e) => handleStatusChange(item._id, e.target.value)}
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded border outline-none cursor-pointer transition-all",
            item.whatsappStatus === 'connected'
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          )}
        >
          <option value="Connected">Connected</option>
          <option value="Disconnected">Disconnected</option>
        </select>
      )
    },
    {
      header: 'Chatbot Engine',
      key: 'chatbotStatus',
      render: (item: WhatsappHub) => (
        <button
          onClick={() => handleChatbotToggle(item._id, item.chatbotStatus)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-sm",
            item.chatbotStatus === 'active'
              ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-200"
              : "bg-white text-slate-400 border-slate-100"
          )}
        >
          {item.chatbotStatus === 'active' ? <ToggleRight size={16} /> : <Toggle size={16} />}
          <span>{item.chatbotStatus === 'active' ? 'Active' : 'Inactive'}</span>
        </button>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (item: WhatsappHub) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenCredModal(item)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
            title="Add Credentials"
          >
            <Key size={14} />
          </button>
          <button
            onClick={() => handleUnlink(item._id, item.number)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
              (item.deleteRequested || item.isDeleted)
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white text-slate-500 border-slate-200 hover:text-rose-600 hover:border-rose-200",
              item.isDeleted && "opacity-50 cursor-not-allowed"
            )}
            title={item.isDeleted ? "Hub already deleted" : "Delete Hub"}
            disabled={item.isDeleted}
          >
            {item.isDeleted ? 'Deleted' : 'Delete'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6 pt-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">WhatsApp Hub Infrastructure</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <Smartphone size={12} className="text-indigo-500" />
            Centralized Messaging Management for Builders
          </p>
        </div>
      </div>

      <CommonTable 
        title="Infrastructure Endpoints"
        columns={columns}
        data={paginatedData}
        loading={loading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onPageChange={setCurrentPage}
        pagination={{
            totalItems: filteredData.length,
            totalPages: Math.ceil(filteredData.length / ITEMS_PER_PAGE),
            currentPage: currentPage,
            limit: ITEMS_PER_PAGE
        }}
        searchPlaceholder="Search by Builder or Number..."
        rowClassName={(item) => (item.deleteRequested || item.isDeleted) ? "bg-rose-50/40 hover:bg-rose-50/60" : ""}
      />

      <WhatsAppCredentialsModal 
        isOpen={isCredModalOpen}
        onClose={() => setIsCredModalOpen(false)}
        onSubmit={handleSaveCredentials}
        initialData={selectedHub}
        loading={loading}
      />
    </div>
  );
}
