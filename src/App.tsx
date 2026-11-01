import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { BuyerView } from './components/BuyerView';
import { SellerPortal } from './components/SellerPortal';
import { DealModal } from './components/DealModal';
import { CheckoutModal } from './components/CheckoutModal';
import { PointsVoucherModal } from './components/PointsVoucherModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { ThreeWaterWaves } from './components/ThreeWaterWaves';
import { AuthModal } from './components/AuthModal';
import { ChatModal } from './components/ChatModal';
import { NotificationModal } from './components/NotificationModal';
import { INITIAL_DEALS, VOUCHERS } from './data/mockData';
import { Deal, Order, Voucher, UserProfile, ChatMessage, AppNotification } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'buyer' | 'seller'>('buyer');
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [greenPoints, setGreenPoints] = useState<number>(150);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([VOUCHERS[0]]);
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr-buyer-01',
    name: 'Nguyễn Minh Hoàng',
    email: 'minhhoang.caugiay@lastbite.vn',
    role: 'BUYER',
    phone: '0988 123 456',
    address: 'Số 18, Dịch Vọng, Cầu Giấy, Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  // Real active orders state (shared between buyer and store)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-initial-1',
      pickupCode: 'A4821',
      dealId: 'deal-bag-01',
      dealTitle: 'Túi Bất Ngờ - Bánh Mì & Pastry Giờ Vàng',
      storeName: 'Tiệm Bánh Paris Artisan Duy Tân',
      storeAddress: 'Tòa nhà FPT, Phố Duy Tân, Dịch Vọng Hậu, Cầu Giấy',
      quantity: 1,
      totalPrice: 60000,
      discountAmount: 0,
      status: 'PAID_AWAITING_PICKUP',
      paymentMethod: 'VIETQR',
      createdAt: '19:45',
      pickupWindow: '20:30 – 21:45',
      greenPointsAwarded: 25,
    }
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Đơn #A4821 đang chờ bạn nhận',
      message: 'Tiệm Bánh Paris Artisan tại Phố Duy Tân đã chuẩn bị xong túi bánh của bạn.',
      timestamp: '19:50',
      read: false,
      type: 'ORDER',
    },
    {
      id: 'notif-2',
      title: 'Giờ Vàng Cứu Món Cầu Giấy',
      message: 'Khung giờ vàng 20:00 – 22:00 đã mở! Giảm tới 60% cho các suất cơm thố & bún phở.',
      timestamp: '19:30',
      read: false,
      type: 'DEAL',
    },
    {
      id: 'notif-3',
      title: '+25 Điểm Xanh cứu môi trường',
      message: 'Bạn đã tích lũy 150 Điểm Xanh. Đủ điều kiện đổi voucher V10K giảm 10.000đ!',
      timestamp: 'Hôm qua',
      read: true,
      type: 'POINTS',
    },
  ]);

  // Live Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      storeId: 'store-duytan-01',
      storeName: 'Tiệm Bánh Paris Artisan',
      sender: 'SELLER',
      senderName: 'Paris Artisan Duy Tân',
      text: 'Chào bạn Hoàng! Túi bánh ngọt giờ vàng của bạn đã sẵn sàng tại quầy số 2 nhé.',
      timestamp: '19:48',
    },
    {
      id: 'msg-2',
      storeId: 'store-duytan-01',
      storeName: 'Tiệm Bánh Paris Artisan',
      sender: 'BUYER',
      senderName: 'Minh Hoàng',
      text: 'Dạ vâng ạ, tầm 20:45 mình qua lấy theo mã A4821 nhé quán!',
      timestamp: '19:51',
    },
  ]);

  // Modals state
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [dealToCheckout, setDealToCheckout] = useState<Deal | null>(null);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<{
    storeName: string;
    storeAddress?: string;
    orderCode?: string;
  }>({
    storeName: 'Tiệm Bánh Paris Artisan Duy Tân',
    storeAddress: 'Phố Duy Tân, Dịch Vọng Hậu, Cầu Giấy',
    orderCode: 'A4821',
  });

  // Active counts
  const activeOrdersCount = orders.filter((o) => o.status === 'PAID_AWAITING_PICKUP').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Handlers
  const handleSelectDeal = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  const handleStartCheckout = (deal: Deal) => {
    setSelectedDeal(null);
    setDealToCheckout(deal);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order, pointsEarned: number) => {
    setOrders((prev) => [order, ...prev]);
    // Deduct stock on the deal
    setDeals((prev) =>
      prev.map((d) =>
        d.id === order.dealId
          ? { ...d, stockQuantity: Math.max(0, d.stockQuantity - 1), soldQuantity: d.soldQuantity + 1 }
          : d
      )
    );
    if (order.voucherCode) {
      setAvailableVouchers((prev) => prev.filter((v) => v.code !== order.voucherCode));
    }
    // Add real notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Đặt hàng thành công #${order.pickupCode}`,
      message: `Đơn "${order.dealTitle}" đã được tạo. Hãy tới ${order.storeName} trong khung giờ ${order.pickupWindow}.`,
      timestamp: 'Vừa xong',
      read: false,
      type: 'ORDER',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          if (o.voucherCode) {
            const template = VOUCHERS.find((v) => v.code === o.voucherCode);
            if (template) {
              setAvailableVouchers((vList) => [...vList, { ...template, id: `v-refund-${Date.now()}` }]);
            }
          }
          return { ...o, status: 'CANCELLED' };
        }
        return o;
      })
    );
  };

  // Complete pickup by code AXXXX (from Seller verification)
  const handleCompletePickup = (pickupCode: string): boolean => {
    const targetOrder = orders.find(
      (o) => o.pickupCode === pickupCode && o.status === 'PAID_AWAITING_PICKUP'
    );
    if (!targetOrder) return false;

    setOrders((prev) =>
      prev.map((o) => (o.id === targetOrder.id ? { ...o, status: 'COMPLETED' } : o))
    );
    // Award +25 Green Points to customer upon pickup completion
    setGreenPoints((prev) => prev + 25);

    // Notify user
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Nhận món thành công #${pickupCode}`,
        message: `Quán đã xác nhận giao món cho bạn! Bạn vừa nhận được +25 Điểm Xanh.`,
        timestamp: 'Vừa xong',
        read: false,
        type: 'POINTS',
      },
      ...prev,
    ]);

    return true;
  };

  const handleRedeemVoucher = (voucherCode: string, pointsCost: number) => {
    const template = VOUCHERS.find((v) => v.code === voucherCode);
    if (!template) return;
    setGreenPoints((prev) => Math.max(0, prev - pointsCost));
    setAvailableVouchers((prev) => [
      ...prev,
      {
        ...template,
        id: `voucher-${Date.now()}`,
      },
    ]);
  };

  const handleAddNewDeal = (newDealData: Partial<Deal>) => {
    const fullDeal = newDealData as Deal;
    setDeals((prev) => [fullDeal, ...prev]);
    // Notify all buyers about the new deal
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Món mới giờ vàng vừa lên sàn!',
        message: `Quán ${fullDeal.storeName} vừa đăng bán "${fullDeal.title}" với giá chỉ ${new Intl.NumberFormat('vi-VN').format(fullDeal.currentPrice)}đ.`,
        timestamp: 'Vừa xong',
        read: false,
        type: 'DEAL',
      },
      ...prev,
    ]);
  };

  // Auth Handlers
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'SELLER') {
      setCurrentTab('seller');
    } else {
      setCurrentTab('buyer');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('buyer');
    setIsAuthModalOpen(false);
  };

  // Chat Handlers
  const handleOpenChatFromOrder = (order: Order) => {
    setChatContext({
      storeName: order.storeName,
      storeAddress: order.storeAddress,
      orderCode: order.pickupCode,
    });
    setIsOrdersModalOpen(false);
    setIsChatOpen(true);
  };

  const handleOpenChatFromDeal = (deal: Deal) => {
    setChatContext({
      storeName: deal.storeName,
      storeAddress: deal.storeAddress,
    });
    setSelectedDeal(null);
    setIsChatOpen(true);
  };

  const handleSendMessage = (text: string) => {
    const isSeller = currentUser?.role === 'SELLER';
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      storeId: 'store-duytan-01',
      storeName: chatContext.storeName,
      sender: isSeller ? 'SELLER' : 'BUYER',
      senderName: currentUser ? currentUser.name : 'Khách hàng',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated auto response if buyer sent a message
    if (!isSeller) {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg-reply-${Date.now()}`,
            storeId: 'store-duytan-01',
            storeName: chatContext.storeName,
            sender: 'SELLER',
            senderName: chatContext.storeName,
            text: 'Cảm ơn bạn! Quán đã nhận được tin nhắn và sẽ chuẩn bị sẵn sàng khi bạn tới nhận món nhé!',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1200);
    }
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen text-stone-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col font-sans relative">
      {/* 0. Three.js 3D Water Waves Background with Mouse-Interaction */}
      <ThreeWaterWaves />

      {/* 1. Top Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        greenPoints={greenPoints}
        onOpenPointsModal={() => setIsPointsModalOpen(true)}
        onOpenOrdersModal={() => setIsOrdersModalOpen(true)}
        activeOrdersCount={activeOrdersCount}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* 2. Main Content for Buyers & Stores */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentTab === 'buyer' && (
            <motion.div
              key="buyer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <BuyerView
                deals={deals}
                onSelectDeal={handleSelectDeal}
                onOpenPointsModal={() => setIsPointsModalOpen(true)}
                userPoints={greenPoints}
              />
            </motion.div>
          )}

          {currentTab === 'seller' && (
            <motion.div
              key="seller"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SellerPortal
                onAddNewDeal={handleAddNewDeal}
                orders={orders}
                onCompletePickup={handleCompletePickup}
                onOpenChat={handleOpenChatFromOrder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Footer */}
      <footer className="bg-white/95 border-t border-stone-200 py-8 text-xs text-stone-500 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">LastBite Cầu Giấy, Hà Nội</span>
            <span>·</span>
            <span>Nền tảng cứu bữa ngon cuối ngày · Giảm thiểu lãng phí thực phẩm</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <span>Dành cho người mua & quán ăn đối tác</span>
            <span>·</span>
            <span>Hotline hỗ trợ: 1900.8888</span>
          </div>
        </div>
      </footer>

      {/* 4. Modals */}
      <AnimatePresence>
        {selectedDeal && (
          <DealModal
            deal={selectedDeal}
            onClose={() => setSelectedDeal(null)}
            onStartCheckout={handleStartCheckout}
            onOpenChat={handleOpenChatFromDeal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckoutOpen && dealToCheckout && (
          <CheckoutModal
            deal={dealToCheckout}
            userPoints={greenPoints}
            availableVouchers={availableVouchers}
            onClose={() => {
              setIsCheckoutOpen(false);
              setDealToCheckout(null);
            }}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPointsModalOpen && (
          <PointsVoucherModal
            userPoints={greenPoints}
            availableVouchers={availableVouchers}
            onRedeemVoucher={handleRedeemVoucher}
            onClose={() => setIsPointsModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOrdersModalOpen && (
          <MyOrdersModal
            orders={orders}
            onClose={() => setIsOrdersModalOpen(false)}
            onCancelOrder={handleCancelOrder}
            onOpenChat={handleOpenChatFromOrder}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal (Login / Register / Switch Persona) */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal
            currentUser={currentUser}
            onClose={() => setIsAuthModalOpen(false)}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {/* Live Chat Modal (Buyer <-> Store) */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatModal
            currentUser={currentUser}
            storeName={chatContext.storeName}
            storeAddress={chatContext.storeAddress}
            orderCode={chatContext.orderCode}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Notifications Modal */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <NotificationModal
            notifications={notifications}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
