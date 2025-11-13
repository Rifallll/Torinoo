"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface SettingsContextType {
  isTomTomLayerEnabled: boolean;
  toggleTomTomLayer: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or default to true
  const [isTomTomLayerEnabled, setIsTomTomLayerEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isTomTomLayerEnabled');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isTomTomLayerEnabled', JSON.stringify(isTomTomLayerEnabled));
    }
  }, [isTomTomLayerEnabled]);

  const toggleTomTomLayer = useCallback(() => {
    setIsTomTomLayerEnabled(prev => {
      const newState = !prev;
      toast.info(`Lapisan lalu lintas TomTom ${newState ? 'diaktifkan' : 'dinonaktifkan'}.`);
      return newState;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ isTomTomLayerEnabled, toggleTomTomLayer }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};