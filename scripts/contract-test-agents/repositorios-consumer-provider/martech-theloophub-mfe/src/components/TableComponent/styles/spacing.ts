export const TABLE_SPACING = {
  gap: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  cell: {
    padding: '8px',
    paddingLarge: '8px 16px',
    gap: '8px',
    gapSmall: '4px',
  },
  header: {
    height: '96px',
    padding: '0 12px',
    paddingLarge: '0 16px',
  },
  row: {
    minHeight: '44px',
  },
  section: {
    padding: '16px 24px',
    paddingSmall: '12px 24px',
  },
  rowGroupLabel: {
    width: 48,
    borderWidth: 1,
  },
  axis: {
    width: '144px',
    flex: '0 0 144px',
  },
  icon: {
    small: { width: '24px', height: '24px' },
    medium: { width: '32px', height: '32px' },
    large: { width: '48px', height: '48px' },
  },
  checkbox: {
    size: '20px',
  },
  sortIcon: {
    size: '16px',
  },
} as const;

export const TABLE_BORDER_RADIUS = {
  none: '0',
  small: '4px',
  medium: '8px',
  large: '12px',
  header: {
    default: '12px 12px 4px 4px',
    first: '12px 0 0 4px',
    last: '0 12px 4px 0',
  },
  footer: {
    default: '4px 4px 12px 12px',
  },
  headerTitle: '11px 11px 0 0',
} as const;
