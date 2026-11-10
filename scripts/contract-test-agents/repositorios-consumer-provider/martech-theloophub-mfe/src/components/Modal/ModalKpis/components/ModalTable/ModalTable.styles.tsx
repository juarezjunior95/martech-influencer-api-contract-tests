import { Button } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledModalTooltip = styled('div', {
  padding: '8px 12px',
  background: '#ffffff',
  color: '#141414',
  borderRadius: '8px',
  boxShadow: tokens.shadow.elevation[2],
  whiteSpace: 'pre-line',
  fontSize: '12px',
  lineHeight: '1.4',
});

export const StyledModalTableContainer = styled('div', {
  // Header styles
  '.ag-header .ag-header-container': {
    backgroundColor: '#4C5965',
    borderRadius: '16px 16px 0px 0px',

    '.ag-header-cell': {
      backgroundColor: '#4C5965 !important',
      borderRadius: '16px',

      '.ag-header-cell-label': {
        alignItems: 'start',
        paddingLeft: '10px',
      },

      '.ag-header-cell-icon-text': {
        fontSize: '16px',
        color: '#fff',
      },
    },
  },

  '.ag-row-odd .ag-cell': {
    backgroundColor: '#FAFAFA !important',
  },

  // Cell styles
  '.ag-cell': {
    '.ag-cell-content': {
      justifyContent: 'start !important',
      color: '#1414148F',
    },

    '&.ag-column-first': {
      '.ag-cell-content': {
        color: '#141414',
      },
    },
  },
});

export const ModalContentWrapper = styled('div', {
  '& > div': {
    '& > div:first-child': {
      width: '800px',

      '& > div:first-child': {
        padding: '24px 24px 0px 24px !important',
      },
    },

    '& > div:nth-child(2)': {
      height: '368px',
      marginBottom: '0px',
      overflowY: 'auto',
      marginRight: '8px',
      padding: '0rem 1.65rem 0rem',
      scrollbarColor: 'initial',

      '&::-webkit-scrollbar': {
        width: '8px',
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#dbdada',
        borderRadius: '8px',
      },
    },

    '& > div:last-child': {
      padding: '12px 0px 12px 0px !important',
    },
  },
});

export const ModalTitleContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const StyledCloseButton = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#14141414',
  border: 'none',
  width: '2rem',
  height: '2rem',
  borderRadius: '50%',
  outline: 'none',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  position: 'fixed',
  top: '1.75rem',
  right: '2rem',
});

export const ModalBodyWrapper = styled('div', {
  width: '100%',
  height: 'auto',

  '& > p': {
    color: '#141414',
    marginBottom: '24px',
  },
});

export const ModalContentSection = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

export const WrapperTable = styled('div', {
  position: 'relative',
  width: '559px',
  height: 'auto',
  maxHeight: '592px',
  minHeight: 'min-content',

  '& > div': {
    maxHeight: '592px',
    minHeight: 'min-content',

    '& > div': {
      boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '16px',
      marginBottom: '5px',
    },
  },
});

export const StyledSeeMoreButton = styled(Button, {
  position: 'absolute',
  width: '559px',
  bottom: '5px',
  height: '49px !important',
  borderRadius: '0px 0px 16px 16px',
  background: '#FAFAFA !important',

  p: {
    color: '#006EDB',
  },

  svg: {
    color: '#006EDB',
    width: '16px',
    height: '16px',
    marginLeft: '8px',
    transition: 'transform 350ms',
  },

  variants: {
    showAllRows: {
      true: {
        svg: {
          transform: 'rotate(0deg)',
        },
      },
      false: {
        svg: {
          transform: 'rotate(180deg)',
        },
      },
    },
    disabled: {
      true: {
        background: '#F0F0F0 !important',
        cursor: 'not-allowed',
        pointerEvents: 'auto',

        p: {
          color: '#A0A0A0',
        },

        svg: {
          color: '#A0A0A0',
        },
        '&:hover': {
          boxShadow: 'initial',
        },
      },
    },
    singleRow: {
      true: {
        bottom: '0',
      },
      false: {
        bottom: '5px',
      },
    },
  },
});
