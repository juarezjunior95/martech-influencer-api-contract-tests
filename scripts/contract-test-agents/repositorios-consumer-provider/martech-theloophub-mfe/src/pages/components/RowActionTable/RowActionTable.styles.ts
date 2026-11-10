import { styled } from '@hexa-ui/theme';

const styles = {
  '.ag-header': {
    '.ag-header-group-cell': {
      fontSize: '14px',
      borderRight: '1px solid #1414141F',
    },

    '.ag-header-cell': {
      fontSize: '14px',
      color: '#1414148F',
      borderRight: '1px solid #1414141F',
      borderBottom: '1px solid #1414141F',

      '&.ag-brand-breakdown-empty-state': {
        color: '#141414',
      },

      '&[col-id="label"]': {
        borderRight: 'none',
      },
    },

    '.ag-column-last': {
      borderRight: 'none',
    },
  },

  '.ag-row': {
    fontSize: '12px',
    '&.ag-row-odd': {
      '.ag-cell': {
        backgroundColor: '#FAFAFA',
      },
    },

    '.ag-cell-focus': {
      border: 'none',
    },

    '.ag-cell': {
      borderRight: '1px solid #1414141F',

      '&[col-id="page_type"]': {
        borderBottom: '1px solid #1414141F',
        backgroundColor: 'white !important',
      },

      '&[col-id="brand_power_ac"]': {
        borderRight: 'none',
      },
      '&[col-id="meaning_ac"]': {
        borderRight: 'none',
      },
      '&[col-id="difference_ac"]': {
        borderRight: 'none',
      },
      '&[col-id="salience_ac"]': {
        borderRight: 'none',
      },

      '&.align-right .ag-cell-content': {
        justifyContent: 'flex-end',
      },

      '&.ag-cell-last-of-group': {
        borderBottom: '1px solid #1414141F',
        '&.border-bottom': {
          borderBottom: 'none',
        },
      },

      '&.ag-column-last': {
        borderRight: 'none',
      },

      '&.ag-cell-competitor-header': {
        borderRight: 'none',
        borderLeft: 'none',
        borderBottom: '1px solid #1414141F',
        borderTop: '1px solid #1414141F',
        color: '#1414148F',
        fontWeight: 'bold',
        background: 'white',

        '.ag-cell-content': {
          justifyContent: 'flex-start',
        },
      },

      '&.border-bottom': {
        borderBottom: '1px solid #1414141F',
      },
    },
  },

  '.ag-body-horizontal-scroll': {
    display: 'none !important',
  },

  '.ag-body-vertical-scroll-viewport': {
    width: '8px !important',
    minWidth: '8px !important',
    maxWidth: '8px !important',
    scrollbarColor: 'initial',

    '&::-webkit-scrollbar': {
      width: '8px',
      background: 'transparent',
      position: 'absolute',
      zIndex: 10,
    },

    '&::-webkit-scrollbar-track': {
      background: '#1414140A',
      borderRadius: '512px',
    },

    '&::-webkit-scrollbar-thumb': {
      background: '#1414143D',
      borderRadius: '512px',
      transition: 'background 0.2s',
    },

    '&::-webkit-scrollbar-': {},
  },
};

export const StyledRowActionTable = styled('div', {
  ...styles,
});

export const StyledSelectionRowActionTable = styled('div', {
  ...{
    ...styles,
    '.ag-row': {
      ...styles['.ag-row'],
      cursor: 'pointer',
      '&:hover': {
        '&:before': {
          backgroundColor: 'transparent',
        },
        '.ag-cell': {
          backgroundColor: '#EDCD201F',

          '&.ag-column-first': {
            fontWeight: 'bold',
            color: '#1414148F',
          },
        },
      },

      '&.ag-row-selected': {
        cursor: 'default',

        '&:before': {
          backgroundColor: 'transparent',
        },
        '.ag-cell': {
          backgroundColor: '#EDCD203D',

          '&.ag-column-first': {
            borderLeft: '4px solid #EDCD20',
            fontWeight: 'bold',
            color: '#141414',
          },
        },
      },
    },
  },
});
