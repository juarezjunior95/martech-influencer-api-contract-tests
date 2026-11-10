import { styled } from '@hexa-ui/theme';

export const StyledOverviewTableContainer = styled('div', {
  // Header styles
  '.ag-header-cell, .ag-header-group-cell': {
    borderRight: '1px solid #EEEEEE',
    borderBottom: '1px solid #EEEEEE',
  },

  '.ag-header-row:first-child': {
    '.ag-header-cell, .ag-header-group-cell': {
      borderTop: '1px solid #1414141F',

      '&:first-child': {
        borderLeft: '1px solid #1414141F',
        borderTopLeftRadius: '16px',
      },

      '&:last-child': {
        borderTopRightRadius: '16px',
      },
    },
  },

  '.ag-header-row:last-child': {
    '.ag-header-cell, .ag-header-group-cell': {
      '&:first-child': {
        borderBottomLeftRadius: '16px',
      },

      '&:last-child': {
        borderBottomRightRadius: '16px',
      },
    },
  },

  '.ag-header-cell:last-child, .ag-header-group-cell:last-child': {
    backgroundColor: '#F6EDD866 !important',

    '&[col-id=countries], &[col-id=brand]': {
      background: 'none !important',
    },
  },

  '.ag-header-row .ag-header-cell:first-child, .ag-header-row .ag-header-group-cell:first-child':
    {
      borderLeft: '1px solid #EEEEEE',
    },

  // Cell styles
  '.ag-cell': {
    borderTop: 'none',
    borderRight: '1px solid #EEEEEE',
    borderBottom: '1px solid #EEEEEE',

    '&.ag-column-first': {
      borderLeft: '1px solid #EEEEEE',
    },

    '&.ag-cell-first-of-group': {
      borderTop: '1px solid #EEEEEE',

      '&.ag-column-first': {
        borderTopLeftRadius: '16px',
      },

      '&.ag-column-last': {
        borderTopRightRadius: '16px',
      },
    },

    '&.ag-cell-last-of-group': {
      borderBottom: '1px solid #EEEEEE',

      '&.ag-column-first': {
        borderBottomLeftRadius: '16px',
      },

      '&.ag-column-last': {
        borderBottomRightRadius: '16px',
      },
    },

    '&.ag-column-last': {
      backgroundColor: '#F6EDD866 !important',
    },

    '&[col-id=countries], &[col-id=brand]': {
      background: 'none !important',
    },
  },
});
