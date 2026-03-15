/**
 * HabitTracker – Plan / Subscription Types
 */

import type {PlanTier, ProFeatureKey} from '../constants/features';

export interface PlanInfo {
  tier: PlanTier;
  /** Display name shown on Pricing screen */
  displayName: string;
  /** Monthly price in USD decimal (0 for free) */
  priceMonthly: number;
  /** Annual price in USD decimal (0 for free) */
  priceAnnual: number | null;
  /** Features included in this plan */
  features: ProFeatureKey[];
  /** Whether this plan is currently highlighted / recommended */
  isRecommended: boolean;
}

export interface UserSubscription {
  tier: PlanTier;
  /** True if the user has an active paid subscription */
  isActive: boolean;
  /** ISO date when current period expires */
  expiresAt: string | null;
  /** Platform the subscription was purchased on */
  platform: 'ios' | 'android' | null;
  /** Store product ID */
  productId: string | null;
}

export interface PricingResponse {
  plans: PlanInfo[];
  currentSubscription: UserSubscription;
}
