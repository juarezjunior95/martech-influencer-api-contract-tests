import { styled } from '@hexa-ui/theme';

export const ContainerWithScroll = styled('div', {
  width: '100%',
  scrollbarColor: 'initial',

  '&::-webkit-scrollbar': {
    height: '8px',
    width: '8px',
  },

  '&::-webkit-scrollbar-track': {
    background: '#1414140A',
    borderRadius: '512px',
  },

  '&::-webkit-scrollbar-thumb': {
    background: '#1414143D',
    borderRadius: '512px',
  },

  '&.has-scroll': {
    paddingBottom: '20px',
  },

  variants: {
    overflow: {
      autoY: {
        overflowY: 'auto',
      },
      autoX: {
        overflowX: 'auto',
      },
      hidden: {
        overflowY: 'hidden',
        overflowX: 'hidden',
      },
    },
    background: {
      white: {
        backgroundColor: 'white',
      },
      none: {
        backgroundColor: 'transparent',
      },
    },

    padding: {
      false: {
        padding: '0px',
      },
      true: {
        padding: '24px',
      },
    },
    borderRadius: {
      true: {
        borderRadius: '0 0 16px 16px',
      },
      false: {
        borderRadius: '0',
      },
    },
    position: {
      relative: {
        position: 'relative',
      },
    },
  },
});
