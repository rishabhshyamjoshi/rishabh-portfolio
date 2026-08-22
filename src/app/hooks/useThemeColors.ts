import { useState, useEffect } from 'react';
import { AudioController } from '../utils/AudioController';

export type ThemeName = 'blue' | 'orange' | 'silver';

export const THEMES = {
  blue: {
    primary: '#00f0ff',
    secondary: '#88aacc',
    dark: '#224466',
    glass: '#050a14',
    rgb: '0, 240, 255'
  },
  orange: {
    primary: '#ffaa44',
    secondary: '#ff7800',
    dark: '#884400',
    glass: '#140a05',
    rgb: '255, 120, 0'
  },
  silver: {
    primary: '#ffffff',
    secondary: '#cccccc',
    dark: '#555555',
    glass: '#0a0a0a',
    rgb: '200, 200, 200'
  }
};

export function useThemeColors() {
  const [themeName, setThemeName] = useState<ThemeName>('blue');

  useEffect(() => {
    // Initial load
    const audio = AudioController.getInstance();
    
    const updateTheme = (trackIndex: number) => {
      if (trackIndex === 1) setThemeName('orange');
      else if (trackIndex === 2) setThemeName('silver');
      else setThemeName('blue');
    };
    
    updateTheme(audio.currentTrackIndex || 0);

    const handleTrackChange = (e: any) => {
      updateTheme(e.detail);
    };

    window.addEventListener('audioTrackChanged', handleTrackChange);
    return () => window.removeEventListener('audioTrackChanged', handleTrackChange);
  }, []);

  return THEMES[themeName];
}
