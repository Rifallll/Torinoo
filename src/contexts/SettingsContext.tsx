"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface SettingsContextType {
  isTomTomLayerEnabled: boolean;
  toggleTomTomLayer: () => void;
  isWeatherFeatureEnabled: boolean;
  toggleWeatherFeature: () => void;
  isAirQualityFeatureEnabled: boolean; // New: State for air quality feature
  toggleAirQualityFeature: () => void; // New: Toggle function for air quality feature
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

  const [isWeatherFeatureEnabled, setIsWeatherFeatureEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isWeatherFeatureEnabled');
      return saved ? JSON.parse(saved) : true; // Default to true
    }
    return true;
  });

  const [isAirQualityFeatureEnabled, setIsAirQualityFeatureEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isAirQualityFeatureEnabled');
      return saved ? JSON.parse(saved) : true; // Default to true
    }
    return true;
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isTomTomLayerEnabled', JSON.stringify(isTomTomLayerEnabled));
    }
  }, [isTomTomLayerEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isWeatherFeatureEnabled', JSON.stringify(isWeatherFeatureEnabled));
    }
  }, [isWeatherFeatureEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAirQualityFeatureEnabled', JSON.stringify(isAirQualityFeatureEnabled));
    }
  }, [isAirQualityFeatureEnabled]);

  const toggleTomTomLayer = useCallback(() => {
    setIsTomTomLayerEnabled(prev => {
      const newState = !prev;
      toast.info(`TomTom traffic layer ${newState ? 'enabled' : 'disabled'}.`);
      return newState;
    });
  }, []);

  const toggleWeatherFeature = useCallback(() => {
    setIsWeatherFeatureEnabled(prev => {
      const newState = !prev;
      toast.info(`Weather feature ${newState ? 'enabled' : 'disabled'}.`);
      return newState;
    });
  }, []);

  const toggleAirQualityFeature = useCallback(() => {
    setIsAirQualityFeatureEnabled(prev => {
      const newState = !prev;
      toast.info(`Air quality feature ${newState ? 'enabled' : 'disabled'}.`);
      return newState;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ 
      isTomTomLayerEnabled, 
      toggleTomTomLayer, 
      isWeatherFeatureEnabled, 
      toggleWeatherFeature,
      isAirQualityFeatureEnabled,
      toggleAirQualityFeature
    }}>
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