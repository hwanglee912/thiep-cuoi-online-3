import React from 'react';
import { Calendar, Heart } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import Countdown from './Countdown';

export default function CoupleIntro() {
  const { data } = useWeddingData();
  const { groom, bride, quote, storySnippet } = data.couple;
  return (
    <section id="couple" className="couple-invitation" aria-labelledby="invitation-title">
      <div className="invitation-heading" data-reveal="up">
        <h2 id="invitation-title" className="font-serif">Thư mời tham dự lễ cưới</h2>
        <p className="invitation-guest font-script">Khách mời</p>
        <div className="invitation-rule" aria-hidden="true" />
        <p className="invitation-message font-serif">
          Trân trọng kính mời đến dự lễ cưới của<br />
          {groom.name} & {bride.name}
        </p>
      </div>
      {/* Offset portraits follow the document flow, never absolute coordinates. */}
      <div className="couple-portraits">
        <article className="couple-profile groom-profile" aria-labelledby="groom-name">
          <div className="couple-label groom-label" data-reveal="left">
            <p className="couple-role font-script">Chú rể</p>
            <h3 id="groom-name" className="couple-name font-serif">{groom.name}</h3>
          </div>
          <figure className="couple-photo" data-reveal="left" style={{ '--reveal-delay': '80ms' }}>
            <img src={groom.avatar} alt={`Chú rể ${groom.fullName}`} width="614" height="921"
              loading="lazy" decoding="async" style={{ objectPosition: groom.imagePosition || '50% 35%' }} />
          </figure>
        </article>
        <article className="couple-profile bride-profile" aria-labelledby="bride-name">
          <figure className="couple-photo" data-reveal="right">
            <img src={bride.avatar} alt={`Cô dâu ${bride.fullName}`} width="614" height="921"
              loading="lazy" decoding="async" style={{ objectPosition: bride.imagePosition || '50% 35%' }} />
          </figure>
          <div className="couple-label bride-label" data-reveal="right" style={{ '--reveal-delay': '80ms' }}>
            <p className="couple-role font-script">Cô dâu</p>
            <h3 id="bride-name" className="couple-name font-serif">{bride.name}</h3>
          </div>
        </article>
      </div>
      {storySnippet && <p className="couple-quote font-serif" data-reveal="up">{storySnippet}</p>}
      {quote && <details className="couple-message">
        <summary className="font-serif">Đôi lời từ chúng mình</summary>
        <blockquote className="couple-quote font-serif">“{quote}”</blockquote>
      </details>}
      <div className="invitation-details" data-reveal="up">
        <p className="font-script countdown-heading">Đếm ngược đến ngày chung đôi</p>
        <Countdown />
        <div className="invitation-actions">
          <a href="#events" className="invitation-button invitation-button-primary"><Calendar size={17} />Xem ngày tiệc</a>
          <a href="#rsvp" className="invitation-button"><Heart size={17} />Gửi lời chúc</a>
        </div>
      </div>
    </section>
  );
}
