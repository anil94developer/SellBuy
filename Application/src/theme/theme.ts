export const colors = {
  primary: '#2563EB',       // Vibrant Royal Blue
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  primaryMuted: '#DBEAFE',
  background: '#F8FAFC',    // Soft Slate
  surface: '#FFFFFF',
  card: '#FFFFFF',
  darkBg: '#090D16',        // Deep Dark Theme (Splash & Dark accents)
  darkCard: '#131A2A',
  darkBorder: '#1E293B',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  surfaceSecondary: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  badgeBg: '#F1F5F9',
};

export const typography = {
  fontFamily: undefined, // Uses native system font (Roboto on Android, San Francisco on iOS)
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    title: 28,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
};
