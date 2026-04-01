import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { preferencesRepository } from '../data/repositories/preferencesRepository';
import { darkColors, lightColors, type ThemeColors } from './colors';

export type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const THEME_MODE_KEY = 'appearance.themeMode';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const defaultMode: ThemeMode = systemColorScheme === 'dark' ? 'dark' : 'light';
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultMode);

  useEffect(() => {
    let isMounted = true;

    const loadThemePreference = async () => {
      try {
        const storedValue = await preferencesRepository.get(THEME_MODE_KEY);
        if (!isMounted) {
          return;
        }

        if (storedValue === 'light' || storedValue === 'dark') {
          setThemeModeState(storedValue);
        }
      } catch {
        if (isMounted) {
          setThemeModeState(defaultMode);
        }
      }
    };

    loadThemePreference();

    return () => {
      isMounted = false;
    };
  }, [defaultMode]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await preferencesRepository.set(THEME_MODE_KEY, mode);
    } catch {
      // Keep the in-memory selection even if persistence fails.
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    await setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  }, [setThemeMode, themeMode]);

  const isDark = themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      colors,
      isDark,
      themeMode,
      setThemeMode,
      toggleTheme,
    }),
    [colors, isDark, setThemeMode, themeMode, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }

  return context;
};

export const useThemedStyles = <T,>(
  factory: (colors: ThemeColors) => T,
): T => {
  const { colors } = useAppTheme();
  return useMemo(() => factory(colors), [colors, factory]);
};
