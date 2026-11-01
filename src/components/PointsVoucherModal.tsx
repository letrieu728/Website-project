import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Voucher } from '../types';
import { Leaf, Award, CheckCircle, X } from 'lucide-react';

interface PointsVoucherModalProps {
  userPoints: number;
  availableVouchers: Voucher[];
  onRedeemVoucher: (voucherCode: string, pointsCost: number) => void;
  onClose: () => void;
}

export const PointsVoucherModal: React.FC<PointsVoucherModalProps> = ({
  userPoints,
  availableVouchers,
  onRedeemVoucher,
  onClose,
}) => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  const handleRedeem = (code: string, cost: number) => {
    if (userPoints < cost) return;
    onRedeemVoucher(code, cost);
    setSuccessMsg(`Đổi thành công voucher ${code}! Đã thêm vào ví ưu đãi.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-100 p-6 space-y-6 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Top Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Leaf className="w-4 h-4" />
            <span>Hệ Thống Điểm Xanh Bền Vững</span>
          </div>
          <h3 className="text-2xl font-black text-stone-900 mt-1">Ví Điểm Xanh & Đổi Voucher</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Cứ mỗi bữa ngon được bạn cứu thành công, bạn nhận được <strong>+25 Điểm Xanh</strong>.
          </p>
        </div>

        {/* Current Balance Display with subtle gradient shimmer */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white shadow-md flex items-center justify-between"
        >
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">
              Điểm Xanh Hiện Có Của Bạn
            </div>
            <div className="text-3xl font-black font-mono mt-1">
              {userPoints} <span className="text-lg font-normal">Điểm</span>
            </div>
            <div className="text-[11px] text-emerald-100/90 mt-1">
              Đã cứu thành công {Math.floor(userPoints / 25)} bữa ngon tại Cầu Giấy
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"
          >
            <Award className="w-7 h-7 text-white" />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-semibold"
            >
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Redeemable Vouchers List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Đổi Thưởng Voucher Thực Tế (Hiệu lực 30 ngày)
          </h4>

          {/* V10K */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:border-emerald-300 transition-colors flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200 text-xs">
                  V10K
                </span>
                <span className="text-xs font-bold text-emerald-800">Giảm 10.000đ</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Áp dụng cho đơn cứu món từ 30.000đ. Hiệu lực 30 ngày.
              </p>
              <div className="text-[11px] font-semibold text-stone-700">
                Chi phí: <span className="text-emerald-700 font-bold">100 Điểm Xanh</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={userPoints < 100}
              onClick={() => handleRedeem('V10K', 100)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 ml-3 cursor-pointer shadow-xs"
            >
              {userPoints >= 100 ? 'Đổi Ngay' : 'Chưa đủ điểm'}
            </motion.button>
          </motion.div>

          {/* V20K */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:border-emerald-300 transition-colors flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200 text-xs">
                  V20K
                </span>
                <span className="text-xs font-bold text-emerald-800">Giảm 20.000đ</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Áp dụng cho đơn cứu món từ 50.000đ. Hiệu lực 30 ngày.
              </p>
              <div className="text-[11px] font-semibold text-stone-700">
                Chi phí: <span className="text-emerald-700 font-bold">200 Điểm Xanh</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={userPoints < 200}
              onClick={() => handleRedeem('V20K', 200)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 ml-3 cursor-pointer shadow-xs"
            >
              {userPoints >= 200 ? 'Đổi Ngay' : 'Chưa đủ điểm'}
            </motion.button>
          </motion.div>
        </div>

        {/* Available Vouchers in Wallet */}
        {availableVouchers.length > 0 && (
          <div className="pt-3 border-t border-stone-100">
            <div className="text-xs font-bold text-stone-700 mb-2">
              Voucher Có Trong Ví ({availableVouchers.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {availableVouchers.map((v, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-mono font-bold"
                >
                  {v.code} (-{formatPrice(v.discountValue)})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-500">
          *Quy tắc chuẩn LastBite: Nếu bạn hủy đơn đã dùng voucher, voucher sẽ được hoàn trả lại ví nguyên vẹn.
        </div>
      </motion.div>
    </div>
  );
};
