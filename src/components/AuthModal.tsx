import React, { useState } from 'react';
import { X, User, Store, Lock, Mail, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  currentUser: UserProfile | null;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onClose,
  onLogin,
  onLogout,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Phố Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội');
  const [error, setError] = useState('');

  // Preset demo accounts for quick testing
  const demoAccounts = {
    buyer: {
      id: 'usr-buyer-01',
      name: 'Nguyễn Minh Hoàng',
      email: 'minhhoang.caugiay@lastbite.vn',
      role: 'BUYER' as const,
      phone: '0988 123 456',
      address: 'Số 18, Ngõ 20 Phố Dịch Vọng, Cầu Giấy, Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    seller: {
      id: 'store-duytan-01',
      name: 'Tiệm Bánh Paris Artisan (Chủ quán)',
      email: 'paris.duytan@lastbite.vn',
      role: 'SELLER' as const,
      phone: '024 3795 8888',
      address: 'Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
      storeId: 'store-duytan-01',
    },
  };

  const handleQuickLogin = (role: 'BUYER' | 'SELLER') => {
    if (role === 'BUYER') {
      onLogin(demoAccounts.buyer);
    } else {
      onLogin(demoAccounts.seller);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    if (mode === 'REGISTER' && !fullName) {
      setError('Vui lòng nhập họ tên hoặc tên quán của bạn.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: fullName || (selectedRole === 'BUYER' ? email.split('@')[0] : 'Quán ' + email.split('@')[0]),
      email,
      role: selectedRole,
      phone: phone || '098 765 4321',
      address: address || 'Cầu Giấy, Hà Nội',
      avatar: selectedRole === 'BUYER' ? demoAccounts.buyer.avatar : demoAccounts.seller.avatar,
      storeId: selectedRole === 'SELLER' ? `store-${Date.now()}` : undefined,
    };

    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {currentUser ? 'Tài Khoản LastBite' : mode === 'LOGIN' ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
            </h2>
            <p className="text-xs text-amber-100 mt-0.5">
              Hệ thống kết nối người mua và quán ăn cứu món Cầu Giấy
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Already Logged In */}
        {currentUser ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900 truncate">{currentUser.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      currentUser.role === 'SELLER'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {currentUser.role === 'SELLER' ? 'Chủ Quán' : 'Người Mua'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 truncate mt-0.5">{currentUser.email}</p>
                <p className="text-xs text-stone-500 truncate mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  {currentUser.address}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Chuyển nhanh tài khoản mẫu:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('BUYER')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    currentUser.role === 'BUYER'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-stone-900">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Người Mua</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">Minh Hoàng (150 Điểm)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('SELLER')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    currentUser.role === 'SELLER'
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-stone-900">
                    <Store className="w-4 h-4 text-amber-600" />
                    <span>Chủ Quán Ăn</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">Paris Artisan (Duy Tân)</div>
                </button>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition-colors"
              >
                Đăng Xuất Khỏi Thiết Bị
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          /* Login or Register Form */
          <div className="p-6 space-y-5">
            {/* 1-Click Quick Demo Sign In */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
              <span className="text-[11px] font-bold text-stone-700 block mb-2">
                Đăng nhập nhanh 1 chạm (Thử nghiệm ngay):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('BUYER')}
                  className="py-2 px-3 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 text-stone-800 hover:text-emerald-700 font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vào: Người Mua</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('SELLER')}
                  className="py-2 px-3 rounded-xl bg-white border border-stone-200 hover:border-amber-500 text-stone-800 hover:text-amber-700 font-semibold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>Vào: Quán Ăn</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] text-stone-500 uppercase tracking-wider font-semibold absolute">
                Hoặc nhập thông tin
              </span>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedRole('BUYER')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'BUYER'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tôi là Người Mua</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('SELLER')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'SELLER'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Tôi là Quán Ăn</span>
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {selectedRole === 'BUYER' ? 'Họ và tên của bạn' : 'Tên Quán Ăn / Tiệm'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={selectedRole === 'BUYER' ? 'Ví dụ: Nguyễn Văn A' : 'Ví dụ: Cơm Thố Bách Khoa'}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email đăng nhập</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {mode === 'REGISTER' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Địa chỉ khu vực Cầu Giấy
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Số nhà, Tên đường, Phường tại Cầu Giấy"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{mode === 'LOGIN' ? 'Đăng Nhập Ngay' : 'Hoàn Tất Đăng Ký'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                }}
                className="text-xs text-stone-600 hover:text-amber-600 font-semibold transition-colors"
              >
                {mode === 'LOGIN'
                  ? 'Chưa có tài khoản? Đăng ký tham gia LastBite'
                  : 'Đã có tài khoản? Nhấn để đăng nhập'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
