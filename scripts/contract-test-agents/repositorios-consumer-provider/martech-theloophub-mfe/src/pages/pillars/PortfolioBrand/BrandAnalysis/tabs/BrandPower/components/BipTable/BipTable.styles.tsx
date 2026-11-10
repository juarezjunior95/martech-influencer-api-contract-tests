import { styled } from '@hexa-ui/theme';

export const StyledBipTableContainer = styled('div', {
  // Header styles
  '.ag-header .ag-header-container .ag-header-background-gray-4': {
    backgroundColor: 'rgba(20, 20, 20, 0.06)',
  },

  '.ag-header-cell': {
    borderRight: '1px solid #AAB4BE',
    borderBottom: '1px solid #1414141F',

    '&:first-child': {
      '.ag-header-cell-label': {
        alignItems: 'flex-start',
      },

      '.ag-cell-content': {
        alignItems: 'flex-start !important',
      },
    },

    '&:last-child': {
      borderRight: 'none',
    },

    '&.ag-header-cell-brand': {
      borderRight: '1px solid #1414141F',
    },
  },

  // Cell styles
  '.ag-cell': {
    '&:first-child': {
      borderRight: '1px solid #AAB4BE',
    },

    '&:nth-child(2)': {
      borderRight: '1px solid #1414141F',
    },

    '&.ag-column-first': {
      '.ag-cell-content': {
        justifyContent: 'flex-start !important',
      },
    },
  },

  img: {
    width: '32px !important',
    height: '32px !important',
    borderRadius: '50%',
    border: '1px solid rgba(20, 20, 20, 0.12)',
  },
});
