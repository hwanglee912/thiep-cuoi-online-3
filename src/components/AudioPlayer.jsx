import React, { useEffect, useState } from 'react';
import { useWeddingData } from '../context/WeddingDataContext';

export default function AudioPlayer({ audioRef, isPlaying, setIsPlaying }) {
  const { data } = useWeddingData();
  const [failedSource, setFailedSource] = useState(null);
  const requestedSource = data.audio?.src || data.audio?.fallbackSrc;
  const source = failedSource === requestedSource ? data.audio?.fallbackSrc : requestedSource;

  useEffect(() => {
    if (!audioRef.current) return;
    let cancelled = false;
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        if (!cancelled) setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
    return () => { cancelled = true; };
  }, [audioRef, isPlaying, source, setIsPlaying]);

  return (
    <audio
      ref={audioRef}
      src={source || undefined}
      loop
      preload="none"
      onError={() => {
        if (data.audio?.fallbackSrc && source !== data.audio.fallbackSrc) setFailedSource(requestedSource);
        else setIsPlaying(false);
      }}
    />
  );
}
