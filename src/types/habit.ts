/**
 * HabitTracker – Habit Types
 */

import type {FrequencyType, HabitCategory, HabitStatus, DayOfWeek, HeatmapLevel} from '../constants/habits';

// ──────────────────────────────────────────────
// Core habit model
// ──────────────────────────────────────────────

export interface Habit {
  id: string;
  userId: string;
  name: string;
  /** Optional icon name (e.g. from a bundled icon set) */
  icon: string | null;
  /** Hex colour from HABIT_PALETTE */
  color: string;
  category: HabitCategory;
  frequency: FrequencyType;
  /** Target count per period (e.g. 4x/week) */
  targetCount: number;
  /** Custom days when frequency === 'custom' */
  customDays: DayOfWeek[];
  /** Goal description shown on detail, e.g. "10 mins", "2.5L" */
  goalLabel: string | null;
  /** Goal numeric value for progress calculation */
  goalValue: number | null;
  /** Unit string: "mins", "pages", "L", etc. */
  goalUnit: string | null;
  status: HabitStatus;
  /** Notification reminder time (ISO time string, e.g. "07:30") */
  reminderTime: string | null;
  /** Position in list for manual sort */
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Check-in (daily completion record)
// ──────────────────────────────────────────────

export interface CheckIn {
  id: string;
  habitId: string;
  /** ISO date string (YYYY‑MM‑DD) */
  date: string;
  /** true = completed; false = skipped / unchecked */
  completed: boolean;
  /** Optional numeric value for measurable habits */
  value: number | null;
  /** Optional note */
  note: string | null;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Streak / stats
// ──────────────────────────────────────────────

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  /** Completion rate 0–1 */
  completionRate: number;
}

export interface DailyProgress {
  /** ISO date string */
  date: string;
  totalHabits: number;
  completedHabits: number;
  /** 0–1 */
  completionRate: number;
}

// ──────────────────────────────────────────────
// Heatmap data
// ──────────────────────────────────────────────

export interface HeatmapCell {
  /** ISO date string */
  date: string;
  level: HeatmapLevel;
  count: number;
}

export type HeatmapData = HeatmapCell[];

// ──────────────────────────────────────────────
// Recent activity
// ──────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  habitId: string;
  habitName: string;
  habitColor: string;
  type: 'check_in' | 'streak_milestone' | 'habit_created';
  /** ISO date‑time string */
  timestamp: string;
  /** Human‑readable description */
  description: string;
}

// ──────────────────────────────────────────────
// Form payload (Add / Edit)
// ──────────────────────────────────────────────

export interface HabitFormValues {
  name: string;
  icon: string | null;
  color: string;
  category: HabitCategory;
  frequency: FrequencyType;
  targetCount: number;
  customDays: DayOfWeek[];
  goalLabel: string | null;
  goalValue: number | null;
  goalUnit: string | null;
  reminderTime: string | null;
}

// ──────────────────────────────────────────────
// API request / response shapes
// ──────────────────────────────────────────────

export interface CreateHabitPayload extends HabitFormValues {}

export interface UpdateHabitPayload extends Partial<HabitFormValues> {
  id: string;
}

export interface CheckInPayload {
  habitId: string;
  date: string;
  completed: boolean;
  value?: number | null;
  note?: string | null;
}

export interface HabitListResponse {
  habits: Habit[];
  totalCount: number;
}

export interface HabitDetailResponse {
  habit: Habit;
  streak: HabitStreak;
  heatmap: HeatmapData;
  recentActivity: ActivityItem[];
}
