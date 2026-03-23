/**
 * HabitTracker – Habit Constants
 *
 * Frequency types, categories, icons, and filter labels.
 */

export const FREQUENCY_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  CUSTOM: 'custom',
} as const;

export type FrequencyType = (typeof FREQUENCY_TYPES)[keyof typeof FREQUENCY_TYPES];

export const HABIT_CATEGORIES = {
  HEALTH: 'health',
  PRODUCTIVITY: 'productivity',
  FITNESS: 'fitness',
  MINDFULNESS: 'mindfulness',
  FINANCIAL: 'financial',
  SOCIAL: 'social',
  OTHER: 'other',
} as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[keyof typeof HABIT_CATEGORIES];

/** Display labels for each category (used in filter chips) */
export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: 'Health',
  productivity: 'Productivity',
  fitness: 'Fitness',
  mindfulness: 'Mindfulness',
  financial: 'Financial',
  social: 'Social',
  other: 'Other',
};

export const HABIT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

export type HabitStatus = (typeof HABIT_STATUS)[keyof typeof HABIT_STATUS];

/** Default category filter pills shown on Habit List screen */
export const DEFAULT_FILTER_CATEGORIES: HabitCategory[] = [
  'health',
  'productivity',
  'financial'
];

/** Days of week (for custom frequency picker) */
export const DAYS_OF_WEEK = [
  {key: 'mon', label: 'Mon', short: 'M'},
  {key: 'tue', label: 'Tue', short: 'T'},
  {key: 'wed', label: 'Wed', short: 'W'},
  {key: 'thu', label: 'Thu', short: 'T'},
  {key: 'fri', label: 'Fri', short: 'F'},
  {key: 'sat', label: 'Sat', short: 'S'},
  {key: 'sun', label: 'Sun', short: 'S'},
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number]['key'];

/** Heatmap intensity levels (0 = none, 4 = max) */
export const HEATMAP_LEVELS = [0, 1, 2, 3, 4] as const;
export type HeatmapLevel = (typeof HEATMAP_LEVELS)[number];



export const ICONS = ['🧘', '💧', '🏋️', '📖', '⚙️', '🌙', '☕'];

export const EMOJI_CATEGORIES = [
  {name: 'Mindfulness', emojis: ['🧘', '🧘‍♀️', '🧘‍♂️', '🕯️', '✨', '☁️', '🌊']},
  {name: 'Health', emojis: ['💧', '🍎', '🥦', '💊', '🥗', '🥑', '🍋']},
  {name: 'Fitness', emojis: ['🏋️', '🏃', '🚴', '🏊', '🥊', '⚽', '🏀']},
  {name: 'Productivity', emojis: ['📖', '✍️', '💻', '💡', '📅', '🎯', '⌛']},
  {name: 'Growth', emojis: ['⚙️', '📈', '🌱', '🚀', '🧠', '🛠️', '🧱']},
  {name: 'Leisure', emojis: ['🌙', '☕', '🍵', '🎨', '🎸', '🎮', '📸']},
];
