import { styled } from '@hexa-ui/theme';

export const StyledPerformanceKpiCardRoot = styled('div', {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
  height: '100%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const StyledPerformanceKpiCardBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  minWidth: 0,
  flex: '1 1 auto',
});

export const StyledPerformanceKpiBigNumberShell = styled('div', {
  width: '100%',
  minWidth: 0,
  flex: '1 1 auto',
  display: 'flex',
  padding: '24px',
  flexDirection: 'column',
  gap: '24px',
  minHeight: 0,
  border: '1px solid #1414141f',
  borderRadius: '16px',
  background: '#FFFFFF',
  overflow: 'hidden',
  boxShadow: 'none',
  transition: 'background-color 300ms ease-out, box-shadow 300ms ease-out',

  '& .innovation-performance-kpi-big-number.bigNumberContainer': {
    padding: '0',
    gap: '12px',
    height: 'auto',
  },

  '& .innovation-performance-kpi-big-number': {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    gap: '4px',

    '& h1': {
      maxWidth: '100%',
      minWidth: 0,
      overflow: 'hidden',
      overflowWrap: 'anywhere',
      textOverflow: 'clip',
    },
  },

  '& [data-testid="innovation-performance-kpi-chart-header-measure"]': {
    fontSize: '14px !important',
    lineHeight: '1.4',
    fontWeight: 400,
  },

  variants: {
    interactive: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          background:
            'linear-gradient(0deg, rgba(229, 182, 17, 0.04) 0%, rgba(229, 182, 17, 0.04) 100%), #FFF',
          boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.16)',
        },
      },
      false: {},
    },
    emptyKpi: {
      true: {
        '& .innovation-performance-kpi-big-number.bigNumberContainer': {
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
        },
      },
      false: {},
    },
  },

  defaultVariants: {
    interactive: false,
    emptyKpi: false,
  },
});

export const StyledPerformanceKpiSparklineSlot = styled('div', {
  width: '100%',
  minWidth: 0,
  minHeight: '120px',
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
});
