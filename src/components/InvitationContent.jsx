import React, { useRef } from 'react';
import { useWeddingData } from '../context/WeddingDataContext';
import useScrollReveal from '../hooks/useScrollReveal';
import CoupleIntro from './CoupleIntro';
import DualEventCards from './DualEventCards';
import Gallery from './Gallery';
import RSVPSection from './RSVPSection';
import Footer from './Footer';
import FallingPetals from './FallingPetals';

export default function InvitationContent({ opened }) {
  const { data } = useWeddingData();
  const rootRef = useRef(null);
  useScrollReveal(rootRef, opened, data);
  return (
    <div ref={rootRef}>
      {opened && <FallingPetals />}
      <CoupleIntro />
      <DualEventCards />
      <Gallery />
      <RSVPSection />
      <Footer />
    </div>
  );
}
