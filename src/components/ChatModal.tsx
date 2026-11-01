import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Store, User, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface ChatModalProps {
  currentUser: UserProfile | null;
  storeName: string;
  storeAddress?: string;
  orderCode?: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  currentUser,
  storeName,
  storeAddress = 'Phố Duy Tân, Cầu Giấy, Hà Nội',
  orderCode,
  messages,
  onSendMessage,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const isSeller = currentUser?.role === 'SELLER';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[600px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white border-b border-stone-200 px-5 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 font-bold">
              <Store className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 text-sm">{storeName}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] text-emerald-700 font-medium">Trực tuyến</span>
              </div>
              <p className="text-[11px] text-stone-500 truncate max-w-[260px]">
                {orderCode ? `Trao đổi về đơn hàng #${orderCode}` : storeAddress}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-amber-50/70 border-b border-amber-100 px-4 py-2 flex items-center gap-2 text-xs text-amber-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="text-[11px]">
            Hỏi quán về món ăn trong Túi Bất Ngờ, giờ nhận hàng hoặc ghi chú dị ứng.
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/60">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-2">
              <MessageSquare className="w-10 h-10 stroke-1 text-stone-300" />
              <p className="text-xs text-stone-500 font-medium">Chưa có tin nhắn nào</p>
              <p className="text-[11px] text-stone-400 max-w-xs">
                Bạn có thể gửi câu hỏi cho quán về khung giờ tới lấy hoặc thành phần món ăn!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine =
                (isSeller && msg.sender === 'SELLER') || (!isSeller && msg.sender === 'BUYER');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-stone-400 font-medium px-1 mb-0.5">
                    {msg.senderName} · {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                      isMine
                        ? 'bg-amber-600 text-white rounded-br-xs'
                        : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto text-[11px]">
          <button
            type="button"
            onClick={() => onSendMessage('Quán ơi, túi bất ngờ hôm nay còn những loại bánh gì ạ?')}
            className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 whitespace-nowrap transition-colors"
          >
            Túi hôm nay có món gì?
          </button>
          <button
            type="button"
            onClick={() => onSendMessage('Mình chuẩn bị tới lấy theo mã đơn hàng nhé!')}
            className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 whitespace-nowrap transition-colors"
          >
            Mình chuẩn bị tới lấy
          </button>
          <button
            type="button"
            onClick={() => onSendMessage('Quán có thể để riêng đồ chay cho mình được không?')}
            className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 whitespace-nowrap transition-colors"
          >
            Lưu ý món chay
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isSeller ? 'Trả lời khách hàng...' : 'Nhập tin nhắn gửi quán...'}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white rounded-2xl font-bold text-xs transition-colors flex items-center justify-center cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
