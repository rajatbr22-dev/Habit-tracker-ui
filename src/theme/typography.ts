/**
 * HabitTracker – Typography Scale
 *
 * Derived from reference screenshots:
 *   • Large titles  ≈ 28–32 px  bold
 *   • Section heads ≈ 20–22 px  semi‑bold
 *   • Body          ≈ 16 px     regular / medium
 *   • Caption       ≈ 12–13 px  regular
 *   • Overline      ≈ 11 px     medium  (section labels like "ACTIVE HABITS")
 *
 * We use the system font stack (San Francisco / Roboto) to stay native.
 * Import this object and spread into StyleSheet styles.
 */

import {Platform, TextStyle} from 'react-native';

// ──────────────────────────────────────────────
// Font families
// ──────────────────────────────────────────────

const FONT_FAMILY = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

const FONT_FAMILY_MEDIUM = Platform.select({
  ios: 'System',
  android: 'Roboto-Medium',
  default: 'System',
});

const FONT_FAMILY_BOLD = Platform.select({
  ios: 'System',
  android: 'Roboto-Bold',
  default: 'System',
});

// ──────────────────────────────────────────────
// Font weights  (centralised so we never use magic literals)
// ──────────────────────────────────────────────

export const FONT_WEIGHTS = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extraBold: '800' as TextStyle['fontWeight'],
} as const;

// ──────────────────────────────────────────────
// Typography presets
// ──────────────────────────────────────────────

export interface TypographyPreset {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing?: number;
}

export interface TypographyScale {
  /** 32px bold – splash title, onboarding hero */
  hero: TypographyPreset;
  /** 28px bold – screen titles ("My Habits", "Dashboard") */
  largeTitle: TypographyPreset;
  /** 22px semi‑bold – section headings */
  title1: TypographyPreset;
  /** 20px semi‑bold – card titles, modal headers */
  title2: TypographyPreset;
  /** 17px semi‑bold – habit names in list */
  title3: TypographyPreset;
  /** 16px regular – body copy */
  body: TypographyPreset;
  /** 16px medium – body emphasis */
  bodyMedium: TypographyPreset;
  /** 15px regular – secondary body */
  callout: TypographyPreset;
  /** 14px regular – supporting info */
  subhead: TypographyPreset;
  /** 14px medium – tab labels, buttons */
  subheadMedium: TypographyPreset;
  /** 13px regular – timestamps, metadata */
  footnote: TypographyPreset;
  /** 12px regular – captions, badges */
  caption1: TypographyPreset;
  /** 11px regular – smallest readable text */
  caption2: TypographyPreset;
  /** 11px medium uppercase – section headers ("ACTIVE HABITS") */
  overline: TypographyPreset;
  /** 16px bold – primary CTA buttons */
  button: TypographyPreset;
  /** 14px medium – secondary / small buttons */
  buttonSmall: TypographyPreset;
  /** 36px bold – large stat numbers */
  statLarge: TypographyPreset;
  /** 24px bold – medium stat numbers */
  statMedium: TypographyPreset;
}

export const TYPOGRAPHY: TypographyScale = {
  hero: {
    fontFamily: FONT_FAMILY_BOLD!,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: FONT_WEIGHTS.bold,
  },
  largeTitle: {
    fontFamily: FONT_FAMILY_BOLD!,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: FONT_WEIGHTS.bold,
  },
  title1: {
    fontFamily: FONT_FAMILY_BOLD!,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  title2: {
    fontFamily: FONT_FAMILY_BOLD!,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  title3: {
    fontFamily: FONT_FAMILY_MEDIUM!,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  body: {
    fontFamily: FONT_FAMILY!,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FONT_WEIGHTS.regular,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILY_MEDIUM!,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FONT_WEIGHTS.medium,
  },
  callout: {
    fontFamily: FONT_FAMILY!,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: FONT_WEIGHTS.regular,
  },
  subhead: {
    fontFamily: FONT_FAMILY!,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FONT_WEIGHTS.regular,
  },
  subheadMedium: {
    fontFamily: FONT_FAMILY_MEDIUM!,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FONT_WEIGHTS.medium,
  },
  footnote: {
    fontFamily: FONT_FAMILY!,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: FONT_WEIGHTS.regular,
  },
  caption1: {
    fontFamily: FONT_FAMILY!,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FONT_WEIGHTS.regular,
  },
  caption2: {
    fontFamily: FONT_FAMILY!,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: FONT_WEIGHTS.regular,
  },
  overline: {
    fontFamily: FONT_FAMILY_MEDIUM!,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 1.2,
  },
  button: {
    fontFamily: FONT_FAMILY_BOLD!,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: FONT_WEIGHTS.bold,
  },
  buttonSmall: {
    fontFamily: FONT_FAMILY_MEDIUM!,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: FONT_WEIGHTS.medium,
  },
  statLarge: {
    fontFamily: FONT_FAMILY_BOLD!,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: FONT_WEIGHTS.bold,
  },
  statMedium: {
    fontFamily: FONT_FAMILY_BOLD!,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: FONT_WEIGHTS.bold,
  },
} as const;
