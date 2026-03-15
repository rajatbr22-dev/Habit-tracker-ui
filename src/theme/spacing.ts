/**
 * HabitTracker – Spacing & Layout Tokens
 *
 * 4‑point grid aligned, derived from reference screenshots.
 */

// ──────────────────────────────────────────────
// Base spacing scale  (4‑point system)
// ──────────────────────────────────────────────

export const SPACING = {
  /** 2px – hairline gaps */
  xxs: 2,
  /** 4px – micro spacing */
  xs: 4,
  /** 8px – tight spacing (icon‑label gap) */
  sm: 8,
  /** 12px – compact spacing */
  md: 12,
  /** 16px – standard padding */
  lg: 16,
  /** 20px – relaxed padding */
  xl: 20,
  /** 24px – section padding */
  '2xl': 24,
  /** 32px – large section gaps */
  '3xl': 32,
  /** 40px – screen‑level vertical spacing */
  '4xl': 40,
  /** 48px – hero spacing */
  '5xl': 48,
  /** 64px – extra‑large spacing */
  '6xl': 64,
} as const;

export type SpacingKey = keyof typeof SPACING;

// ──────────────────────────────────────────────
// Border radii
// ──────────────────────────────────────────────

export const RADII = {
  /** 0px – no rounding */
  none: 0,
  /** 4px – subtle rounding (tags, badges) */
  xs: 4,
  /** 8px – small cards, inputs */
  sm: 8,
  /** 12px – standard cards */
  md: 12,
  /** 16px – modals, larger cards */
  lg: 16,
  /** 20px – bottom sheets */
  xl: 20,
  /** 24px – pill buttons, filter chips */
  pill: 24,
  /** 9999px – fully circular (avatars, FAB) */
  full: 9999,
} as const;

// ──────────────────────────────────────────────
// Shadows (iOS + Android)
// ──────────────────────────────────────────────

import {Platform, ViewStyle} from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const shadow = (
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number,
): ShadowStyle => ({
  ...Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: offsetY},
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
  }),
});

export const SHADOWS = {
  /** No shadow */
  none: shadow(0, 0, 0, 0),
  /** Subtle lift – cards at rest */
  sm: shadow(1, 3, 0.08, 2),
  /** Default card elevation */
  md: shadow(2, 6, 0.1, 4),
  /** Focused / hovered card */
  lg: shadow(4, 12, 0.12, 8),
  /** FAB / floating elements */
  xl: shadow(8, 20, 0.16, 12),
} as const;

// ──────────────────────────────────────────────
// Layout constants
// ──────────────────────────────────────────────

export const LAYOUT = {
  /** Horizontal screen padding */
  screenPaddingHorizontal: SPACING.lg,
  /** Vertical safe‑area extra padding */
  screenPaddingTop: SPACING.md,
  /** Min touch‑target size (a11y) */
  minTouchTarget: 44,
  /** Standard card padding */
  cardPadding: SPACING.lg,
  /** Standard card gap */
  cardGap: SPACING.md,
  /** Tab bar height */
  tabBarHeight: 56,
  /** Header height */
  headerHeight: 56,
  /** Bottom sheet handle width */
  bottomSheetHandleWidth: 36,
  /** Bottom sheet handle height */
  bottomSheetHandleHeight: 4,
  /** Heatmap cell size */
  heatmapCellSize: 12,
  /** Heatmap cell gap */
  heatmapCellGap: 2,
  /** Progress ring stroke width */
  progressRingStroke: 8,
  /** Large progress ring stroke width */
  progressRingStrokeLarge: 10,
} as const;
