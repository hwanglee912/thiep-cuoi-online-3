import React, { useState } from 'react';
import { MapPin, Navigation, Calendar as CalendarIcon, Clock, Heart, Download, Check } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import CalendarWidget from './CalendarWidget';

export default function DualEventCards() {
  const { data } = useWeddingData();
  const [copiedId, setCopiedId] = useState(null);

  const copyAddress = (id, address) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="events" className="py-20 md:py-32 px-4 md:px-8 max-w-4xl mx-auto vintage-texture">
      {/* Editorial Section Header: CHUYỂN TIỆC MỪNG NHÀ GÁI LÊN TRÊN THEO YÊU CẦU */}
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
        <span className="font-serif italic text-gold-600 text-sm sm:text-base md:text-lg font-normal tracking-[0.25em] uppercase">
          Save The Dates
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal-900 font-bold tracking-wide uppercase gold-gradient-text">
          Tiệc Mừng Nhà Gái
        </h2>
        <p className="font-sans text-xs sm:text-sm text-charcoal-800/70 font-light max-w-md mx-auto">
          Trân trọng kính mời quý khách đến tham dự và chung vui cùng gia đình chúng mình.
        </p>
        <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4" />
      </div>

      {/* Thông tin Đại diện Tứ Thân Phụ Mẫu (Nhà Trai - Nhà Gái) đặt trang trọng phía trên */}
      <div className="max-w-2xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl glass-card border border-champagne/80 shadow-soft text-center">
        <div className="grid grid-cols-2 gap-4">
          {/* Nhà Trai */}
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-xs sm:text-sm tracking-widest text-gold-600 uppercase">
              Nhà Trai
            </h4>
            <p className="font-serif text-sm sm:text-base text-charcoal-900 font-medium">Ông. Nguyễn Anh Quân</p>
            <p className="font-serif text-sm sm:text-base text-charcoal-900 font-medium">Bà. Hoàng Thị Hương</p>
            <p className="font-sans text-[11px] sm:text-xs text-charcoal-800/60 font-light">TP. Hà Nội</p>
          </div>

          {/* Nhà Gái */}
          <div className="space-y-1 border-l border-champagne/60">
            <h4 className="font-serif font-bold text-xs sm:text-sm tracking-widest text-gold-600 uppercase">
              Nhà Gái
            </h4>
            <p className="font-serif text-sm sm:text-base text-charcoal-900 font-medium">Ông. Đặng Chiến Công</p>
            <p className="font-serif text-sm sm:text-base text-charcoal-900 font-medium">Bà. Nguyễn Kim Thoa</p>
            <p className="font-sans text-[11px] sm:text-xs text-charcoal-800/60 font-light">TP. Nha Trang</p>
          </div>
        </div>
      </div>

      {/* Interactive Calendar with Heart on Wedding Date (Theo mẫu Hữu Khánh & Phạm Dung) */}
      <CalendarWidget targetDay={26} />

      {/* XẾP DỌC 2 THẺ SỰ KIỆN: LỄ VU QUY Ở TRÊN, BỮA CƠM THÂN MẬT Ở DƯỚI (BỎ TIỆC MỪNG NHÀ TRAI) */}
      <div className="flex flex-col gap-8 sm:gap-10 max-w-2xl mx-auto">
        {data.events.map((event, index) => {
          const googleCalUrl = generateGoogleCalendarUrl(event.calendarEvent);

          return (
            <div 
              key={event.id}
              className="relative p-6 sm:p-10 rounded-3xl glass-card border-2 border-champagne/80 hover:border-gold-400/80 shadow-luxury transition-all duration-500 hover:-translate-y-1"
            >
              {/* Event Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full bg-charcoal-900 text-champagne text-[11px] sm:text-xs font-sans tracking-widest uppercase shadow-md flex items-center gap-1.5 border border-gold-400/40">
                <Heart className="w-3 h-3 text-gold-400 fill-gold-400" />
                <span>{event.title}</span>
              </div>

              {/* Event Invitation Title & Time */}
              <div className="text-center space-y-1.5 pt-2 mb-6">
                <p className="font-sans text-xs tracking-widest text-charcoal-800/80 uppercase font-light">
                  {event.title} ĐƯỢC TỔ CHỨC
                </p>
                <div className="flex items-center justify-center gap-2 text-gold-600 font-serif font-semibold text-base sm:text-lg">
                  <Clock className="w-4 h-4" />
                  <span>VÀO LÚC {event.time}</span>
                </div>
                <p className="font-serif italic text-2xl sm:text-3xl font-semibold text-charcoal-900 uppercase tracking-wide">
                  {event.dayOfWeek}
                </p>
              </div>

              {/* Date Box Centerpiece */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 my-6 py-3 px-6 rounded-2xl bg-cream-100/90 border border-champagne/80 text-center max-w-xs mx-auto shadow-inner">
                <div className="text-right">
                  <span className="block text-[11px] sm:text-xs font-sans tracking-widest uppercase text-charcoal-800/70">
                    THÁNG
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-charcoal-900">
                    {event.solarDate.month}
                  </span>
                </div>

                {/* Big Day Number */}
                <div className="px-4 py-0.5 border-x-2 border-gold-400">
                  <span className="font-serif text-4xl sm:text-5xl font-bold gold-gradient-text leading-none">
                    {event.solarDate.day}
                  </span>
                </div>

                <div className="text-left">
                  <span className="block text-[11px] sm:text-xs font-sans tracking-widest uppercase text-charcoal-800/70">
                    NĂM
                  </span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-charcoal-900">
                    {event.solarDate.year}
                  </span>
                </div>
              </div>

              {/* Lunar Date */}
              <p className="text-center font-serif italic text-xs sm:text-sm text-charcoal-800/80 mb-6">
                ( {event.lunarDate} )
              </p>

              {/* Rings Ornate Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-full bg-cream-200/80 flex items-center justify-center border border-gold-300">
                  <img 
                    src="/assets/sf-img-4.png" 
                    alt="Nhẫn cưới" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>

              {/* Venue Details */}
              <div className="text-center space-y-1.5 mb-6">
                <h4 className="font-serif font-bold text-base sm:text-lg text-charcoal-900 tracking-wider">
                  {event.venue.name}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-charcoal-800/80 leading-relaxed font-light max-w-md mx-auto">
                  {event.venue.address}
                </p>

                {/* Quick copy address button */}
                <button
                  onClick={() => copyAddress(event.id, event.venue.address)}
                  className="inline-flex items-center gap-1 text-[11px] font-sans text-gold-600 hover:text-gold-700 underline underline-offset-4 pt-1 transition-colors cursor-pointer"
                >
                  {copiedId === event.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Đã sao chép địa chỉ</span>
                    </>
                  ) : (
                    <span>Sao chép địa chỉ</span>
                  )}
                </button>
              </div>

              {/* Action Buttons: Chỉ Đường & Thêm Vào Lịch */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                <a
                  href={event.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-charcoal-900 hover:bg-gold-600 text-white font-medium text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-luxury"
                >
                  <Navigation className="w-3.5 h-3.5 text-champagne" />
                  <span>CHỈ ĐƯỜNG (GOOGLE MAPS)</span>
                </a>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-white hover:bg-cream-100 border border-gold-400 text-charcoal-900 font-medium text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm"
                    title="Thêm vào Google Calendar"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-gold-600" />
                    <span>Lưu Lịch</span>
                  </a>

                  <button
                    onClick={() => downloadIcsFile(event.calendarEvent)}
                    className="px-3 py-3 rounded-xl bg-white hover:bg-cream-100 border border-champagne text-charcoal-800 text-xs sm:text-sm transition-all duration-300 flex items-center justify-center shadow-sm cursor-pointer"
                    title="Tải file nhắc nhở .ics cho iPhone / Outlook"
                  >
                    <Download className="w-3.5 h-3.5 text-charcoal-800/70" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
