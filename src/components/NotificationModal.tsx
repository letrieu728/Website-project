import React from 'react';
import { X, Bell, ShoppingBag, Sparkles, Leaf, CheckCircle2 } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationModalProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Thông Báo Hoạt Động</h3>
              <p className="text-[11px] text-stone-500">Cập nhật đơn hàng, giờ vàng và Điểm Xanh</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Đã đọc tất cả
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              Hiện chưa có thông báo mới.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  n.read
                    ? 'bg-stone-50/70 border-stone-200 text-stone-600'
                    : 'bg-amber-50/50 border-amber-200 text-stone-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-stone-100 shadow-2xs shrink-0 mt-0.5">
                    {n.type === 'ORDER' && <ShoppingBag className="w-4 h-4 text-amber-600" />}
                    {n.type === 'POINTS' && <Leaf className="w-4 h-4 text-emerald-600" />}
                    {n.type === 'DEAL' && <Sparkles className="w-4 h-4 text-indigo-600" />}
                    {n.type === 'SYSTEM' && <CheckCircle2 className="w-4 h-4 text-stone-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs truncate">{n.title}</h4>
                      <span className="text-[10px] text-stone-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
