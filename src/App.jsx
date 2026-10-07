import React, { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { WeddingDataProvider, useWeddingData } from './context/WeddingDataContext';
import EnvelopeIntro from './components/EnvelopeIntro';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import Hero from './components/Hero';
import useScrollReveal from './hooks/useScrollReveal';
import { formatWeddingDate, getPrimaryDate } from './utils/weddingDate';

const AdminModal = lazy(() => import('./components/AdminModal'));
const InvitationContent = lazy(() => import('./components/InvitationContent'));

function WeddingApp() {
  const { data, isAdminOpen } = useWeddingData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [loadContent, setLoadContent] = useState(false);
  const heroRef = useRef(null);
  const audioRef = useRef(null);
  const startMusic = useCallback(() => {
    audioRef.current?.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
  }, []);
  const startOpening = useCallback(() => { setLoadContent(true); startMusic(); }, [startMusic]);
  const finishOpening = useCallback(() => setEnvelopeOpened(true), []);
  useScrollReveal(heroRef, envelopeOpened, data);
  return (
    <>
      {!envelopeOpened && <EnvelopeIntro onStart={startOpening} onOpen={finishOpening}
        coupleNames={`${data.couple.groom.name} & ${data.couple.bride.name}`} date={formatWeddingDate(getPrimaryDate(data))} />}
      <AudioPlayer audioRef={audioRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <main data-opened={envelopeOpened} inert={!envelopeOpened || isAdminOpen} className="wedding-page bg-cream-50 text-charcoal-800 font-sans selection:bg-champagne selection:text-charcoal-900">
        <Navbar contentReady={loadContent} isPlaying={isPlaying} toggleMusic={() => isPlaying ? setIsPlaying(false) : startMusic()} />
        <div ref={heroRef}><Hero /></div>
        {loadContent && <Suspense fallback={<div className="py-16 text-center text-gold-700" role="status">Đang mở nội dung thiệp…</div>}><InvitationContent opened={envelopeOpened} /></Suspense>}
      </main>
      {isAdminOpen && <Suspense fallback={<div className="fixed inset-0 z-50 grid place-items-center bg-cream-50" role="status">Đang mở phần chỉnh sửa…</div>}><AdminModal /></Suspense>}
    </>
  );
}
export default function App() {
  return <WeddingDataProvider><WeddingApp /></WeddingDataProvider>;
}
