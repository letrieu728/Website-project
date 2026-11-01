import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Deal, Order, Voucher } from '../types';
import { QrCode, CheckCircle2, ShieldCheck, Leaf, ArrowRight, X, RefreshCcw } from 'lucide-react';

interface CheckoutModalProps {
  deal: Deal;
  userPoints: number;
  availableVouchers: Voucher[];
  onClose: () => void;
  onOrderSuccess: (order: Order, pointsEarned: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  deal,
  availableVouchers,
  onClose,
  onOrderSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'MOMO' | 'VNPAY' | 'ZALOPAY' | 'PAYOS' | 'VIETQR'>(
    'VIETQR'
  );
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const isGiveaway = deal.type === 'GIVEAWAY_0K';

  // Calculate pricing & voucher discount
  const activeVoucher = availableVouchers.find((v) => v.id === selectedVoucherId);
  const voucherDiscount =
    activeVoucher && deal.currentPrice >= activeVoucher.minOrderValue
      ? activeVoucher.discountValue
      : 0;
  const finalPrice = Math.max(0, deal.currentPrice - voucherDiscount);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  // Generate unique AXXXX pickup code as per LastBite specifications
  const generatePickupCode = () => {
    const random4Digits = Math.floor(1000 + Math.random() * 9000);
    return `A${random4Digits}`;
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const code = generatePickupCode();
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        pickupCode: code,
        dealId: deal.id,
        dealTitle: deal.title,
        storeName: deal.storeName,
        storeAddress: deal.storeAddress,
        quantity: 1,
        totalPrice: finalPrice,
        discountAmount: voucherDiscount,
        voucherCode: activeVoucher?.code,
        status: 'PAID_AWAITING_PICKUP',
        paymentMethod: isGiveaway ? 'FREE' : selectedMethod,
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        pickupWindow: `${deal.pickupStart} - ${deal.pickupEnd}`,
        greenPointsAwarded: 25,
      };

      setCompletedOrder(newOrder);
      setIsProcessing(false);
      onOrderSuccess(newOrder, 25);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 p-6 z-10"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedOrder ? (
          <div className="space-y-6">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-amber-600">
                Xác Nhận & Đặt Cứu Món
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">{deal.title}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{deal.storeName} · {deal.area}</p>
            </div>

            {/* Price breakdown */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Giá món hời cuối ngày:</span>
                <span className="font-semibold text-stone-900 font-mono">{formatPrice(deal.currentPrice)}</span>
              </div>

              {availableVouchers.length > 0 && !isGiveaway && (
                <div className="pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5" />
                      Áp dụng Voucher Điểm Xanh:
                    </span>
                  </div>
                  <select
                    value={selectedVoucherId}
                    onChange={(e) => setSelectedVoucherId(e.target.value)}
                    className="w-full text-xs rounded-xl border border-stone-300 bg-white p-2 text-stone-800 cursor-pointer"
                  >
                    <option value="">Không dùng voucher</option>
                    {availableVouchers.map((v) => (
                      <option
                        key={v.id}
                        value={v.id}
                        disabled={deal.currentPrice < v.minOrderValue}
                      >
                        {v.code} - Giảm {formatPrice(v.discountValue)} (Đơn từ {formatPrice(v.minOrderValue)})
                        {deal.currentPrice < v.minOrderValue ? ' - Chưa đủ điều kiện' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Giảm từ voucher {activeVoucher?.code}:</span>
                  <span className="font-mono">-{formatPrice(voucherDiscount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-stone-900">
                <span>Tổng thanh toán:</span>
                <span className="text-xl text-amber-600 font-mono">{formatPrice(finalPrice)}</span>
              </div>
            </div>

            {/* Simulated Payment Methods */}
            {!isGiveaway && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Phương Thức Thanh Toán QR Tiện Lợi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'VIETQR', label: 'VietQR' },
                    { id: 'MOMO', label: 'Ví MoMo' },
                    { id: 'VNPAY', label: 'VNPay' },
                    { id: 'ZALOPAY', label: 'ZaloPay' },
                    { id: 'PAYOS', label: 'PayOS' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`p-2.5 rounded-xl border text-xs text-center font-bold transition-all cursor-pointer ${
                        selectedMethod === method.id
                          ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                {/* QR Visual */}
                <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-4">
                  <div className="w-20 h-20 bg-white p-2 rounded-xl border border-stone-200 shadow-xs flex items-center justify-center shrink-0">
                    <QrCode className="w-16 h-16 text-stone-800" />
                  </div>
                  <div className="text-xs text-stone-600 space-y-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Thanh toán trực tuyến bảo mật</span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      Quét mã QR qua cổng {selectedMethod} để xác nhận giữ suất ăn. Đơn hàng sẽ được chuyển trạng thái ngay lập tức để quán chuẩn bị phần ăn cho bạn.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isGiveaway && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                <span className="font-bold">Suất ăn cộng đồng 0đ:</span> Bạn không cần thanh toán. Hệ thống sẽ sinh mã nhận hàng AXXXX trực tiếp để bạn đến quán nhận món.
              </div>
            )}

            {/* Pay Button */}
            <button
              disabled={isProcessing}
              onClick={handleSimulatePayment}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý đơn...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>{isGiveaway ? 'Xác Nhận Nhận Suất 0đ' : 'Xác Nhận Đã Quét Mã & Hoàn Tất'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Success Screen with AXXXX pickup code */
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Đặt Cứu Món Thành Công!
              </div>
              <h3 className="text-2xl font-black text-stone-900 mt-1">
                Mã Nhận Hàng Của Bạn
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Đưa mã hoặc QR code này cho quán khi đến nhận món
              </p>
            </div>

            {/* Giant AXXXX Badge */}
            <div className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl p-4 max-w-xs mx-auto shadow-xs">
              <div className="text-xs text-amber-800 font-semibold uppercase">Mã Xác Nhận Đơn Hàng</div>
              <div className="text-4xl font-black tracking-widest text-amber-700 font-mono mt-1">
                {completedOrder.pickupCode}
              </div>
              <div className="text-[11px] text-amber-900/70 mt-1">
                Duy nhất trong các đơn đang chờ nhận
              </div>
            </div>

            {/* QR Handover Code */}
            <div className="inline-block p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <QrCode className="w-32 h-32 text-stone-900 mx-auto" />
              <div className="text-[11px] font-bold text-stone-700 mt-2">
                QR Bàn Giao Suất Ăn
              </div>
            </div>

            {/* Green Points Reward Banner */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-2 text-xs text-emerald-900 font-semibold">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Đơn này sẽ tích lũy +25 Điểm Xanh sau khi nhận hàng hoàn tất!</span>
            </div>

            {/* Pickup Location details */}
            <div className="text-left bg-stone-50 p-4 rounded-xl text-xs space-y-1 text-stone-600">
              <div><strong>Địa điểm nhận:</strong> {completedOrder.storeName}</div>
              <div><strong>Địa chỉ:</strong> {completedOrder.storeAddress}</div>
              <div><strong>Khung giờ:</strong> {completedOrder.pickupWindow}</div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Đóng & Xem Đơn Hàng Của Tôi
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
