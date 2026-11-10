import { Tooltip } from '@hexa-ui/components2';
import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledCampaignsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
});

export const StyledCampaignsItem = styled('div', {
  textAlign: 'center',
  width: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  padding: '0 12px',
  minHeight: '36px',
  maxHeight: '36px',
  borderBottom: `1px solid ${tokens.color.foundation.border.tertiary}`,
  variants: {
    isLast: {
      true: {
        borderBottom: 'none',
      },
    },
  },
});

export const StyledTooltip = styled(Tooltip, {
  zIndex: 9999,
  // Prevent layout shifts that can cause ResizeObserver loops
  '& [data-radix-popper-content-wrapper]': {
    transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
    willChange: 'transform', // Optimize for frequent changes
  },
});

export const StyledAgCellContent = styled('div', {
  height: '100%',
  borderBottom: `1px solid ${tokens.color.foundation.border.tertiary}`,
  borderRight: `1px solid ${tokens.color.foundation.border.tertiary}`,
});
