import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Deal } from '../types';
import { Clock, MapPin, ShieldCheck, AlertCircle, ShoppingBag, ArrowRight, X, ExternalLink, MessageSquare } from 'lucide-react';

interface DealModalProps {
  deal: Deal | null;
  onClose: () => void;
  onStartCheckout: (deal: Deal) => void;
  onOpenChat?: (deal: Deal) => void;
}

export const DealModal: React.FC<DealModalProps> = ({ deal, onClose, onStartCheckout, onOpenChat }) => {
  if (!deal) return null;

  const isSurpriseBag = deal.type === 'SURPRISE_BAG';
  const isGiveaway = deal.type === 'GIVEAWAY_0K';

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  const handleOpenGoogleMaps = () => {
    const query = encodeURIComponent(`${deal.storeName}, ${deal.storeAddress}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
        {/* Backdrop motion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-100 z-10"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/50 hover:bg-stone-900/70 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Media Cover */}
          <div className="relative h-64 w-full bg-stone-100">
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                  {isSurpriseBag ? 'Túi Bất Ngờ (Giảm 50%)' : isGiveaway ? 'Suất Tặng Phi Lợi Nhuận' : 'Món Hời Giờ Vàng'}
                </span>
                {deal.hasFoodSafetyBadge && (
                  <span className="flex items-center gap-1 text-[11px] bg-emerald-600/90 text-white px-2 py-0.5 rounded-full font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Đã kiểm chứng ATTP
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold leading-tight">{deal.title}</h3>
              <p className="text-xs text-stone-300 mt-0.5">{deal.storeName}</p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Price & Timing Strip */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <div>
                <div className="text-xs text-stone-500">Giá cứu món hôm nay</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-amber-600 font-mono">
                    {formatPrice(deal.currentPrice)}
                  </span>
                  {deal.originalPrice > deal.currentPrice && (
                    <span className="text-sm text-stone-400 line-through font-mono">
                      {formatPrice(deal.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Tiết kiệm {deal.currentDiscountPercent}%
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-stone-500">Khung giờ nhận</div>
                <div className="flex items-center gap-1 text-sm font-bold text-stone-800 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{deal.pickupStart} – {deal.pickupEnd}</span>
                </div>
                <div className="text-[11px] text-amber-700 font-medium">
                  Còn {deal.remainingMinutes} phút tới giờ đóng
                </div>
              </div>
            </div>

            {/* Surprise Bag mystery items or Retail explanation */}
            {isSurpriseBag && deal.possibleCategories && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Các Nhóm Món Có Thể Có Trong Túi:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {deal.possibleCategories.map((cat, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="text-xs bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-lg font-medium"
                    >
                      ✨ {cat}
                    </motion.span>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 italic mt-1">
                  *Theo đúng triết lý LastBite: bạn không biết trước chính xác món ăn cụ thể, mỗi chiếc túi là một trải nghiệm ẩm thực bất ngờ với giá chỉ bằng một nửa!
                </p>
              </div>
            )}

            {/* Allergen note */}
            {deal.allergenNote && (
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-700">
                <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">Ghi chú dị ứng từ quán: </span>
                  <span>{deal.allergenNote}</span>
                </div>
              </div>
            )}

            {/* Location & Directions */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
              <div className="flex items-start gap-2 max-w-[70%]">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">{deal.storeAddress}</div>
                  <div className="text-stone-500">Cách bạn khoảng {deal.distanceKm} km (Khu vực Cầu Giấy)</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {onOpenChat && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onOpenChat(deal)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hỏi quán</span>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOpenGoogleMaps}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-900 font-medium transition-colors"
                >
                  <span>Chỉ đường</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartCheckout(deal)}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isGiveaway ? 'Nhận Suất Ăn Miễn Phí (0đ)' : `Đặt Cứu Suất Này · ${formatPrice(deal.currentPrice)}`}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </motion.button>
              <p className="text-center text-[11px] text-stone-400 mt-2">
                Hoàn thành đơn nhận ngay <strong>+25 Điểm Xanh</strong> tích lũy đổi voucher
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
