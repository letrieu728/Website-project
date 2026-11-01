import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Deal, CategoryId } from '../types';
import { CATEGORIES, CAU_GIAY_LOCATIONS } from '../data/mockData';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Search, 
  ShieldCheck, 
  Leaf, 
  Package, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface BuyerViewProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
  onOpenPointsModal: () => void;
  userPoints: number;
}

export const BuyerView: React.FC<BuyerViewProps> = ({
  deals,
  onSelectDeal,
  onOpenPointsModal,
  userPoints,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(CAU_GIAY_LOCATIONS[0].name);
  const [sortBy, setSortBy] = useState<'discount' | 'distance' | 'price'>('discount');

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchCat = selectedCategory === 'all' || deal.category === selectedCategory;
      const matchSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.area.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'discount') return b.currentDiscountPercent - a.currentDiscountPercent;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return a.currentPrice - b.currentPrice;
    });
  }, [deals, selectedCategory, searchQuery, sortBy]);

  // Separate flagship Surprise Bags vs Retail
  const surpriseBags = filteredDeals.filter((d) => d.type === 'SURPRISE_BAG');
  const retailDeals = filteredDeals.filter((d) => d.type === 'RETAIL' || d.type === 'GIVEAWAY_0K');

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner Section */}
      <div className="relative text-white overflow-hidden bg-stone-900 border-b border-stone-200">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/lastbite_hero_food_rescue_1793530330264.jpg"
            alt="LastBite Food Rescue"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sàn Cứu Món Ngon Cuối Ngày · Khu Vực Cầu Giấy, Hà Nội</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Cứu bữa ngon cuối ngày, rước trọn món hời.
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Các tiệm bánh, nhà hàng và quán ăn tươi ngon tại Cầu Giấy đăng bán phần ăn dư cuối ngày với giá chỉ từ một nửa. Người mua tiết kiệm, quán tối ưu doanh thu, cùng chung tay giảm lãng phí thực phẩm.
            </p>

            {/* Quick Location Anchor Selector */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-stone-300 font-medium">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Điểm xuất phát:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CAU_GIAY_LOCATIONS.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => setSelectedLocation(loc.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedLocation === loc.name
                        ? 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'bg-white/10 hover:bg-white/20 text-stone-200'
                    }`}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Dynamic Pricing Explainer Strip */}
        <div className="p-5 bg-gradient-to-r from-amber-50/90 to-orange-50/70 border border-amber-200 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span>Cơ Chế Giảm Giá Giờ Vàng Động (Càng Gần Giờ Đóng Cửa Càng Rẻ)</span>
              </div>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                • <strong>Túi Bất Ngờ:</strong> Giá cố định đúng 50% giá trị thật.
                <br />
                • <strong>Món Lẻ:</strong> &gt;180 phút giảm 20% · 60–180 phút giảm 40% · &lt;60 phút giảm tối đa 60% (không thấp hơn giá sàn của quán).
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPointsModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <Leaf className="w-4 h-4" />
            <span>Ví Điểm Xanh ({userPoints}đ) · Đổi Voucher</span>
          </button>
        </div>

        {/* 1. FLAGSHIP SECTION: TÚI BẤT NGỜ (SURPRISE BAGS) */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-amber-700">
                Sản Phẩm Chủ Lực
              </div>
              <h2 className="text-2xl font-black text-stone-900 mt-0.5 flex items-center gap-2">
                <span>Túi Bất Ngờ · Giảm 50%</span>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                  {surpriseBags.length} suất sẵn sàng
                </span>
              </h2>
            </div>
            <div className="text-xs text-stone-500 hidden sm:block">
              Giá cố định = 50% giá trị thật · Không biết trước món cụ thể
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surpriseBags.map((bag) => (
              <div
                key={bag.id}
                onClick={() => onSelectDeal(bag)}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={bag.image}
                      alt={bag.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                      GIẢM 50%
                    </div>
                    {bag.hasFoodSafetyBadge && (
                      <div className="absolute top-3 right-3 bg-emerald-600/95 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>ATTP</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium bg-stone-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Nhận: {bag.pickupStart} – {bag.pickupEnd}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-300 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>Còn {bag.remainingMinutes}p</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="text-xs text-stone-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{bag.storeName} · {bag.distanceKm} km</span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-600 transition-colors mt-1">
                        {bag.title}
                      </h3>
                    </div>

                    {bag.possibleCategories && (
                      <div className="flex flex-wrap gap-1.5">
                        {bag.possibleCategories.slice(0, 3).map((cat, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200/60 px-2.5 py-0.5 rounded-md font-medium"
                          >
                            ✨ {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {bag.allergenNote && (
                      <p className="text-[11px] text-stone-500 line-clamp-1 italic">
                        Dị ứng: {bag.allergenNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 line-through font-mono mr-1.5">
                      {formatPrice(bag.originalPrice)}
                    </span>
                    <span className="text-lg font-black text-amber-600 font-mono">
                      {formatPrice(bag.currentPrice)}
                    </span>
                  </div>

                  <button className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors flex items-center gap-1 cursor-pointer shadow-xs">
                    <span>Cứu Món</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. RETAIL & GIVEAWAY SECTION WITH 9 CATEGORIES */}
        <div className="space-y-6 pt-6 border-t border-stone-200">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-stone-500">
              Mua Lẻ Cuối Ngày
            </div>
            <h2 className="text-2xl font-black text-stone-900 mt-0.5">
              Món Hời Giờ Vàng (Bán Lẻ)
            </h2>
          </div>

          {/* Search, Category Bar & Sort Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tiệm bánh, bún chả, cơm niêu Cầu Giấy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 whitespace-nowrap">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
                >
                  <option value="discount">Giảm giá nhiều nhất</option>
                  <option value="distance">Gần tôi nhất (Cầu Giấy)</option>
                  <option value="price">Giá từ thấp đến cao</option>
                </select>
              </div>
            </div>

            {/* 9 Categories Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Tất cả (9 nhóm)
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Retail Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retailDeals.map((deal) => {
              const isGiveaway = deal.type === 'GIVEAWAY_0K';
              return (
                <div
                  key={deal.id}
                  onClick={() => onSelectDeal(deal)}
                  className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div
                        className={`absolute top-3 left-3 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-xs ${
                          isGiveaway ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      >
                        {isGiveaway ? 'TẶNG 0đ' : `GIẢM ${deal.currentDiscountPercent}%`}
                      </div>

                      {deal.floorPrice && (
                        <div className="absolute top-3 right-3 bg-stone-900/80 text-stone-200 text-[10px] font-mono px-2 py-0.5 rounded-md">
                          Sàn {formatPrice(deal.floorPrice)}
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium bg-stone-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Nhận: {deal.pickupStart} – {deal.pickupEnd}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-300 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span>Còn {deal.remainingMinutes}p</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="text-xs text-stone-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{deal.storeName} · {deal.distanceKm} km</span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-stone-500">
                        Địa chỉ: {deal.storeAddress}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                    <div>
                      {deal.originalPrice > deal.currentPrice && (
                        <span className="text-xs text-stone-400 line-through font-mono mr-1.5">
                          {formatPrice(deal.originalPrice)}
                        </span>
                      )}
                      <span className="text-lg font-black text-amber-600 font-mono">
                        {isGiveaway ? '0đ (Miễn phí)' : formatPrice(deal.currentPrice)}
                      </span>
                    </div>

                    <button className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors flex items-center gap-1 cursor-pointer shadow-xs">
                      <span>{isGiveaway ? 'Nhận 0đ' : 'Rước Món'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {retailDeals.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-stone-700">Chưa có món nào phù hợp bộ lọc</h3>
              <p className="text-xs text-stone-500 mt-1">Hãy thử đổi danh mục hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
