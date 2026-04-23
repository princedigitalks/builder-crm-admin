'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Globe, ToggleLeft as Toggle, ToggleRight, Key } from 'lucide-react';
import WhatsAppCredentialsModal from '@/components/modals/WhatsAppCredentialsModal';
import { cn } from '@/lib/utils';
import { getSocket } from '@/lib/socket';
import CommonTable from '@/components/ui/CommonTable';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchAdminSites, updateSiteStatus, syncSiteUpdate, syncStatusUpdate, Site } from '@/redux/slices/whatsappSiteSlice';
import Swal from 'sweetalert2';
import axiosInstance from '@/lib/axios';

export default function WhatsAppAdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites, loading } = useSelector((state: RootState) => state.whatsappSite);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  useEffect(() => {
    dispatch(fetchAdminSites());

    const socket = getSocket();
    socket.on('whatsapp_page_update', (data: { action: 'add' | 'update'; site: Site }) => {
      dispatch(syncSiteUpdate(data));
    });

    socket.on('site_status_update', (update: { siteId: string; whatsappStatus: string; chatbotStatus: string }) => {
      dispatch(syncStatusUpdate(update));
    });

    return () => {
      socket.off('whatsapp_page_update');
      socket.off('site_status_update');
    };
  }, [dispatch]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await dispatch(updateSiteStatus({ id, data: { whatsappStatus: newStatus.toLowerCase() } })).unwrap();
      toast.success(`Connection status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error || 'Failed to update status');
    }
  };

  const handleChatbotToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await dispatch(updateSiteStatus({ id, data: { chatbotStatus: newStatus } })).unwrap();
      toast.success(`Chatbot is now ${newStatus}`);
    } catch (error: any) {
      toast.error(error || 'Failed to toggle chatbot');
    }
  };

  const handleUnlink = async (id: string, siteName: string) => {
    const result = await Swal.fire({
      title: 'Unlink WhatsApp?',
      text: `Do you want to unlink the WhatsApp number from "${siteName}"? This will allow the number to be reused.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Unlink',
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
        await dispatch(updateSiteStatus({ 
          id, 
          data: { 
            // whatsappNumber: '', // REMOVED: keep showing the number even after unlink
            whatsappStatus: 'disconnected', 
            chatbotStatus: 'inactive',
            isDeleted: true
          } 
        })).unwrap();
        toast.success('WhatsApp unlinked successfully');
      } catch (error: any) {
        toast.error(error || 'Failed to unlink WhatsApp');
      }
    }
  };

  const handleOpenCredModal = async (site: Site) => {
    setSelectedSite(site);
    try {
      // Fetch existing config for this number
      const response = await axiosInstance.get(`/site/admin/whatsapp-config/${encodeURIComponent(site.whatsappNumber)}`);
      if (response.data.data) {
        setSelectedSite({ ...site, ...response.data.data });
      }
    } catch (error) {
      console.error("Failed to fetch whatsapp config", error);
    }
    setIsCredModalOpen(true);
  };

  const handleSaveCredentials = async (data: any) => {
    if (!selectedSite) return;
    try {
      const payload = {
        number: selectedSite.whatsappNumber,
        builderId: selectedSite.builderId._id,
        ...data
      };
      await axiosInstance.post('/site/admin/whatsapp-config', payload);
      toast.success('Credentials saved successfully');
      setIsCredModalOpen(false);
      // Refresh sites to get updated data if needed (though sites don't store these anymore)
      dispatch(fetchAdminSites());
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save credentials');
    }
  };

  const filteredData = sites.filter(s => 
    s.builderId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.whatsappNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 5;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    {
      header: 'Builder Name',
      key: 'builder',
      render: (item: Site) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase border border-indigo-100">
             {item.builderId?.companyName?.slice(0, 2) || 'B'}
          </div>
          <span className="font-semibold text-slate-900 text-sm">{item.builderId?.companyName || 'Unknown'}</span>
        </div>
      )
    },
    {
      header: 'WhatsApp Number',
      key: 'whatsappNumber',
      render: (item: Site) => (
        <div className="flex items-center gap-2">
          <Smartphone size={13} className="text-slate-400" />
          <span className="text-sm text-slate-600">{item.whatsappNumber}</span>
        </div>
      )
    },
    {
      header: 'Linked Site',
      key: 'name',
      render: (item: Site) => (
        <div className="flex items-center gap-2">
           <Globe size={13} className="text-indigo-400" />
           <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50">
             {item.name}
           </span>
        </div>
      )
    },
    {
      header: 'Connection Health',
      key: 'whatsappStatus',
      render: (item: Site) => (
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
      render: (item: Site) => (
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
      render: (item: Site) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenCredModal(item)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
            title="Add Credentials"
          >
            <Key size={14} />
          </button>
          <button
            onClick={() => handleUnlink(item._id, item.name)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
            (item.deleteRequested || item.isDeleted)
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-white text-slate-500 border-slate-200 hover:text-rose-600 hover:border-rose-200",
            item.isDeleted && "opacity-50 cursor-not-allowed"
          )}
          title={item.isDeleted ? "Number already unlinked" : "Unlink Number"}
          disabled={item.isDeleted}
        >
          {item.isDeleted ? 'Unlinked' : 'Unlink'}
        </button>
      </div>
    )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6 pt-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">WhatsApp Hub</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <Smartphone size={12} className="text-indigo-500" />
            Infrastructure for Builder-Client Messaging
          </p>
        </div>
      </div>

      <CommonTable 
        title="Active Messaging Endpoints"
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
        searchPlaceholder="Filter Builder Endpoints..."
        rowClassName={(item) => (item.deleteRequested || item.isDeleted) ? "bg-rose-50/40 hover:bg-rose-50/60" : ""}
      />

      <WhatsAppCredentialsModal 
        isOpen={isCredModalOpen}
        onClose={() => setIsCredModalOpen(false)}
        onSubmit={handleSaveCredentials}
        initialData={selectedSite}
        loading={loading}
      />
    </div>
  );
}
