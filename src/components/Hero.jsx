import React from 'react';
import { useWeddingData } from '../context/WeddingDataContext';
import { formatWeddingDate, getPrimaryDate } from '../utils/weddingDate';

export default function Hero() {
  const { data } = useWeddingData();
  const { groom, bride, heroImage } = data.couple;
  return (
    <section id="hero" className="wedding-hero" aria-labelledby="couple-names">
      <img src={heroImage} alt={`${groom.name} và ${bride.name} trong ngày cưới`}
        className="hero-photo" width="852" height="1278" fetchPriority="high" loading="eager" decoding="async"
        style={{ objectPosition: data.couple.heroImagePosition || '50% 32%' }} />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-copy">
        <p className="font-wedding hero-announcement" data-reveal="up">We are getting married!</p>
        <div className="hero-names" data-reveal="up" style={{ '--reveal-delay': '100ms' }}>
          <span className="hero-ampersand font-script" aria-hidden="true">&</span>
          <h1 id="couple-names" className="font-serif">
            <span>{groom.name}</span><span className="sr-only">và</span><span>{bride.name}</span>
          </h1>
        </div>
        <p className="hero-date" data-reveal="up" style={{ '--reveal-delay': '180ms' }}>
          {formatWeddingDate(getPrimaryDate(data))}
        </p>
      </div>
    </section>
  );
}
