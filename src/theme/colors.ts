/**
 * HabitTracker – Color Palette
 *
 * Extracted from reference screenshots:
 *   • Primary / accent: #6C5CE7 (indigo‑purple CTA, splash icon, active states)
 *   • Primary tint:     #A29BFE (lighter variant seen in tab‑switch outline, loader)
 *   • Backgrounds:      #FFFFFF light / #121212 dark
 *   • Cards:            #FFFFFF light / #1E1E1E dark
 *   • Surface alt:      #F5F5F7 light / #2A2A2A dark  (input fields, filter pills)
 *   • Text:             #1A1A2E light / #F5F5F7 dark
 *   • Text muted:       #8E8E93 both modes
 *   • Borders:          #E5E5EA light / #3A3A3C dark
 *   • Success (check‑in): #34C759
 *   • Error:            #FF3B30
 *   • Warning / streak: #FF9500
 *   • Info:             #5AC8FA
 */

// ──────────────────────────────────────────────
// Brand / constant colors  (mode‑independent)
// ──────────────────────────────────────────────

export const BRAND_COLORS = {
  /** Main brand purple – CTA buttons, active tabs, icons */
  primary: '#6C5CE7',
  /** Lighter purple tint – outlines, loaders, secondary accents */
  primaryLight: '#A29BFE',
  /** Very light tint – subtle pill backgrounds, selection highlights */
  primaryUltraLight: '#E8E4FF',
  /** Darkened primary for pressed states */
  primaryDark: '#5A4BD1',
} as const;

export const SEMANTIC_COLORS = {
  success: '#34C759',
  successLight: '#D4F5DD',
  error: '#FF3B30',
  errorLight: '#FFE5E5',
  warning: '#FF9500',
  warningLight: '#FFF3E0',
  info: '#5AC8FA',
  infoLight: '#E0F4FF',
} as const;

export const HABIT_PALETTE = [
  '#6C5CE7', // purple
  '#00B894', // green
  '#0984E3', // blue
  '#E17055', // coral
  '#FDCB6E', // yellow
  '#E84393', // pink
  '#00CEC9', // teal
  '#636E72', // gray
] as const;

// ──────────────────────────────────────────────
// Mode‑dependent palette
// ──────────────────────────────────────────────

export interface ColorPalette {
  /** App background */
  background: string;
  /** Card / modal / bottom‑sheet surface */
  card: string;
  /** Slightly elevated surface – inputs, filter chips */
  surfaceAlt: string;
  /** Primary text */
  text: string;
  /** Secondary / muted text */
  textSecondary: string;
  /** Tertiary / hint text */
  textTertiary: string;
  /** Hairline borders & dividers */
  border: string;
  /** Thicker / stronger border (active input) */
  borderStrong: string;
  /** Overlay for modals & drawers */
  overlay: string;

  // Forwarded constants for convenience
  primary: string;
  primaryLight: string;
  primaryUltraLight: string;
  primaryDark: string;

  success: string;
  successLight: string;
  error: string;
  errorLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;

  /** Pure white – icons on dark fills, etc. */
  white: string;
  /** Pure black */
  black: string;

  /** Skeleton / shimmer base */
  skeleton: string;
  /** Skeleton highlight */
  skeletonHighlight: string;

  /** iOS‑style system grouped background */
  groupedBackground: string;

  /** Tab‑bar background */
  tabBar: string;
  /** Tab‑bar active icon tint */
  tabBarActive: string;
  /** Tab‑bar inactive icon tint */
  tabBarInactive: string;

  /** Social‑login button backgrounds */
  socialButton: string;
  /** Social‑login button border */
  socialButtonBorder: string;

  /** Heatmap empty cell */
  heatmapEmpty: string;
}

// ────────── LIGHT ──────────

export const LIGHT_COLORS: ColorPalette = {
  background: '#FFFFFF',
  card: '#FFFFFF',
  surfaceAlt: '#F5F5F7',
  text: '#1A1A2E',
  textSecondary: '#8E8E93',
  textTertiary: '#AEAEB2',
  border: '#E5E5EA',
  borderStrong: '#C7C7CC',
  overlay: 'rgba(0, 0, 0, 0.45)',

  ...BRAND_COLORS,
  ...SEMANTIC_COLORS,

  white: '#FFFFFF',
  black: '#000000',

  skeleton: '#E5E5EA',
  skeletonHighlight: '#F5F5F7',

  groupedBackground: '#F2F2F7',

  tabBar: '#FFFFFF',
  tabBarActive: BRAND_COLORS.primary,
  tabBarInactive: '#8E8E93',

  socialButton: '#FFFFFF',
  socialButtonBorder: '#E5E5EA',

  heatmapEmpty: '#F0F0F0',
};

// ────────── DARK ──────────

export const DARK_COLORS: ColorPalette = {
  background: '#121212',
  card: '#1E1E1E',
  surfaceAlt: '#2A2A2A',
  text: '#F5F5F7',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  border: '#3A3A3C',
  borderStrong: '#48484A',
  overlay: 'rgba(0, 0, 0, 0.65)',

  ...BRAND_COLORS,
  ...SEMANTIC_COLORS,

  white: '#FFFFFF',
  black: '#000000',

  skeleton: '#3A3A3C',
  skeletonHighlight: '#48484A',

  groupedBackground: '#1C1C1E',

  tabBar: '#1C1C1E',
  tabBarActive: BRAND_COLORS.primaryLight,
  tabBarInactive: '#636366',

  socialButton: '#2A2A2A',
  socialButtonBorder: '#3A3A3C',

  heatmapEmpty: '#2A2A2A',
};
