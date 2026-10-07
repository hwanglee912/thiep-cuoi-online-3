import React, { useState, useEffect } from 'react';
import { Send, Heart, CheckCircle2, MessageSquareHeart, Sparkles, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RSVPSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attending: 'yes',
    eventChoice: 'both',
    wish: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);
  const [wishesList, setWishesList] = useState([
    {
      name: "Minh Anh & Gia đình",
      attending: "yes",
      wish: "Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long, luôn yêu thương và cùng nhau vượt qua mọi chặng đường nhé!",
      time: "Vừa xong",
    },
    {
      name: "Hội bạn thân cấp 3",
      attending: "yes",
      wish: "Chúc mừng ngày trọng đại của Đức Anh và Thu Uyên! Đợi ngày cụng ly cùng hai bạn!",
      time: "Hôm qua",
    }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('wedding_wishes');
    if (saved) {
      try {
        setWishesList(JSON.parse(saved));
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Trigger luxury celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#DFBE7A', '#B88D37', '#FAF6EE', '#7C4A47']
      });
    } catch (err) {
      // fallback if confetti fails
    }

    const newWish = {
      name: formData.name,
      attending: formData.attending,
      wish: formData.wish || 'Chúc hai bạn mãi mãi hạnh phúc và ngọt ngào bên nhau!',
      time: 'Vừa xong',
    };

    const updated = [newWish, ...wishesList];
    setWishesList(updated);
    localStorage.setItem('wedding_wishes', JSON.stringify(updated));

    setSubmitted(true);
  };

  const shareViaZalo = () => {
    const text = `Lời chúc cưới từ ${formData.name}: "${formData.wish || 'Chúc hai bạn trăm năm hạnh phúc!'}" (${formData.attending === 'yes' ? 'Sẽ tham dự' : 'Gửi lời chúc từ xa'})`;
    navigator.clipboard.writeText(text);
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 3000);
  };

  return (
    <section id="rsvp" className="py-24 md:py-36 px-4 md:px-8 max-w-4xl mx-auto vintage-texture">
      {/* Editorial Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="font-serif italic text-gold-600 text-lg md:text-xl font-normal">
          RSVP & Wishes
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal-900 font-normal">
          Xác Nhận Tham Dự & Lời Chúc
        </h2>
        <p className="font-sans text-sm md:text-base text-charcoal-800/70 font-light">
          Sự hiện diện của bạn là niềm vinh hạnh to lớn đối với gia đình chúng mình. Vui lòng xác nhận để chúng mình chu đáo đón tiếp nhất nhé.
        </p>
        <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4" />
      </div>

      {/* Main Interactive Form Card */}
      <div className="p-6 sm:p-10 md:p-12 rounded-3xl glass-card border-2 border-champagne/80 shadow-luxury">
        {submitted ? (
          <div className="text-center py-8 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-cream-200 text-gold-600 flex items-center justify-center mx-auto border-2 border-gold-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-semibold">
              Cảm ơn {formData.name}!
            </h3>
            
            <p className="font-sans text-sm sm:text-base text-charcoal-800/80 max-w-md mx-auto font-light leading-relaxed">
              Lời chúc và xác nhận của bạn đã được gửi đến cô dâu và chú rể. Chúng mình rất nóng lòng được gặp bạn trong ngày vui!
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={shareViaZalo}
                className="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                {copiedZalo ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã sao chép để gửi Zalo!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Sao chép lời chúc gửi qua Zalo</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-full bg-white hover:bg-cream-100 border border-champagne text-charcoal-800 text-xs sm:text-sm transition-all"
              >
                Gửi thêm lời chúc khác
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên khách mời */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-sans font-medium text-charcoal-900 tracking-wide uppercase">
                Tên của bạn <span className="text-rosewood">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Hoàng Minh Cảnh, Bạn Tuấn Anh..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-champagne focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none text-charcoal-900 text-sm transition-all"
              />
            </div>

            {/* Số điện thoại (tùy chọn) */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-sans font-medium text-charcoal-900 tracking-wide uppercase">
                Số điện thoại <span className="text-charcoal-800/40 text-xs normal-case">(Tùy chọn)</span>
              </label>
              <input
                type="tel"
                placeholder="Để cô dâu chú rể tiện liên hệ đón tiếp"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-champagne focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none text-charcoal-900 text-sm transition-all"
              />
            </div>

            {/* Trạng thái tham dự */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-sans font-medium text-charcoal-900 tracking-wide uppercase">
                Bạn sẽ tham dự chứ?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: 'yes' })}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                    formData.attending === 'yes'
                      ? 'bg-gold-500 border-gold-600 text-white shadow-sm'
                      : 'bg-white border-champagne text-charcoal-800 hover:border-gold-400'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Chắc chắn sẽ tham gia!</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: 'no' })}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                    formData.attending === 'no'
                      ? 'bg-charcoal-800 border-charcoal-900 text-white shadow-sm'
                      : 'bg-white border-champagne text-charcoal-800 hover:border-gold-400'
                  }`}
                >
                  <span>Rất tiếc, mình bận rồi</span>
                </button>
              </div>
            </div>

            {/* Tham dự ngày tiệc nào */}
            {formData.attending === 'yes' && (
              <div className="space-y-2 animate-fade-in">
                <label className="block text-xs sm:text-sm font-sans font-medium text-charcoal-900 tracking-wide uppercase">
                  Bạn tham gia ngày tiệc nào?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                  {[
                    { id: 'both', label: 'Cả 2 ngày tiệc' },
                    { id: 'vu-quy', label: 'Lễ Vu Quy (Nhà Gái - 26/11)' },
                    { id: 'than-mat', label: 'Bữa Cơm Thân Mật (05/12)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, eventChoice: item.id })}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        formData.eventChoice === item.id
                          ? 'border-gold-500 bg-gold-50 font-semibold text-gold-700'
                          : 'border-champagne/80 bg-white text-charcoal-800 hover:bg-cream-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lời chúc */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-sans font-medium text-charcoal-900 tracking-wide uppercase">
                Lời chúc gửi tới đôi uyên ương
              </label>
              <textarea
                rows={3}
                placeholder="Gửi gắm lời chúc ngọt ngào nhất của bạn..."
                value={formData.wish}
                onChange={(e) => setFormData({ ...formData, wish: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/90 border border-champagne focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none text-charcoal-900 text-sm transition-all"
              />
            </div>

            {/* Nút gửi */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white font-medium text-sm sm:text-base tracking-wider transition-all duration-300 shadow-md hover:shadow-luxury flex items-center justify-center gap-2 group"
            >
              <Send className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform" />
              <span>GỬI XÁC NHẬN & LỜI CHÚC</span>
            </button>
          </form>
        )}
      </div>

      {/* Guestbook List - Hộp lưu bút */}
      <div className="mt-14 space-y-4">
        <div className="flex items-center gap-2 text-charcoal-900 font-serif text-xl sm:text-2xl font-semibold">
          <MessageSquareHeart className="w-5 h-5 text-gold-500" />
          <span>Sổ Lưu Bút Lời Chúc ({wishesList.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishesList.map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-white/80 border border-champagne/60 shadow-sm space-y-2 hover:border-gold-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-charcoal-900 text-base">
                  {item.name}
                </span>
                <span className="text-[11px] text-charcoal-800/50 font-sans">
                  {item.time}
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-charcoal-800/80 font-light leading-relaxed">
                "{item.wish}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
