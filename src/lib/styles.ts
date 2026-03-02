// Flat Design System Tokens

export const colors = {
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray500: '#6B7280',
  gray700: '#374151',
  gray900: '#111827',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  emerald500: '#10B981',
  emerald600: '#059669',
  amber500: '#F59E0B',
  amber600: '#D97706',
  red500: '#EF4444',
  red600: '#DC2626',
} as const;

// Category-specific colors: bold bg for cards, light bg for accents
export const categoryColors = {
  app_dev: { bg: '#3B82F6', lightBg: '#EFF6FF', text: '#FFFFFF', darkText: '#1E40AF' },
  tiktok: { bg: '#10B981', lightBg: '#ECFDF5', text: '#FFFFFF', darkText: '#065F46' },
  growth: { bg: '#F59E0B', lightBg: '#FFFBEB', text: '#FFFFFF', darkText: '#92400E' },
} as const;
