/**
 * HabitTracker – Generic API Types
 */

// ──────────────────────────────────────────────
// Envelope wrappers
// ──────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ──────────────────────────────────────────────
// Pagination
// ──────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// ──────────────────────────────────────────────
// Offline sync
// ──────────────────────────────────────────────

export type SyncAction = 'create' | 'update' | 'delete';

export interface PendingSyncRecord {
  id: string;
  /** The entity table this belongs to */
  entity: 'habit' | 'check_in';
  /** The entity ID being synced */
  entityId: string;
  action: SyncAction;
  /** JSON‑stringified payload */
  payload: string;
  /** Number of failed attempts */
  retryCount: number;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Analytics
// ──────────────────────────────────────────────

export interface AnalyticsSummary {
  totalHabits: number;
  activeHabits: number;
  averageCompletionRate: number;
  currentOverallStreak: number;
  longestOverallStreak: number;
  totalCheckIns: number;
}

export interface PerHabitAnalytics {
  habitId: string;
  habitName: string;
  habitColor: string;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

export interface WeeklyOverview {
  /** ISO date of Monday */
  weekStart: string;
  /** Per‑day completion rates  (Mon–Sun, 0–1) */
  dailyRates: [number, number, number, number, number, number, number];
  overallRate: number;
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary;
  perHabit: PerHabitAnalytics[];
  weeklyOverview: WeeklyOverview;
}
