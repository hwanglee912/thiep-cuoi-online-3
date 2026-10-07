import React, { createContext, useContext, useState, useEffect } from 'react';
import { weddingData as defaultData } from '../config/weddingData';

const WeddingDataContext = createContext();

export function WeddingDataProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('wedding_custom_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved wedding data', e);
      }
    }
    return defaultData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Update specific fields or whole data
  const updateData = (newData) => {
    setData(newData);
    localStorage.setItem('wedding_custom_data', JSON.stringify(newData));
  };

  // Reset to original default data
  const resetData = () => {
    localStorage.removeItem('wedding_custom_data');
    setData(defaultData);
  };

  // Export as weddingData.js file for Vercel deployment
  const exportConfigFile = () => {
    const content = `/**
 * ==============================================================================
 * THIET LAP THONG TIN THIEP CUOI ONLINE
 * File nay duoc xuat tu dong tu Bang Quan Tri Admin.
 * ==============================================================================
 */

export const weddingData = ${JSON.stringify(data, null, 2)};
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
