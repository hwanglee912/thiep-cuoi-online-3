import React, { createContext, useContext, useState } from 'react';
import { weddingData as defaultData } from '../config/weddingData';
import { getDayOfWeek, getEventCalendar } from '../utils/weddingDate';

const WeddingDataContext = createContext();

function normalizeData(saved = {}) {
  const merged = {
    ...defaultData, ...saved,
    couple: {
      ...defaultData.couple, ...saved.couple,
      groom: { ...defaultData.couple.groom, ...saved.couple?.groom },
      bride: { ...defaultData.couple.bride, ...saved.couple?.bride },
    },
    audio: { ...defaultData.audio, ...saved.audio },
    invitation: { ...defaultData.invitation, ...saved.invitation },
    thankYouMessage: { ...defaultData.thankYouMessage, ...saved.thankYouMessage },
  };
  // Migrate only the old texture placeholders. Keep custom photos and all personal edits.
  const photos = {
    '/assets/sf-img-1.webp': '/assets/sf-img-14.webp',
    '/assets/sf-img-5.webp': '/assets/sf-img-2.webp',
    '/assets/sf-img-10.webp': '/assets/sf-img-3.webp',
    '/assets/sf-img-25.webp': '/assets/sf-img-24.webp',
  };
  const migratePlaceholders = saved.imageSettingsVersion !== 1;
  if (migratePlaceholders) {
    merged.couple.groom.avatar = photos[merged.couple.groom.avatar] || merged.couple.groom.avatar;
    merged.couple.bride.avatar = photos[merged.couple.bride.avatar] || merged.couple.bride.avatar;
    merged.couple.heroImage = merged.couple.heroImage === '/assets/sf-img-25.webp' ? '/assets/sf-img-0.webp' : merged.couple.heroImage;
  }
  merged.imageSettingsVersion = 1;
  merged.gallery = (Array.isArray(merged.gallery) ? merged.gallery : defaultData.gallery)
    .filter((photo) => photo && typeof photo.src === 'string')
    .map((photo) => ({ ...photo, src: migratePlaceholders ? photos[photo.src] || photo.src : photo.src }));
  merged.events = Array.isArray(merged.events) && merged.events.length ? merged.events : defaultData.events;
  merged.events = merged.events.map((event) => ({
    ...event, dayOfWeek: getDayOfWeek(event.solarDate), calendarEvent: getEventCalendar(event, merged.couple),
  }));
  return merged;
}

export function WeddingDataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('wedding_custom_data');
      if (saved) return normalizeData(JSON.parse(saved) || {});
    } catch { /* Blocked storage or old data should never prevent viewing the invitation. */ }
    return defaultData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Update specific fields or whole data
  const updateData = (newData) => {
    const normalized = normalizeData(newData);
    // Persist before updating so the editor can report quota/storage errors truthfully.
    localStorage.setItem('wedding_custom_data', JSON.stringify(normalized));
    setData(normalized);
  };

  // Reset to original default data
  const resetData = () => {
    try { localStorage.removeItem('wedding_custom_data'); } catch { /* Use defaults for this session. */ }
    setData(defaultData);
  };

  // Export as weddingData.js file for Vercel deployment
  const exportConfigFile = (draft = data) => {
    const exportedData = normalizeData(draft);
    const content = `/**
 * ==============================================================================
 * THIET LAP THONG TIN THIEP CUOI ONLINE
 * File nay duoc xuat tu dong tu Bang Quan Tri Admin.
 * ==============================================================================
 */

export const weddingData = ${JSON.stringify(exportedData, null, 2)};
`;
    const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'weddingData.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <WeddingDataContext.Provider
      value={{
        data,
        updateData,
        resetData,
        exportConfigFile,
        isAdminOpen,
        setIsAdminOpen,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
      }}
    >
      {children}
    </WeddingDataContext.Provider>
  );
}

export function useWeddingData() {
  const context = useContext(WeddingDataContext);
  if (!context) {
    throw new Error('useWeddingData must be used within a WeddingDataProvider');
  }
  return context;
}
