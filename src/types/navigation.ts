/**
 * HabitTracker – Navigation Types
 *
 * Centralised param lists for React Navigation type‑safety.
 */

import type {NavigatorScreenParams} from '@react-navigation/native';

// ──────────────────────────────────────────────
// Stack param lists
// ──────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: undefined;
  HabitDetail: {habitId: string};
  AddHabit: undefined;
  Paywall: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Habits: undefined;
  DailyTracker: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<MainTabParamList>;
  HabitDetail: {habitId: string};
  AddHabit: undefined;
  EditHabit: {habitId: string};
  Pricing: undefined;
  Profile: undefined;
  Notifications: undefined;
  About: undefined;
};
