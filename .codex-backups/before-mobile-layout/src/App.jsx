import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WeddingDataProvider, useWeddingData } from './context/WeddingDataContext';
import EnvelopeIntro from './components/EnvelopeIntro';
import AdminModal from './components/AdminModal';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import Hero from './components/Hero';
import DualEventCards from './components/DualEventCards';
import Gallery from './components/Gallery';
import RSVPSection from './components/RSVPSection';
import Footer from './components/Footer';
import FallingPetals from './components/FallingPetals';

gsap.registerPlugin(ScrollTrigger);

function WeddingApp() {
  const { data } = useWeddingData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
  };

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    setIsPlaying(true);
  };

  useEffect(() => {
    // GSAP section entrance animations
    const sections = document.querySelectorAll('section');
    sections.forEach((sec) => {
      gsap.fromTo(
        sec,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, []);

  return (
    <main className="min-h-screen bg-cream-50 text-charcoal-800 font-sans selection:bg-champagne selection:text-charcoal-900 overflow-x-hidden w-full max-w-full pb-16 md:pb-0 relative">
      {/* Hiệu ứng cánh hoa rơi nhẹ nhàng (Falling Petals) */}
      <FallingPetals />

      {/* 1. Màn hình mở phong bì thiệp cưới (Envelope Intro) */}
      {!envelopeOpened && (
        <EnvelopeIntro 
          onOpen={handleOpenEnvelope} 
          coupleNames={`${data.couple?.groom?.name} & ${data.couple?.bride?.name}`}
          date="26.11.2026"
        />
      )}

      {/* 2. Modal quản trị Admin (Mật khẩu: hihihaha) */}
      <AdminModal />

      {/* 3. Navigation Bar (Top Desktop + Mobile Bottom Dock) */}
      <Navbar isPlaying={isPlaying} toggleMusic={toggleMusic} />

      {/* 4. Background Audio Player */}
      <AudioPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />

      {/* 5. Hero Section */}
      <Hero />

      {/* 6. Dual Event Cards (Mục ảnh 3 nhân đôi cho 2 ngày tiệc: Vu Quy & Bữa Cơm Thân Mật) */}
      <DualEventCards />

      {/* 7. Bento Grid Photo Gallery with Lightbox */}
      <Gallery />

      {/* 9. RSVP Confirmation & Wishes Guestbook */}
      <RSVPSection />

      {/* 10. Cinematic Thank You Footer */}
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <WeddingDataProvider>
      <WeddingApp />
    </WeddingDataProvider>
  );
}
