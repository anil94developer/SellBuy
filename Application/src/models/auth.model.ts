/**
 * SellBuy Application - Authentication & User Models
 * Complete data contracts for customer login, OTP verification, registration,
 * and user session management across Android and iOS.
 */

export type UserRole = 'customer' | 'admin' | 'buyer' | 'seller' | 'both';
export type UserStatus = 'active' | 'blocked';

export interface User {
  id: string | number;
  name: string;
  phone: string;
  email?: string;
  role?: UserRole;
  avatar?: string;
  rating?: number;
  isVerified?: boolean;
  is_verified?: boolean | number;
  status?: UserStatus;
  listingsCount?: number;
  created_at?: string;
}

export interface SendOtpPayload {
  phone: string;
}

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  demoOtp?: string;
  expiresIn?: number;
  phone?: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface CompleteProfilePayload {
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface SocialLoginPayload {
  provider: 'google' | 'apple';
}

export interface SwitchUserPayload {
  userId: string | number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  demoOtp?: string;
  isNewUser?: boolean;
  user?: User;
  phone?: string;
  expiresIn?: number;
  isBlocked?: boolean;
  notFound?: boolean;
}

export interface UserStatusResponse {
  success: boolean;
  isBlocked: boolean;
  status?: string;
  message?: string;
  notFound?: boolean;
  isGuest?: boolean;
}

export const GUEST_USER: User = {
  id: '',
  name: 'Guest User',
  phone: '',
  email: '',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  rating: 5.0,
  isVerified: false,
  status: 'active',
  listingsCount: 0,
};

export const DEMO_USER: User = {
  id: '1',
  name: 'Rakesh Sharma',
  phone: '9876543210',
  email: 'rakesh.sharma@example.com',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  rating: 4.8,
  isVerified: true,
  status: 'active',
  listingsCount: 12,
};
