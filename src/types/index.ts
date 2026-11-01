export type CategoryId = 
  | 'banh-ngot' 
  | 'com' 
  | 'bun-pho' 
  | 'do-uong' 
  | 'hoa-qua' 
  | 'rau-cu' 
  | 'pizza' 
  | 'mon-chay' 
  | 'khac';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  count: number;
}

export type DealType = 'SURPRISE_BAG' | 'RETAIL' | 'GIVEAWAY_0K';

export interface Deal {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  distanceKm: number;
  area: string; // e.g. "Duy Tân, Cầu Giấy"
  title: string;
  type: DealType;
  originalPrice: number;
  currentPrice: number;
  floorPrice?: number; // Minimum price for retail deals
  category: CategoryId;
  image: string;
  pickupStart: string; // e.g. "20:30"
  pickupEnd: string; // e.g. "21:30"
  remainingMinutes: number; // for dynamic pricing
  stockQuantity: number;
  soldQuantity: number;
  
  // Surprise Bag specifics
  possibleCategories?: string[]; // e.g. ["Bánh ngọt", "Bánh mì mặn", "Bánh kem mini"]
  allergenNote?: string; // Max 200 chars
  
  // Dynamic pricing discount breakdown
  currentDiscountPercent: number;
  
  hasFoodSafetyBadge: boolean;
  isFeatured?: boolean;
}

export interface Order {
  id: string;
  pickupCode: string; // Format: AXXXX (e.g. A4821)
  dealId: string;
  dealTitle: string;
  storeName: string;
  storeAddress: string;
  quantity: number;
  totalPrice: number;
  discountAmount: number;
  voucherCode?: string;
  status: 'PENDING_PAYMENT' | 'PAID_AWAITING_PICKUP' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'MOMO' | 'VNPAY' | 'ZALOPAY' | 'PAYOS' | 'VIETQR' | 'FREE';
  createdAt: string;
  pickupWindow: string;
  greenPointsAwarded: number;
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  requiredPoints: number;
  discountValue: number;
  minOrderValue: number;
  validDays: number;
  description: string;
}

export interface StoreProfile {
  storeId: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  operatingMonths: number;
  foodSafetyVerified: boolean;
  foodSafetyCertUrl?: string;
  currentTier: 'STAGE_1' | 'STAGE_2' | 'STAGE_3';
  commissionRate: number;
  maintenanceFee: number;
  feeDueDate: string;
  totalRescuedMeals: number;
  totalRevenue: number;
  pendingCommissionDebt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER';
  phone: string;
  address: string;
  avatar: string;
  storeId?: string; // If seller
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  storeId: string;
  storeName: string;
  sender: 'BUYER' | 'SELLER';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ORDER' | 'DEAL' | 'POINTS' | 'SYSTEM';
}

export interface OrderReview {
  orderId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
