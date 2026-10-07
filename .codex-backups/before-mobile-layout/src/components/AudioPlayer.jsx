import React, { useRef, useEffect } from 'react';
import { useWeddingData } from '../context/WeddingDataContext';

export default function AudioPlayer({ isPlaying, setIsPlaying }) {
  const { data } = useWeddingData();
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => {
        console.log('Audio autoplay prevented by browser:', e);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <audio
      ref={audioRef}
      src={data.audio?.src || "/assets/music.mp3"}
      loop
      preload="auto"
    />
  );
}
