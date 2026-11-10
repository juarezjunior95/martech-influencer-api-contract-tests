import { styled } from '@hexa-ui/theme';

export const StickyScrollCollapseStyles = styled('div', {
  display: 'grid',
  transition: 'grid-template-rows 0.2s ease, opacity 0.2s ease',

  '& > *': {
    overflow: 'hidden',
  },

  variants: {
    show: {
      true: {
        opacity: 1,
        gridTemplateRows: '1fr',
      },
      false: {
        opacity: 0,
        gridTemplateRows: '0fr',
        pointerEvents: 'none',
        paddingBottom: 0,
      },
    },
  },
});
