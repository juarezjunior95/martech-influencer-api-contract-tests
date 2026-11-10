/**
 * AI Chat Design Tokens - TypeScript exports
 */

export const colors = {
  primary: 'var(--ai-chat-color-primary)',
  primaryHover: 'var(--ai-chat-color-primary-hover)',
  textPrimary: 'var(--ai-chat-color-text-primary)',
  textSecondary: 'var(--ai-chat-color-text-secondary)',
  textInverse: 'var(--ai-chat-color-text-inverse)',
  bgDefault: 'var(--ai-chat-color-bg-default)',
  bgSubtle: 'var(--ai-chat-color-bg-default-subtle)',
  bgSecondary: 'var(--ai-chat-color-bg-secondary)',
  border: 'var(--ai-chat-color-border)',
  borderStrong: 'var(--ai-chat-color-border-strong)',
} as const;

export const spacing = {
  0: 'var(--ai-chat-space-0)',
  1: 'var(--ai-chat-space-1)',
  2: 'var(--ai-chat-space-2)',
  3: 'var(--ai-chat-space-3)',
  4: 'var(--ai-chat-space-4)',
  5: 'var(--ai-chat-space-5)',
  6: 'var(--ai-chat-space-6)',
  8: 'var(--ai-chat-space-8)',
  10: 'var(--ai-chat-space-10)',
  12: 'var(--ai-chat-space-12)',
  16: 'var(--ai-chat-space-16)',
} as const;

export const typography = {
  fontFamily: 'var(--ai-chat-font-family)',
  fontSize: {
    xs: 'var(--ai-chat-font-size-xs)',
    sm: 'var(--ai-chat-font-size-sm)',
    md: 'var(--ai-chat-font-size-md)',
    lg: 'var(--ai-chat-font-size-lg)',
    xl: 'var(--ai-chat-font-size-xl)',
  },
  fontWeight: {
    regular: 'var(--ai-chat-font-weight-regular)',
    medium: 'var(--ai-chat-font-weight-medium)',
    semibold: 'var(--ai-chat-font-weight-semibold)',
    bold: 'var(--ai-chat-font-weight-bold)',
  },
} as const;

export const radius = {
  none: 'var(--ai-chat-radius-none)',
  sm: 'var(--ai-chat-radius-sm)',
  md: 'var(--ai-chat-radius-md)',
  lg: 'var(--ai-chat-radius-lg)',
  xl: 'var(--ai-chat-radius-xl)',
  full: 'var(--ai-chat-radius-full)',
} as const;

export const shadows = {
  sm: 'var(--ai-chat-shadow-sm)',
  md: 'var(--ai-chat-shadow-md)',
  lg: 'var(--ai-chat-shadow-lg)',
  xl: 'var(--ai-chat-shadow-xl)',
} as const;
