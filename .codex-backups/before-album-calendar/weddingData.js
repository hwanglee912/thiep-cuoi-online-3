/**
 * ==============================================================================
 * THIET LAP THONG TIN THIEP CUOI ONLINE
 * Ban co the de dang thay doi cac thong tin duoi day de cap nhat toan bo trang web.
 * ==============================================================================
 */

export const weddingData = {
  // Thong tin co dau & chu re
  couple: {
    groom: {
      name: "HOÀNG DŨNG",
      fullName: "Nguyễn Hoàng Dũng",
      role: "Chú rể",
      avatar: "/assets/sf-img-2.webp",
      bio: "Một chàng trai yêu sự giản dị, luôn tin rằng gặp được em là điều kỳ diệu và may mắn nhất trong cuộc đời này.",
    },
    bride: {
      name: "THÙY DUNG",
      fullName: "Đặng Thùy Dung",
      role: "Cô dâu",
      avatar: "/assets/sf-img-3.webp",
      bio: "Một cô gái ấm áp, luôn mỉm cười khi ở bên anh. Cảm ơn anh đã luôn kiên nhẫn, yêu thương và che chở cho em.",
    },
    heroImage: "/assets/sf-img-0.webp",
    quote: "Tình yêu của anh và em là một hành trình kỳ diệu, vượt qua bao thử thách để cùng nhau bước đến ngày trọng đại – ngày của chúng mình. Đám cưới này là lời cam kết chân thành, là khởi đầu cho một chương mới nơi chúng ta cùng vun đắp tổ ấm, sẻ chia vui buồn và nắm tay nhau đi đến cuối con đường mang tên hạnh phúc.",
    storySnippet: "Từ những ngày đầu ngập ngừng cho đến khoảnh khắc quyết định nắm tay nhau trọn đời, từng phút giây trôi qua đều là những ký ức vô giá.",
  },

  // Nhac nen thiep cuoi
  audio: {
    title: "Until I Found You - Acoustic Romance",
    src: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89b25f168.mp3?filename=romantic-wedding-piano-112191.mp3",
    fallbackSrc: "/assets/music.mp3",
  },

  // THONG TIN HAI NGAY TIEC - XEP DOC THEO YEU CAU
  events: [
    {
      id: "vu-quy",
      title: "LỄ VU QUY",
      subtitle: "TIỆC MỪNG NHÀ GÁI",
      badge: "LỄ VU QUY",
      parents: {
        father: "Ông. Đặng Chiến Công",
        mother: "Bà. Nguyễn Kim Thoa",
        location: "TP. Nha Trang",
      },
      time: "17 GIỜ 30 PHÚT",
      dayOfWeek: "THỨ NĂM",
      solarDate: {
        day: "26",
        month: "11",
        year: "2026",
      },
      lunarDate: "Tức ngày 07 tháng 10 năm Bính Ngọ",
      venue: {
        name: "TƯ GIA NHÀ GÁI",
        address: "137 Đ. Trường Chinh, Khương Mai, Thanh Xuân, Hà Nội",
        mapUrl: "https://maps.google.com/?q=137+Đường+Trường+Chinh,+Khương+Mai,+Thanh+Xuân,+Hà+Nội",
      },
      calendarEvent: {
        title: "Lễ Vu Quy - Hoàng Dũng & Thùy Dung",
        startDate: "20261126T173000",
        endDate: "20261126T210000",
        details: "Trân trọng kính mời quý khách đến tham dự Lễ Vu Quy cùng gia đình chúng mình!",
        location: "137 Đ. Trường Chinh, Khương Mai, Thanh Xuân, Hà Nội",
      }
    },
    {
      id: "than-mat",
      title: "BỮA CƠM THÂN MẬT",
      subtitle: "TIỆC MỪNG GIA ĐÌNH & BẠN BÈ",
      badge: "BỮA CƠM THÂN MẬT",
      parents: {
        father: "Ông. Nguyễn Anh Quân",
        mother: "Bà. Hoàng Thị Hương",
        location: "TP. Hà Nội",
      },
      time: "11 GIỜ 00 PHÚT",
      dayOfWeek: "THỨ BẢY",
      solarDate: {
        day: "05",
        month: "12",
        year: "2026",
      },
      lunarDate: "Tức ngày 16 tháng 10 năm Bính Ngọ",
      venue: {
        name: "TRUNG TÂM TIỆC CƯỚI TRỐNG ĐỒNG PALACE",
        address: "72 Trần Đăng Ninh, Dịch Vọng, Cầu Giấy, Hà Nội",
        mapUrl: "https://maps.google.com/?q=Trống+Đồng+Palace,+72+Trần+Đăng+Ninh,+Cầu+Giấy,+Hà+Nội",
      },
      calendarEvent: {
        title: "Bữa Cơm Thân Mật - Hoàng Dũng & Thùy Dung",
        startDate: "20261205T110000",
        endDate: "20261205T143000",
        details: "Trân trọng kính mời quý khách đến tham dự Bữa Cơm Thân Mật cùng gia đình chúng mình!",
        location: "72 Trần Đăng Ninh, Dịch Vọng, Cầu Giấy, Hà Nội",
      }
    }
  ],

  // Album anh cuoi ky niem (Gallery)
  gallery: [
    {
      src: "/assets/sf-img-14.webp",
      alt: "Khoảnh khắc ngọt ngào bên nhau",
      caption: "Cùng anh đi qua muôn nẻo đường",
      span: "col-span-12 md:col-span-8",
    },
    {
      src: "/assets/sf-img-2.webp",
      alt: "Chú rể rạng ngời",
      caption: "Ánh mắt trao trọn niềm tin",
      span: "col-span-12 md:col-span-4",
    },
    {
      src: "/assets/sf-img-3.webp",
      alt: "Cô dâu thanh tú",
      caption: "Nụ cười rạng rỡ của em",
      span: "col-span-12 md:col-span-4",
    },
    {
      src: "/assets/sf-img-24.webp",
      alt: "Hạnh phúc đong đầy",
      caption: "Bắt đầu hành trình lứa đôi",
      span: "col-span-12 md:col-span-8",
    },
    {
      src: "/assets/sf-img-0.webp",
      alt: "Nắm tay em qua năm tháng",
      caption: "Giản dị mà chân thành",
      span: "col-span-6 md:col-span-4",
    },
    {
      src: "/assets/sf-img-6.webp",
      alt: "Bản giao hưởng tình yêu",
      caption: "Từng ngày bên em là một món quà",
      span: "col-span-6 md:col-span-4",
    },
    {
      src: "/assets/sf-img-9.webp",
      alt: "Mùa yêu thương nở hoa",
      caption: "Vĩnh cửu trong từng ánh nhìn",
      span: "col-span-12 md:col-span-4",
    },
    {
      src: "/assets/sf-img-14.webp",
      alt: "Lời hẹn ước trọn đời",
      caption: "Mãi mãi bên nhau",
      span: "col-span-6 md:col-span-6",
    },
    {
      src: "/assets/sf-img-17.webp",
      alt: "Ánh hoàng hôn dịu ngọt",
      caption: "Khoảnh khắc bình yên",
      span: "col-span-6 md:col-span-6",
    }
  ],

  // Countdown target date (Chon ngay dau tien de dem nguoc: 26/11/2026 17:30)
  targetDate: "2026-11-26T17:30:00+07:00",

  // Thong diep cam on
  thankYouMessage: {
    title: "Thank You",
    subtitle: "Lời cảm ơn từ tận đáy lòng",
    content: "Sự hiện diện và lời chúc phúc chân thành của bạn chính là món quà ý nghĩa nhất dành cho chúng mình. Chúng mình vô cùng biết ơn và trân quý khi được sẻ chia trọn vẹn niềm hạnh phúc này bên những người thân thương nhất.",
  }
};
