/**
 * HabitTracker – Theme Provider & useTheme hook
 *
 * • Reads system color‑scheme via `useColorScheme()`
 * • Falls back to user preference stored in useUIStore
 * • Provides merged theme object to the entire tree
 */

import React, {createContext, useContext, useMemo} from 'react';
import {useColorScheme} from 'react-native';

import {
  LIGHT_COLORS,
  DARK_COLORS,
  BRAND_COLORS,
  SEMANTIC_COLORS,
  HABIT_PALETTE,
} from './colors';
import type {ColorPalette} from './colors';
import {TYPOGRAPHY} from './typography';
import type {TypographyScale} from './typography';
import {SPACING, RADII, SHADOWS, LAYOUT} from './spacing';

// ──────────────────────────────────────────────
// Theme type
// ──────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: 'light' | 'dark';
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: typeof SPACING;
  radii: typeof RADII;
  shadows: typeof SHADOWS;
  layout: typeof LAYOUT;
  brandColors: typeof BRAND_COLORS;
  semanticColors: typeof SEMANTIC_COLORS;
  habitPalette: typeof HABIT_PALETTE;
  isDark: boolean;
}

// ──────────────────────────────────────────────
// Build helpers
// ──────────────────────────────────────────────

const buildTheme = (mode: 'light' | 'dark'): Theme => ({
  mode,
  colors: mode === 'dark' ? DARK_COLORS : LIGHT_COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radii: RADII,
  shadows: SHADOWS,
  layout: LAYOUT,
  brandColors: BRAND_COLORS,
  semanticColors: SEMANTIC_COLORS,
  habitPalette: HABIT_PALETTE,
  isDark: mode === 'dark',
});

const lightTheme = buildTheme('light');
const darkTheme = buildTheme('dark');

// ──────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────

const ThemeContext = createContext<Theme>(lightTheme);

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────

interface ThemeProviderProps {
  /** Override persisted in useUIStore.  'system' defers to OS. */
  themeMode?: ThemeMode;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  themeMode = 'system',
  children,
}) => {
  const systemScheme = useColorScheme();

  const theme = useMemo<Theme>(() => {
    if (themeMode === 'system') {
      return systemScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, systemScheme]);

  return React.createElement(ThemeContext.Provider, {value: theme}, children);
};

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

/**
 * Access the current theme anywhere in the component tree.
 *
 * ```tsx
 * const { colors, typography, spacing, isDark } = useTheme();
 * ```
 */
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return theme;
};

// ──────────────────────────────────────────────
// Re‑exports for convenience
// ──────────────────────────────────────────────

export {LIGHT_COLORS, DARK_COLORS, BRAND_COLORS, SEMANTIC_COLORS, HABIT_PALETTE} from './colors';
export type {ColorPalette} from './colors';
export {TYPOGRAPHY, FONT_WEIGHTS} from './typography';
export type {TypographyScale, TypographyPreset} from './typography';
export {SPACING, RADII, SHADOWS, LAYOUT} from './spacing';
export type {SpacingKey} from './spacing';
