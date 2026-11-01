import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Store, Compass, ShoppingBag, Bell, User as UserIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentTab: 'buyer' | 'seller';
  setCurrentTab: (tab: 'buyer' | 'seller') => void;
  greenPoints: number;
  onOpenPointsModal: () => void;
  onOpenOrdersModal: () => void;
  activeOrdersCount: number;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  greenPoints,
  onOpenPointsModal,
  onOpenOrdersModal,
  activeOrdersCount,
  currentUser,
  onOpenAuthModal,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => setCurrentTab('buyer')}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-xs font-bold text-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-stone-900 whitespace-nowrap">
              LastBite<span className="text-amber-600">.vn</span>
            </span>
          </div>

          {/* Zone 2: Single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setCurrentTab('buyer')}
              className={`relative flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer ${
                currentTab === 'buyer' ? 'text-amber-600 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Khám Phá Cứu Món (Cầu Giấy)</span>
              {currentTab === 'buyer' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-amber-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <button
              onClick={onOpenOrdersModal}
              className="relative flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-2 text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đơn Hàng Của Tôi</span>
              {activeOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-600 text-white text-[10px] font-black rounded-full">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('seller')}
              className={`relative flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer ${
                currentTab === 'seller' ? 'text-amber-600 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Kênh Quán Ăn Đối Tác</span>
              {currentTab === 'seller' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-amber-600"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Action / Green Points, Notifications, Profile & Quick Switch */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Điểm Xanh button */}
            <button
              onClick={onOpenPointsModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              title="Điểm Xanh tích lũy đổi voucher"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>{greenPoints} Điểm</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Thông báo mới"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* User Account / Login Button */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-200 hover:border-amber-300 bg-stone-50/80 hover:bg-white text-xs font-bold text-stone-800 transition-all cursor-pointer shadow-2xs"
            >
              {currentUser ? (
                <>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-lg object-cover ring-1 ring-amber-400"
                  />
                  <span className="hidden sm:inline max-w-[110px] truncate text-stone-900">
                    {currentUser.name}
                  </span>
                  <span
                    className={`hidden lg:inline text-[9px] px-1.5 py-0.2 rounded-md uppercase font-extrabold ${
                      currentUser.role === 'SELLER'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {currentUser.role === 'SELLER' ? 'Quán' : 'Mua'}
                  </span>
                </>
              ) : (
                <>
                  <UserIcon className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline">Đăng Nhập</span>
                </>
              )}
            </button>

            {/* Quick Switch Persona Button */}
            <button
              onClick={() => setCurrentTab(currentTab === 'buyer' ? 'seller' : 'buyer')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {currentTab === 'buyer' ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kênh Quán Ăn</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xem Người Mua</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden border-t border-stone-200 py-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setCurrentTab('buyer')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'buyer' ? 'bg-amber-600 text-white font-bold' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Khám Phá Món
          </button>
          <button
            onClick={onOpenOrdersModal}
            className="px-3 py-1 text-xs rounded-lg whitespace-nowrap bg-stone-100 text-stone-700 flex items-center gap-1"
          >
            <span>Đơn Của Tôi</span>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-600 text-white text-[10px] font-black rounded-full">
                {activeOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('seller')}
            className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'seller' ? 'bg-amber-600 text-white font-bold' : 'bg-stone-100 text-stone-700'
            }`}
          >
            Kênh Quán Ăn
          </button>
        </div>
      </div>
    </header>
  );
};
