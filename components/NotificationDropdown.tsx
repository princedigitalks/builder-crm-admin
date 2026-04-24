'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { getSocket } from '@/lib/socket';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchNotifications, markAsRead, markAllAsRead, addNotification, Notification as NotificationType } from '@/redux/slices/notificationSlice';

export const NotificationDropdown = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications } = useSelector((state: RootState) => state.notification);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchNotifications());

    const socket = getSocket();
    if (user?._id) {
      socket.emit('join', user._id);
    }
    socket.on('admin_notification', (data: { notification: NotificationType }) => {
      dispatch(addNotification(data.notification));
      
      // Browser notification
      if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
        new window.Notification(data.notification.title, {
          body: data.notification.message,
          icon: '/favicon.ico',
        });
      }
      
      toast.success(`${data.notification.title}: ${data.notification.message}`);
    });

    // Request browser notification permission
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }

    // Handle click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      socket.off('admin_notification');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch, user]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative border border-transparent hover:border-slate-100 shadow-sm group"
      >
        <Bell size={18} className="group-hover:rotate-12 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Bell size={20} className="text-slate-300" />
                </div>
                <p className="text-xs text-slate-400 font-bold">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors relative group ${
                    !n.isRead ? 'bg-indigo-50/10' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.isRead ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-xs font-bold leading-tight ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                          {n.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 whitespace-nowrap font-bold uppercase">
                          {format(new Date(n.createdAt), 'MMM d, p')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">{n.message}</p>
                      
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(n._id)}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                        >
                          <Check size={10} strokeWidth={3} />
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
