import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';
import { QrCode, CheckCircle2, Clock, MapPin, X, Star, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

interface MyOrdersModalProps {
  orders: Order[];
  onClose: () => void;
  onCancelOrder: (orderId: string) => void;
  onOpenChat: (order: Order) => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  orders,
  onClose,
  onCancelOrder,
  onOpenChat,
}) => {
  const [selectedOrderForQr, setSelectedOrderForQr] = useState<Order | null>(null);
  const [ratedOrders, setRatedOrders] = useState<Record<string, number>>({});
  const [reviewText, setReviewText] = useState<Record<string, string>>({});
  const [submittedReviews, setSubmittedReviews] = useState<Record<string, boolean>>({});

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  const handleRating = (orderId: string, rating: number) => {
    setRatedOrders((prev) => ({ ...prev, [orderId]: rating }));
  };

  const handleSubmitReview = (orderId: string) => {
    setSubmittedReviews((prev) => ({ ...prev, [orderId]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 p-6 space-y-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-stone-900">Đơn Cứu Món Của Tôi</h3>
            <p className="text-xs text-stone-500">
              Quản lý các suất ăn đang chờ nhận và lịch sử cứu món thành công
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-stone-700">Bạn chưa có đơn cứu món nào</div>
              <p className="text-xs text-stone-500 mt-1">
                Hãy dạo quanh các quán ăn tại Cầu Giấy và rước về những bữa ngon giá hời nhé!
              </p>
            </div>
          ) : (
            orders.map((ord) => {
              const isAwaitingPickup = ord.status === 'PAID_AWAITING_PICKUP';
              const isCompleted = ord.status === 'COMPLETED';
              const isCancelled = ord.status === 'CANCELLED';

              return (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3 hover:border-amber-300 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-stone-200/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{ord.dealTitle}</span>
                        {isAwaitingPickup && (
                          <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                            Chờ nhận món
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Đã nhận hàng
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-[11px] font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                            Đã hủy
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{ord.storeName} · {ord.storeAddress}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-amber-700 font-mono">
                        {formatPrice(ord.totalPrice)}
                      </div>
                      <div className="text-[11px] text-stone-400">Giờ đặt: {ord.createdAt}</div>
                    </div>
                  </div>

                  {/* Pickup Code section for pending orders */}
                  {isAwaitingPickup && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] text-amber-800 uppercase font-bold tracking-wider">
                          Mã nhận hàng tại quán:
                        </div>
                        <div className="text-2xl font-black text-amber-700 font-mono tracking-widest mt-0.5">
                          {ord.pickupCode}
                        </div>
                        <div className="text-[11px] text-stone-600 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Khung giờ nhận: {ord.pickupWindow}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenChat(ord)}
                          className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Chat với quán</span>
                        </button>

                        <button
                          onClick={() => setSelectedOrderForQr(ord)}
                          className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-4 h-4 text-amber-600" />
                          <span>Mở Mã QR</span>
                        </button>

                        <button
                          onClick={() => onCancelOrder(ord.id)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Hủy đơn
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Review form for completed orders */}
                  {isCompleted && (
                    <div className="pt-2 text-xs">
                      {submittedReviews[ord.id] ? (
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Cảm ơn bạn đã đánh giá món ăn! Bạn đã nhận +25 Điểm Xanh.</span>
                        </div>
                      ) : (
                        <div className="space-y-2 bg-white p-3 rounded-xl border border-stone-200/80">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-800">
                              Đánh giá bữa ngon này:
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleRating(ord.id, star)}
                                  className="cursor-pointer"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      (ratedOrders[ord.id] || 0) >= star
                                        ? 'text-amber-500 fill-amber-500'
                                        : 'text-stone-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Nhận xét độ tươi ngon, chất lượng quán..."
                              value={reviewText[ord.id] || ''}
                              onChange={(e) =>
                                setReviewText({ ...reviewText, [ord.id]: e.target.value })
                              }
                              className="flex-1 text-xs border border-stone-200 rounded-lg p-2"
                            />
                            <button
                              disabled={!ratedOrders[ord.id]}
                              onClick={() => handleSubmitReview(ord.id)}
                              className="px-3 py-1.5 bg-amber-600 disabled:opacity-50 text-white rounded-lg font-bold text-xs cursor-pointer"
                            >
                              Gửi
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* QR Code Viewer Sub-modal */}
        <AnimatePresence>
          {selectedOrderForQr && (
            <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
              >
                <div className="text-xs uppercase font-bold text-amber-700">Mã QR Nhận Hàng</div>
                <h4 className="text-lg font-black text-stone-900">{selectedOrderForQr.dealTitle}</h4>
                
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block">
                  <QrCode className="w-48 h-48 text-stone-900 mx-auto" />
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <div className="text-xs text-stone-500">Mã nhận hàng</div>
                  <div className="text-3xl font-black text-amber-700 font-mono tracking-widest">
                    {selectedOrderForQr.pickupCode}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Đưa mã này cho quán tại {selectedOrderForQr.storeName}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrderForQr(null)}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Đóng
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
