'use client';

import React, { useState } from 'react';
import { Smartphone, Globe, MessageSquare, ToggleLeft as Toggle, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { builders as mockBuilders } from '@/lib/mock-data';
import CommonTable from '@/components/ui/CommonTable';

export default function WhatsAppAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(mockBuilders.map(b => ({
    ...b,
    waStatus: Math.random() > 0.3 ? 'Connected' : 'Disconnected',
    chatbot: Math.random() > 0.5 ? 'Active' : 'Not Active'
  })));

  const handleStatusChange = (id: number, newStatus: string) => {
    setData(data.map(item => item.id === id ? { ...item, waStatus: newStatus } : item));
  };

  const handleChatbotToggle = (id: number) => {
    setData(data.map(item => 
      item.id === id 
        ? { ...item, chatbot: item.chatbot === 'Active' ? 'Not Active' : 'Active' } 
        : item
    ));
  };

  const filteredData = data.filter(b => 
    b.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.wa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 5;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    {
      header: 'Builder Name',
      key: 'company',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-sm"
            style={{ backgroundColor: item.color }}
          >
            {item.initials}
          </div>
          <span className="font-bold text-slate-900 text-xs tracking-tight">{item.company}</span>
        </div>
      )
    },
    {
      header: 'WhatsApp Number',
      key: 'wa',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Smartphone size={12} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-600 tracking-wider whitespace-nowrap">{item.wa}</span>
        </div>
      )
    },
    {
      header: 'Linked Site',
      key: 'site',
      render: (item: any) => (
        <div className="flex items-center gap-2">
           <Globe size={12} className="text-indigo-400" />
           <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50">
             {item.site}
           </span>
        </div>
      )
    },
    {
      header: 'Leads Traffic',
      key: 'leads',
      render: (item: any) => (
        <div className="flex items-center gap-2">
           <MessageSquare size={12} className="text-slate-300" />
           <span className="text-xs font-black text-slate-900 leading-none">{item.leads.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Connection Health',
      key: 'waStatus',
      render: (item: any) => (
        <select 
          value={item.waStatus}
          onChange={(e) => handleStatusChange(item.id, e.target.value)}
          className={cn(
            "text-[9px] font-black px-2 py-1 rounded border outline-none cursor-pointer uppercase tracking-widest transition-all",
            item.waStatus === 'Connected' 
              ? "bg-greenbg text-green border-green/20" 
              : "bg-redbg text-red border-red/20"
          )}
        >
          <option value="Connected">Connected</option>
          <option value="Disconnected">Disconnected</option>
        </select>
      )
    },
    {
      header: 'Chatbot Engine',
      key: 'chatbot',
      render: (item: any) => (
        <button 
          onClick={() => handleChatbotToggle(item.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border shadow-sm",
            item.chatbot === 'Active'
              ? "bg-accent text-white border-accent shadow-accent/20"
              : "bg-white text-slate-400 border-slate-100"
          )}
        >
          {item.chatbot === 'Active' ? <ToggleRight size={16} /> : <Toggle size={16} />}
          <span>{item.chatbot}</span>
        </button>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6 pt-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">WhatsApp Hub</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <Smartphone size={12} className="text-indigo-500" />
            Infrastructure for Builder-Client Messaging
          </p>
        </div>
      </div>

      {/* Main Table Interface */}
      <CommonTable 
        title="Active Messaging Endpoints"
        columns={columns}
        data={paginatedData}
        loading={false}
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
      />
    </div>
  );
}
