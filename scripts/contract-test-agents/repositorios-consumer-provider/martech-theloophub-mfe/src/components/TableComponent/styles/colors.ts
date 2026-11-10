import { theme } from 'theme';

const BASE_COLOR = theme.colors.txt.default;

export const TABLE_COLORS = {
  text: {
    primary: theme.colors.txt.default,
    secondary: theme.colors.txt.secondary,
    muted: theme.colors.txt.secondary,
  },
  background: {
    primary: '#FFFFFF',
    secondary: theme.colors.charts.bg.neutrals['10'],
    zebra: theme.colors.charts.bg.neutrals['10'],
    highlight: '#E0F3FF',
    hover: `${theme.colors.charts.bg.categories.primary.yellow}0A`,
    disabled: theme.colors.charts.bg.neutrals['10'],
    transparent: 'transparent',
  },
  border: {
    primary: theme.colors.charts.border.neutrals['20'],
    default: theme.colors.charts.border.neutrals['20'],
    light: theme.colors.charts.border.neutrals['10'],
    medium: theme.colors.charts.border.neutrals['40'],
    header: `${BASE_COLOR}29`,
    subtle: `${BASE_COLOR}0D`,
  },
  variation: {
    neutral: theme.colors.charts.bg.neutrals['50'],
  },
  interactive: {
    primary: theme.colors.charts.bg.categories.primary.yellow,
    error: theme.colors.txt.negative,
    checkbox: {
      border: theme.colors.charts.bg.neutrals['50'],
      active: theme.colors.txt.default,
    },
  },
  gradient: {
    hoverStart: theme.colors.charts.bg.sequential.primary['1'],
    hoverEnd: theme.colors.charts.bg.sequential.primary['8'],
    hoverBorder: `linear-gradient(90deg, ${theme.colors.charts.bg.sequential.primary['1']} 0%, ${theme.colors.charts.bg.sequential.primary['8']} 100%)`,
  },
} as const;
