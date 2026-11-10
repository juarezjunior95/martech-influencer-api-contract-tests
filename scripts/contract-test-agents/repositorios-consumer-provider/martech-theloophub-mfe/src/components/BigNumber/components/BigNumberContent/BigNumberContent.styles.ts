import { styled } from '@hexa-ui/theme';

export const StyledBigNumberItemContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',

  variants: {
    orientation: {
      vertical: {
        justifyContent: 'space-between',
      },
      horizontal: {
        display: 'grid',
        gap: '80px',
      },
      center: {},
      none: {},
    },
  },
});

export const StyledBigNumberItemContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',

  variants: {
    spacing: {
      loose: {
        gap: '16px',
      },
      cozy: {
        gap: '4px',
      },
    },
    alignment: {
      left: {},
      center: {
        flex: 1,
        alignItems: 'center',
        textAlign: 'center',
      },
    },
    orientation: {
      vertical: {},
      horizontal: {},
      center: {
        alignItems: 'flex-start',
      },
      none: {},
    },
  },
});

export const StyledBigNumberMainContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const StyledBigNumberComparisonContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'start',
  gap: '4px',

  variants: {
    preserveSpace: {
      true: {
        minWidth: '20px',
      },
      false: {},
    },
  },

  defaultVariants: {
    preserveSpace: false,
  },
});

export const StyledBigNumberSecondaryInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const StyledBigNumberSecondaryInfoValue = styled('div', {
  display: 'flex',
  gap: '4px',
  alignItems: 'center',

  variants: {
    hasValue: {
      true: {
        gap: '4px',
      },
      false: {
        gap: '0px',
      },
    },
  },
});
