import { apiClient, ApiError, setCurrentUserHeaderId } from './apiClient';
import {
  User,
  AuthResponse,
  CompleteProfilePayload,
  UserStatusResponse,
  DEMO_USER,
} from '../models/auth.model';

export { AuthResponse, User, UserStatusResponse };

/**
 * Clean phone number to strictly 10 digits
 */
function normalizePhone(phone: string): string {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/**
 * Normalize user object from backend to frontend interface
 */
export function normalizeUser(raw: any): User {
  if (!raw) return DEMO_USER;
  return {
    id: String(raw.id || '1'),
    name: raw.name || 'User',
    phone: raw.phone || '',
    email: raw.email || '',
    role: raw.role || 'customer',
    avatar:
      raw.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    rating: raw.rating ? Number(raw.rating) : 5.0,
    isVerified: raw.is_verified === 1 || raw.is_verified === true || raw.isVerified === true,
    is_verified: raw.is_verified,
    status: raw.status || 'active',
    listingsCount: raw.listingsCount || 0,
    created_at: raw.created_at,
  };
}

export const authService = {
  /**
   * Request 6-digit OTP for phone number
   */
  async sendOtp(phone: string): Promise<AuthResponse> {
    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone || cleanPhone.length < 10) {
      return {
        success: false,
        message: 'Please enter a valid 10-digit mobile number',
      };
    }

    try {
      const res = await apiClient.post<AuthResponse>('/api/auth/send-otp', {
        phone: cleanPhone,
      });
      return {
        ...res,
        phone: cleanPhone,
      };
    } catch (err: any) {
      console.warn('[authService.sendOtp] Fallback activated:', err.message);
      return {
        success: true,
        phone: cleanPhone,
        message: `OTP sent successfully to +91 ${cleanPhone}`,
        demoOtp: '123456',
        expiresIn: 60,
      };
    }
  },

  /**
   * Verify entered 6-digit OTP code
   */
  async verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
    const cleanPhone = normalizePhone(phone);
    const cleanOtp = String(otp || '').trim();

    try {
      const res = await apiClient.post<AuthResponse>('/api/auth/verify-otp', {
        phone: cleanPhone,
        otp: cleanOtp,
      });

      if (res.user) {
        const user = normalizeUser(res.user);
        setCurrentUserHeaderId(String(user.id));
        return {
          ...res,
          user,
        };
      }

      return res;
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 403 || err.data?.isBlocked) {
          return {
            success: false,
            isBlocked: true,
            message: err.data?.message || 'Your account has been suspended by administrator.',
          };
        }
        if (err.status === 400) {
          return {
            success: false,
            message: err.data?.message || 'Invalid OTP code. Please enter 123456.',
          };
        }
      }

      // Offline / demo fallback
      if (cleanOtp === '123456' || cleanOtp === '000000') {
        const isDemoRakesh = cleanPhone === '9876543210';
        if (isDemoRakesh) {
          setCurrentUserHeaderId('1');
          return {
            success: true,
            isNewUser: false,
            user: DEMO_USER,
            message: 'Login successful (Demo Mode)',
          };
        } else {
          return {
            success: true,
            isNewUser: true,
            phone: cleanPhone,
            message: 'OTP verified. Please complete your profile.',
          };
        }
      }

      return {
        success: false,
        message: 'Invalid OTP code. Please enter 123456.',
      };
    }
  },

  /**
   * Complete new user registration or update profile in database
   */
  async completeProfile(data: CompleteProfilePayload): Promise<AuthResponse> {
    const cleanPhone = normalizePhone(data.phone);

    try {
      const res = await apiClient.post<AuthResponse>('/api/auth/complete-profile', {
        phone: cleanPhone,
        name: data.name.trim(),
        email: data.email?.trim() || null,
        avatar: data.avatar || DEMO_USER.avatar,
      });

      if (res.user) {
        const user = normalizeUser(res.user);
        setCurrentUserHeaderId(String(user.id));
        return {
          ...res,
          user,
        };
      }

      return res;
    } catch (err: any) {
      console.warn('[authService.completeProfile] Fallback activated:', err.message);
      const fallbackUser: User = {
        id: String(Date.now()).slice(-4),
        name: data.name.trim(),
        phone: cleanPhone,
        email: data.email?.trim() || '',
        avatar: data.avatar || DEMO_USER.avatar,
        role: 'customer',
        rating: 5.0,
        isVerified: true,
        status: 'active',
        listingsCount: 0,
      };
      setCurrentUserHeaderId(fallbackUser.id as string);
      return {
        success: true,
        message: 'Profile created successfully',
        user: fallbackUser,
      };
    }
  },

  /**
   * One-click Social Sign-in (Google / Apple)
   */
  async socialLogin(provider: 'google' | 'apple'): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>('/api/auth/social-login', {
        provider,
      });

      if (res.user) {
        const user = normalizeUser(res.user);
        setCurrentUserHeaderId(String(user.id));
        return {
          ...res,
          user,
        };
      }
      return res;
    } catch (err: any) {
      console.warn('[authService.socialLogin] Fallback activated:', err.message);
      const isApple = provider === 'apple';
      const user: User = {
        id: isApple ? '102' : '101',
        name: isApple ? 'Apple User' : 'Google User',
        phone: isApple ? '9870001122' : '9870003344',
        email: `${provider}_user@sellbuy.in`,
        role: 'customer',
        rating: 4.9,
        isVerified: true,
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        listingsCount: 0,
      };
      setCurrentUserHeaderId(String(user.id));
      return {
        success: true,
        message: `Signed in with ${provider.toUpperCase()}`,
        user,
      };
    }
  },

  /**
   * Switch active user session (for multi-profile demo)
   */
  async switchUser(userId: string | number): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>('/api/auth/switch-user', {
        userId,
      });
      if (res.user) {
        const user = normalizeUser(res.user);
        setCurrentUserHeaderId(String(user.id));
        return { ...res, user };
      }
      return res;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Fetch all registered users
   */
  async getUsers(): Promise<{ success: boolean; users: User[] }> {
    try {
      const res = await apiClient.get<{ success: boolean; users: any[] }>('/api/auth/users');
      return {
        success: true,
        users: (res.users || []).map(normalizeUser),
      };
    } catch {
      return {
        success: true,
        users: [DEMO_USER],
      };
    }
  },

  /**
   * Check real-time user account status (e.g. if blocked by admin)
   */
  async checkUserStatus(userId: string | number): Promise<UserStatusResponse> {
    if (!userId || userId === '0' || userId === '') {
      return { success: true, isBlocked: false, isGuest: true };
    }

    try {
      const res = await apiClient.get<UserStatusResponse>(`/api/auth/status/${userId}`);
      return {
        success: true,
        isBlocked: res.isBlocked === true || res.status === 'blocked',
        status: res.status,
        message: res.message,
        notFound: res.notFound,
      };
    } catch (err: any) {
      if (err instanceof ApiError && (err.status === 403 || err.data?.isBlocked)) {
        return {
          success: false,
          isBlocked: true,
          message: err.data?.message || 'Your account is blocked by administrator.',
        };
      }
      return { success: false, isBlocked: false };
    }
  },

  /**
   * Client-side logout
   */
  logout(): void {
    setCurrentUserHeaderId(null);
  },
};
