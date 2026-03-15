/**
 * HabitTracker – Route Constants
 *
 * Single source of truth for every navigation route.
 * Never use magic strings for navigation — import from here.
 */

/** Root‑level navigator stacks */
export const ROOT_ROUTES = {
  AUTH: 'Auth',
  MAIN: 'Main',
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
} as const;

/** Auth stack screens */
export const AUTH_ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
} as const;

/** Main bottom‑tab routes */
export const TAB_ROUTES = {
  DASHBOARD: 'Dashboard',
  HABITS: 'Habits',
  DAILY_TRACKER: 'DailyTracker',
  ANALYTICS: 'Analytics',
  SETTINGS: 'Settings',
} as const;

/** Stack screens pushed on top of tabs */
export const STACK_ROUTES = {
  HABIT_DETAIL: 'HabitDetail',
  ADD_HABIT: 'AddHabit',
  EDIT_HABIT: 'EditHabit',
  PRICING: 'Pricing',
  PROFILE: 'Profile',
  NOTIFICATIONS: 'Notifications',
  ABOUT: 'About',
} as const;

/** Union helpers for type‑safe navigation params */
export type RootRouteName = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];
export type AuthRouteName = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type TabRouteName = (typeof TAB_ROUTES)[keyof typeof TAB_ROUTES];
export type StackRouteName = (typeof STACK_ROUTES)[keyof typeof STACK_ROUTES];
