import { useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme() || 'light');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme || 'light');
    });
    return () => subscription.remove();
  }, []);

  // 'light' эсвэл 'dark' theme-ийг буцаана.
  return colorScheme;
}