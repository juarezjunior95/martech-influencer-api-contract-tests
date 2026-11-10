import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const CustomStyleDefault = styled('div', {});

export const StyledTableContainer = styled('div', {
  width: '100%',
  minHeight: '100px',

  '.ag-root-wrapper': {
    borderRadius: '0',
    'ag-ltr ag-layout-normal': {
      borderBottom: '1px solid rgb(20 20 20 / 12%)',
      borderLeft: '1px solid rgb(20 20 20 / 12%)',
    },
  },

  '.ag-header': {
    background: 'none !important',
    border: 'none !important',

    '.ag-header-cell, .ag-header-group-cell': {
      background: 'white',
      padding: '0 8px',
      '&[col-id*=gantt]': {
        padding: 0,
      },
    },

    '.ag-header-cell-hide': {
      display: 'none',
    },

    '.ag-header-cell-label, .ag-header-group-cell-label': {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '4px',
      flex: 1,

      '.ag-header-cell-text, .ag-header-group-text': {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        textAlign: 'center',
        whiteSpace: 'normal',
        textOverflow: 'initial',
      },
      '.ag-header-cell-subtext': {
        fontSize: '12px',
        color: '#1414148F',
      },

      '.ag-header-cell-icon-text': {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        '.icon': {
          svg: {
            height: '20px',
            width: '20px',
          },
        },
      },
    },

    '.ag-header-cell-resize': {
      pointerEvents: 'none',
      '&:after': {
        background: 'transparent !important',
        pointerEvents: 'none',
      },
    },
  },

  '.ag-row': {
    border: 'none !important',

    '&.ag-row-hover': {
      '&:before': {
        display: 'none',
      },
    },

    '.ag-cell': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'white',
      gap: '8px',
      paddingLeft: '0',
      paddingRight: '0',

      '&.ag-cell-hide': {
        display: 'none',
      },

      '.ag-cell-content': {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        paddingLeft:
          'calc(var(--ag-cell-horizontal-padding) - 1px + var(--ag-row-group-indent-size)*var(--ag-indentation-level))',
        paddingRight: 'calc(var(--ag-cell-horizontal-padding) - 1px)',
      },
      '&[col-id*=gantt]': {
        '& .ag-cell-content': {
          padding: 0,
        },
      },
    },
  },

  '.ag-row.ag-row-empty': {
    display: 'none',
  },

  '.ag-body-horizontal-scroll': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'white',
    boxShadow: tokens.shadow.elevation[1],

    '.ag-body-horizontal-scroll-viewport': {
      minHeight: '8px !important',
      maxHeight: '8px !important',
      height: '8px !important',
      scrollbarColor: 'initial',
      transform: 'scale(0.96)',

      '&::-webkit-scrollbar': {
        height: '8px',
      },

      '&::-webkit-scrollbar-track': {
        background: '#1414140A',
        borderRadius: '512px',
      },

      '&::-webkit-scrollbar-thumb': {
        background: '#1414143D',
        borderRadius: '512px',
      },
    },

    '.ag-body-horizontal-scroll-container': {
      minHeight: '8px !important',
      height: '8px !important',
    },
  },
});
