import { styled } from '@hexa-ui/theme';

export const StyledGrowthLeagueTable = styled('div', {
  '.ag-header': {
    '.ag-header-container': {
      border: '1px solid #1414141F',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      overflow: 'hidden',
    },
    '.ag-header-cell': {
      borderRight: '1px solid #1414141F',

      '&[col-id=rank]': {
        borderRight: 'none',
      },

      '&[col-id=country]': {
        borderRight: 'none',
      },
    },

    '.ag-header-cell-country .ag-header-cell-label': {
      alignItems: 'start',
    },

    '.ag-header-cell-brand .ag-header-cell-label': {
      alignItems: 'start',
    },
  },

  '.ag-row': {
    '.ag-cell': {
      borderRight: '1px solid #1414141F',
      padding: '8px 12px',

      '&.ag-column-first': {
        borderLeft: '1px solid #1414141F',
      },

      '&.ag-cell-rank': {
        borderRight: 'none',
        padding: '8px 16px',
      },

      '&.ag-cell-country': {
        justifyContent: 'start',
        padding: '8px 12px',
        borderRight: '1px solid #1414141F',
      },

      '&.ag-cell-country-no-border': {
        borderRight: 'none',
        padding: '8px 12px',
        justifyContent: 'start',
      },

      '&.ag-cell-brand': {
        justifyContent: 'start',
        padding: '8px 12px',
      },

      '&.ag-cell-last-of-group': {
        borderBottom: '1px solid #1414141F',
      },

      '&.ag-column-first.ag-cell-last-of-group': {
        borderBottomLeftRadius: '16px',
      },

      '&.ag-column-last.ag-cell-last-of-group': {
        borderBottomRightRadius: '16px',
      },
    },
  },
});
