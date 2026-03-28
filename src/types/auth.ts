/**
 * HabitTracker – Auth Types
 */

import z from "zod";
import { loginSchema, registerSchema, forgotPasswordSchema } from "../schema/auth.scehma";

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface SocialLoginPayload {
  provider: 'google' | 'apple';
  idToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}


export type AuthStore = {
  user: any;
  token: string | null;
  setAuth: (data: { user: any; token: string }) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
};


export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
