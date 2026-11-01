import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreProfile, Deal, Order } from '../types';
import { SAMPLE_STORE_PROFILE } from '../data/mockData';
import { 
  Store, 
  ShieldCheck, 
  PlusCircle, 
  Calculator, 
  CheckCircle2, 
  Clock, 
  Check, 
  QrCode, 
  Search,
  DollarSign,
  TrendingUp,
  PackageCheck
} from 'lucide-react';

interface SellerPortalProps {
  onAddNewDeal: (deal: Partial<Deal>) => void;
  orders: Order[];
  onCompletePickup: (pickupCode: string) => boolean;
  onOpenChat?: (order: Order) => void;
}

export const SellerPortal: React.FC<SellerPortalProps> = ({ 
  onAddNewDeal,
  orders,
  onCompletePickup,
  onOpenChat,
}) => {
  const [profile, setProfile] = useState<StoreProfile>(SAMPLE_STORE_PROFILE);
  const [activeTab, setActiveTab] = useState<'orders' | 'overview' | 'create_bag' | 'create_retail' | 'fees'>('orders');
  
  // Verification code input
  const [verifyCodeInput, setVerifyCodeInput] = useState('');
  const [verifyMessage, setVerifyMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Bag creation form state
  const [bagOriginalPrice, setBagOriginalPrice] = useState<number>(120000);
  const [bagAllergy, setBagAllergy] = useState<string>('Có thể chứa sữa tươi, gluten và dấu vết hạt hạnh nhân.');
  const [bagPickupStart, setBagPickupStart] = useState('20:30');
  const [bagPickupEnd, setBagPickupEnd] = useState('21:45');
  const [bagStock, setBagStock] = useState(6);
  const [bagGroups, setBagGroups] = useState<string[]>([
    'Bánh sừng bò bơ Pháp', 
    'Bánh mì ngũ cốc nguyên cám', 
    'Su kem mini'
  ]);
  const [creationSuccess, setCreationSuccess] = useState(false);

  // Retail deal creation state
  const [retailTitle, setRetailTitle] = useState('');
  const [retailOriginalPrice, setRetailOriginalPrice] = useState<number>(80000);
  const [retailFloorPrice, setRetailFloorPrice] = useState<number>(30000);
  const [retailStart, setRetailStart] = useState('20:45');
  const [retailEnd, setRetailEnd] = useState('21:30');
  const [retailStock, setRetailStock] = useState(5);

  // Fee simulator month slider
  const [simulatedMonth, setSimulatedMonth] = useState(profile.operatingMonths);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  // Calculated 50% surprise bag price (auto-rounded to thousands)
  const surpriseBagCalculatedPrice = Math.round((bagOriginalPrice * 0.5) / 1000) * 1000;

  // Filter store orders
  const pendingOrders = orders.filter((o) => o.status === 'PAID_AWAITING_PICKUP');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = verifyCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    const ok = onCompletePickup(cleanCode);
    if (ok) {
      setVerifyMessage({ text: `Xác nhận thành công đơn mã ${cleanCode}! Đã giao suất ăn cho khách.`, success: true });
      setVerifyCodeInput('');
      setProfile((prev) => ({
        ...prev,
        totalRescuedMeals: prev.totalRescuedMeals + 1,
        totalRevenue: prev.totalRevenue + 45000,
      }));
    } else {
      setVerifyMessage({ text: `Mã ${cleanCode} không tồn tại hoặc đã được nhận trước đó.`, success: false });
    }
    setTimeout(() => setVerifyMessage(null), 4000);
  };

  // Fee stage calculation
  const getStageInfo = (month: number) => {
    if (month <= 2) {
      return {
        stage: 'Giai đoạn 1 (Tháng 1–2)',
        fee: 0,
        commission: 5,
        status: 'Đang miễn phí phí duy trì gian hàng',
      };
    } else if (month <= 6) {
      return {
        stage: 'Giai đoạn 2 (Tháng 3–6)',
        fee: 99000,
        commission: 10,
        status: '99.000đ / tháng (30 ngày)',
      };
    } else {
      return {
        stage: 'Giai đoạn 3 (Từ tháng 7)',
        fee: 149000,
        commission: 10,
        status: '149.000đ / tháng (30 ngày)',
      };
    }
  };

  const currentStage = getStageInfo(profile.operatingMonths);

  const handleCreateSurpriseBag = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeal: Partial<Deal> = {
      id: `deal-bag-${Date.now()}`,
      storeId: profile.storeId,
      storeName: profile.name,
      storeAddress: `${profile.address}, ${profile.district}`,
      area: 'Cầu Giấy, Hà Nội',
      distanceKm: 0.8,
      title: 'Túi Bất Ngờ - Món Ngon Giờ Vàng Mới',
      type: 'SURPRISE_BAG',
      originalPrice: bagOriginalPrice,
      currentPrice: surpriseBagCalculatedPrice,
      category: 'banh-ngot',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      pickupStart: bagPickupStart,
      pickupEnd: bagPickupEnd,
      remainingMinutes: 90,
      stockQuantity: bagStock,
      soldQuantity: 0,
      possibleCategories: bagGroups,
      allergenNote: bagAllergy,
      currentDiscountPercent: 50,
      hasFoodSafetyBadge: profile.foodSafetyVerified,
    };

    onAddNewDeal(newDeal);
    setCreationSuccess(true);
    setTimeout(() => {
      setCreationSuccess(false);
      setActiveTab('overview');
    }, 2000);
  };

  const handleCreateRetailDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retailTitle) return;

    const newDeal: Partial<Deal> = {
      id: `deal-retail-${Date.now()}`,
      storeId: profile.storeId,
      storeName: profile.name,
      storeAddress: `${profile.address}, ${profile.district}`,
      area: 'Cầu Giấy, Hà Nội',
      distanceKm: 0.8,
      title: retailTitle,
      type: 'RETAIL',
      originalPrice: retailOriginalPrice,
      currentPrice: Math.max(retailFloorPrice, Math.round(retailOriginalPrice * 0.6 / 1000) * 1000),
      floorPrice: retailFloorPrice,
      category: 'com',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      pickupStart: retailStart,
      pickupEnd: retailEnd,
      remainingMinutes: 45,
      stockQuantity: retailStock,
      soldQuantity: 0,
      currentDiscountPercent: 40,
      hasFoodSafetyBadge: profile.foodSafetyVerified,
    };

    onAddNewDeal(newDeal);
    setCreationSuccess(true);
    setTimeout(() => {
      setCreationSuccess(false);
      setActiveTab('overview');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-sm">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">{profile.name}</h1>
              {profile.foodSafetyVerified && (
                <span className="flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Đã kiểm chứng an toàn thực phẩm
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {profile.address}, {profile.district} · Quán hoạt động tháng thứ {profile.operatingMonths}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Bàn Giao Đơn Hàng</span>
            {pendingOrders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-white text-amber-700 text-[10px] font-black rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Tổng Quan Doanh Thu
          </button>

          <button
            onClick={() => setActiveTab('create_bag')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'create_bag'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Đăng Túi Bất Ngờ (50%)
          </button>

          <button
            onClick={() => setActiveTab('create_retail')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'create_retail'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Đăng Món Lẻ
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'fees'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Biểu Phí Gian Hàng
          </button>
        </div>
      </div>

      {/* 1. ORDERS DISPATCH & VERIFY TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Quick Code Verification Box */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
            <div className="max-w-xl">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-600" />
                <span>Xác Nhận Mã Nhận Hàng Của Khách (AXXXX)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Khi khách hàng đến lấy phần ăn, đối chiếu mã hoặc quét QR của khách rồi nhập mã 5 ký tự vào ô dưới để hoàn tất đơn.
              </p>

              <form onSubmit={handleVerifyCodeSubmit} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: A4821"
                  value={verifyCodeInput}
                  onChange={(e) => setVerifyCodeInput(e.target.value)}
                  maxLength={5}
                  className="w-48 text-base font-mono font-black uppercase text-stone-900 p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
                >
                  Xác Nhận Bàn Giao
                </button>
              </form>

              <AnimatePresence>
                {verifyMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      verifyMessage.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {verifyMessage.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Check className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{verifyMessage.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Pending Orders List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900">
                Đơn Hàng Đang Chờ Khách Đến Nhận ({pendingOrders.length})
              </h3>
              <span className="text-xs text-stone-500">Khách đã thanh toán trực tuyến</span>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
                Hiện tại chưa có đơn hàng nào đang chờ nhận.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{ord.dealTitle}</div>
                        <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Giờ lấy: {ord.pickupWindow}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-amber-700 font-mono">
                          {formatPrice(ord.totalPrice)}
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Đã thanh toán
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-amber-800 font-bold uppercase">Mã Nhận Hàng</div>
                        <div className="text-2xl font-black text-amber-700 font-mono tracking-wider">
                          {ord.pickupCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onOpenChat && (
                          <button
                            type="button"
                            onClick={() => onOpenChat(ord)}
                            className="px-3 py-2 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-bold text-xs shadow-2xs cursor-pointer transition-colors"
                          >
                            Nhắn tin
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onCompletePickup(ord.pickupCode);
                            setVerifyMessage({
                              text: `Đã xác nhận bàn giao đơn ${ord.pickupCode}!`,
                              success: true,
                            });
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
                        >
                          Xác Nhận Đã Giao
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Suất Ăn Đã Cứu</div>
              <div className="text-2xl font-black text-stone-900 font-mono mt-1">
                {profile.totalRescuedMeals} <span className="text-sm font-normal">suất</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">
                Giảm lãng phí tương đương 170kg thực phẩm
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Doanh Thu Thu Hồi</div>
              <div className="text-2xl font-black text-amber-600 font-mono mt-1">
                {formatPrice(profile.totalRevenue)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                Tiền thu về từ các món hời cuối ngày
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Gói Phí Gian Hàng Hiện Tại</div>
              <div className="text-base font-bold text-stone-900 mt-1">
                {currentStage.stage}
              </div>
              <div className="text-[11px] text-emerald-700 font-bold mt-1">
                Phí: {formatPrice(currentStage.fee)} · Hoa hồng: {currentStage.commission}%
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-medium">Công Nợ Hoa Hồng Chờ Đối Soát</div>
              <div className="text-2xl font-black text-stone-900 font-mono mt-1">
                {formatPrice(profile.pendingCommissionDebt)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                Chuyển khoản định kỳ hàng tháng
              </div>
            </div>
          </div>

          {/* Food Safety Certificate Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Chứng Nhận Vệ Sinh An Toàn Thực Phẩm
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Quán nộp ảnh giấy chứng nhận. Sau khi bộ phận kiểm duyệt xác nhận, huy hiệu uy tín sẽ tự động hiển thị trên tất cả deal của quán.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setProfile({ ...profile, foodSafetyVerified: !profile.foodSafetyVerified });
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-stone-200 hover:border-stone-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              Trạng thái: {profile.foodSafetyVerified ? 'Đã kiểm chứng (Bật)' : 'Chưa kích hoạt'}
            </button>
          </div>

          {/* 7-day Analytics */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Hiệu Suất Cứu Món 7 Ngày Qua</h3>
                <p className="text-xs text-stone-500">Khu vực Cầu Giấy duy trì tỷ lệ cứu món đạt 89%</p>
              </div>
              <span className="text-xs text-stone-400 font-mono">24/10 – 31/10/2026</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2 items-end h-32">
              {[
                { day: 'T2', count: 18 },
                { day: 'T3', count: 24 },
                { day: 'T4', count: 30 },
                { day: 'T5', count: 22 },
                { day: 'T6', count: 35 },
                { day: 'T7', count: 42 },
                { day: 'CN', count: 48 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 group">
                  <div className="text-[10px] text-stone-400 font-mono">{item.count}</div>
                  <div
                    style={{ height: `${(item.count / 50) * 85}px` }}
                    className="w-full bg-amber-500 group-hover:bg-amber-600 rounded-t-lg transition-colors cursor-pointer"
                  />
                  <div className="text-[11px] font-semibold text-stone-600">{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. CREATE SURPRISE BAG TAB */}
      {activeTab === 'create_bag' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-700">
              Sản Phẩm Chủ Lực
            </div>
            <h2 className="text-2xl font-black text-stone-900 mt-0.5">
              Đăng Túi Bất Ngờ Mới (Giảm Cố Định 50%)
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Hệ thống tự động tính giá bán = 50% giá trị thật do bạn khai (làm tròn nghìn đồng). Khách mua không biết trước chính xác món ăn cụ thể, chỉ biết các nhóm món có thể có.
            </p>
          </div>

          <AnimatePresence>
            {creationSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-bold"
              >
                <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Đăng Túi Bất Ngờ thành công! Deal đã xuất hiện trên trang chủ Cầu Giấy.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleCreateSurpriseBag} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Tổng Giá Trị Thật Của Món Trong Túi (đ)
              </label>
              <input
                type="number"
                step="5000"
                min="30000"
                value={bagOriginalPrice}
                onChange={(e) => setBagOriginalPrice(Number(e.target.value))}
                className="w-full text-sm rounded-xl border border-stone-200 p-3 font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                <span className="text-amber-900 font-semibold">
                  Giá bán cho khách (Tự tính 50%):
                </span>
                <span className="text-base font-black text-amber-700 font-mono">
                  {formatPrice(surpriseBagCalculatedPrice)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Các Nhóm Món Có Thể Có Trong Túi (Gợi ý cho khách)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {bagGroups.map((group, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-stone-100 text-stone-800 px-3 py-1 rounded-lg font-medium flex items-center gap-1.5"
                  >
                    <span>{group}</span>
                    <button
                      type="button"
                      onClick={() => setBagGroups(bagGroups.filter((_, i) => i !== idx))}
                      className="text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Nhập nhóm món rồi nhấn Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = (e.currentTarget.value || '').trim();
                    if (val && !bagGroups.includes(val)) {
                      setBagGroups([...bagGroups, val]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
                className="w-full text-xs rounded-xl border border-stone-200 p-2.5 text-stone-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700 uppercase">
                  Ghi Chú Dị Ứng (Bảo Vệ Người Dùng)
                </label>
                <span className="text-[11px] font-mono text-stone-400">
                  {bagAllergy.length}/200 ký tự
                </span>
              </div>
              <textarea
                value={bagAllergy}
                maxLength={200}
                onChange={(e) => setBagAllergy(e.target.value)}
                rows={2}
                className="w-full text-xs rounded-xl border border-stone-200 p-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Nêu rõ thành phần có thể gây dị ứng..."
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Giờ Mở Nhận
                </label>
                <input
                  type="time"
                  value={bagPickupStart}
                  onChange={(e) => setBagPickupStart(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-200 p-2.5 font-mono text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Giờ Đóng Cửa
                </label>
                <input
                  type="time"
                  value={bagPickupEnd}
                  onChange={(e) => setBagPickupEnd(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-200 p-2.5 font-mono text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Số Lượng Túi
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={bagStock}
                  onChange={(e) => setBagStock(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-stone-200 p-2.5 font-mono text-stone-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={bagAllergy.length > 200}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Bán Túi Bất Ngờ Lên Cầu Giấy Ngay</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. CREATE RETAIL DEAL TAB */}
      {activeTab === 'create_retail' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-700">
              Món Lẻ Giờ Vàng
            </div>
            <h2 className="text-2xl font-black text-stone-900 mt-0.5">
              Đăng Món Lẻ Giảm Giá Động
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Mức giảm giá sẽ tự động tăng dần khi càng gần giờ đóng cửa (&gt;180p: -20%, 60-180p: -40%, &lt;60p: tối đa 60%), và không bao giờ thấp hơn Giá Sàn bạn cài đặt.
            </p>
          </div>

          <form onSubmit={handleCreateRetailDeal} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Tên Món Ăn
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Suất Cơm Niêu Bò Xốt Tiêu Đen Giờ Vàng"
                value={retailTitle}
                onChange={(e) => setRetailTitle(e.target.value)}
                className="w-full text-sm rounded-xl border border-stone-200 p-3 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Giá Gốc Niêm Yết (đ)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="20000"
                  value={retailOriginalPrice}
                  onChange={(e) => setRetailOriginalPrice(Number(e.target.value))}
                  className="w-full text-sm rounded-xl border border-stone-200 p-3 font-mono font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Giá Sàn Tối Thiểu (đ)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="10000"
                  value={retailFloorPrice}
                  onChange={(e) => setRetailFloorPrice(Number(e.target.value))}
                  className="w-full text-sm rounded-xl border border-stone-200 p-3 font-mono font-bold text-amber-700"
                  required
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Giá bán sẽ không bao giờ giảm dưới mức này
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Giờ Bắt Đầu Nhận
                </label>
                <input
                  type="time"
                  value={retailStart}
                  onChange={(e) => setRetailStart(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-200 p-2.5 font-mono text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Giờ Kết Thúc
                </label>
                <input
                  type="time"
                  value={retailEnd}
                  onChange={(e) => setRetailEnd(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-200 p-2.5 font-mono text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Số Lượng Suất
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={retailStock}
                  onChange={(e) => setRetailStock(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-stone-200 p-2.5 font-mono text-stone-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Bán Món Lẻ Giờ Vàng</span>
            </button>
          </form>
        </div>
      )}

      {/* 5. FEE TIERS TAB */}
      {activeTab === 'fees' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-700">
              Chính Sách Tài Chính Minh Bạch
            </div>
            <h2 className="text-2xl font-black text-stone-900 mt-0.5">
              Phí Gian Hàng 3 Giai Đoạn (1 Tháng = 30 Ngày)
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Chính sách hỗ trợ tối đa cho các đối tác quán ăn mới tại Cầu Giấy làm quen và tối ưu lợi nhuận.
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-stone-800">
              <span>Kéo chọn tháng hoạt động của quán:</span>
              <span className="font-mono text-amber-600 text-sm">Tháng thứ {simulatedMonth}</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={simulatedMonth}
              onChange={(e) => setSimulatedMonth(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>Tháng 1 (Mở quán)</span>
              <span>Tháng 6</span>
              <span>Tháng 12</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-2xl border transition-all ${
                simulatedMonth <= 2
                  ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500 shadow-xs'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div className="text-xs font-bold text-emerald-800 uppercase">Giai Đoạn 1</div>
              <div className="font-extrabold text-stone-900 text-sm mt-0.5">Tháng 1 – 2</div>
              <div className="mt-3 text-xs space-y-1 text-stone-600">
                <div>Phí duy trì: <strong className="text-emerald-700">0đ (Miễn phí)</strong></div>
                <div>Hoa hồng đơn: <strong>5%</strong></div>
                <div className="text-[11px] text-stone-400 italic mt-2">
                  *Ưu đãi 60 ngày đầu đồng hành cùng quán
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all ${
                simulatedMonth >= 3 && simulatedMonth <= 6
                  ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500 shadow-xs'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div className="text-xs font-bold text-amber-800 uppercase">Giai Đoạn 2</div>
              <div className="font-extrabold text-stone-900 text-sm mt-0.5">Tháng 3 – 6</div>
              <div className="mt-3 text-xs space-y-1 text-stone-600">
                <div>Phí duy trì: <strong className="text-stone-900">99.000đ / tháng</strong></div>
                <div>Hoa hồng đơn: <strong>10%</strong></div>
                <div className="text-[11px] text-stone-500 mt-2">
                  Bắt đầu tính phí duy trì gian hàng
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all ${
                simulatedMonth >= 7
                  ? 'border-stone-800 bg-stone-100 ring-2 ring-stone-800 shadow-xs'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div className="text-xs font-bold text-stone-700 uppercase">Giai Đoạn 3</div>
              <div className="font-extrabold text-stone-900 text-sm mt-0.5">Từ Tháng 7 Trở Đi</div>
              <div className="mt-3 text-xs space-y-1 text-stone-600">
                <div>Phí duy trì: <strong className="text-stone-900">149.000đ / tháng</strong></div>
                <div>Hoa hồng đơn: <strong>10%</strong></div>
                <div className="text-[11px] text-stone-500 mt-2">
                  Mức phí tiêu chuẩn định kỳ cho đối tác
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
            <div className="font-bold text-stone-900">Quy định gian hàng:</div>
            <p className="text-[11px]">
              Nếu quá hạn chu kỳ 30 ngày mà quán chưa gia hạn, hệ thống sẽ tạm dừng đăng deal mới. Các deal đã đăng trước đó vẫn được tiếp tục bán cho khách đến khi hết giờ.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
