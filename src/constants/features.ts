/**
 * HabitTracker – Pro Feature Keys
 *
 * Used by useProFeature hook + PaywallGate to determine gating.
 */

export const PRO_FEATURES = {
  UNLIMITED_HABITS: 'unlimited_habits',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  CUSTOM_REMINDERS: 'custom_reminders',
  EXPORT_DATA: 'export_data',
  CONTRIBUTION_HEATMAP: 'contribution_heatmap',
  PRIORITY_SUPPORT: 'priority_support',
  HABIT_TEMPLATES: 'habit_templates',
  DETAILED_STATS: 'detailed_stats',
} as const;

export type ProFeatureKey = (typeof PRO_FEATURES)[keyof typeof PRO_FEATURES];

/** Maximum habits allowed on the free plan */
export const FREE_PLAN_HABIT_LIMIT = 5;

/** Plan tiers */
export const PLAN_TIERS = {
  FREE: 'free',
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
  LIFETIME: 'lifetime',
} as const;

export type PlanTier = (typeof PLAN_TIERS)[keyof typeof PLAN_TIERS];
