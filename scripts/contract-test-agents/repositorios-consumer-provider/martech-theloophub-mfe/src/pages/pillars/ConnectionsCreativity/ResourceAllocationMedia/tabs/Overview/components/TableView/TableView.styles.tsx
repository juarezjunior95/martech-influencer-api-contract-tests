import { styled } from '@hexa-ui/theme';

export const StyledOverviewTable = styled('div', {
  '.ag-header': {
    '.ag-header-row': {
      '.ag-header-cell': {
        borderTop: '1px solid #14141414',
        borderBottom: '1px solid #14141414',
        '.ag-header-cell-label': {
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
        },
      },
    },
  },

  '.ag-row': {
    '&.ag-row-odd': {
      '.ag-cell': {
        backgroundColor: '#FAFAFA',
      },
    },
    '&.ag-row-last': {
      borderBottom: '1px solid #14141414 !important',
    },
    '.ag-cell': {},
  },
});
