import { styled } from '@hexa-ui/theme';
import Megabrands from 'assets/icons/megabrands.svg';

export const StyledPortfolioPerformanceTableContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '240px 346px 346px 346px',
  gap: '16px',
  overflowX: 'auto',
});

export const StyledPortfolioPerformanceTable = styled('div', {
  '.ag-hidden-cell': {
    display: 'none !important',
  },

  '.ag-cell-text-opacity': {
    color: '#1414145C',
  },

  '.ag-header': {
    '.ag-header-container': {
      border: '1px solid #1414141F',
      borderRadius: '16px',
      overflow: 'hidden',
    },
    '.ag-header-row': {
      '.ag-header-cell': {
        color: '#1414148F',
      },

      '.ag-header-cell-portfolio': {
        color: '#141414',
        width: '240px !important',
      },

      '.ag-header-cell-span-vs-ly': {
        width: 'calc(var(--width) * 3) !important',
      },

      '.ag-header-cell-resize': {
        '&:after': {
          left: '4px',
          width: '1px',
          height: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#1414141F !important',
        },
      },

      '.ag-header-group-cell': {
        background: '#F5F2E1',
      },
    },
  },
  '.ag-row': {
    border: 'none',

    '.ag-cell': {
      borderTop: 'none',
      borderRight: '1px solid #1414141F',
      borderBottom: '1px solid #1414141F',

      '&.ag-column-last': {
        borderRight: '1px solid #1414141F',
      },

      '&.ag-column-first': {
        borderLeft: '1px solid #1414141F',
      },
      '&.ag-cell-first-row': {
        borderTop: '1px solid #1414141F',
      },

      '&.ag-cell-first-row.ag-column-first': {
        borderTopLeftRadius: '16px',
      },
      '&.ag-cell-first-row.ag-column-last': {
        borderTopRightRadius: '16px',
      },
      '&.ag-cell-last-of-group.ag-column-first': {
        borderBottomLeftRadius: '16px',
      },
      '&.ag-cell-last-of-group.ag-column-last': {
        borderBottomRightRadius: '16px',
      },

      '&.ag-cell-portfolio': {
        borderRadius: '16px',
      },

      '&.ag-cell-megabrands': {
        background: '#EFD328',
        border: 'none',
        height: '86%',
        marginTop: '2%',
        width: '240px !important',

        '.ag-cell-content:before': {
          content: `url(${Megabrands})`,
          height: '28px',
        },
      },
      '&.ag-cell-expansion': {
        background: '#EC8AB0',
        border: 'none',
        height: '86%',
        marginTop: '2%',
        width: 'calc(240px - 62px) !important',
        left: '62px !important',
      },
      '&.ag-cell-sustain': {
        background: '#69ACE3',
        border: 'none',
        height: '86%',
        marginTop: '2%',
        width: 'calc(240px - 112px) !important',
        left: '112px !important',
      },
      '&.ag-cell-tail': {
        background: '#808DE5',
        border: 'none',
        height: '86%',
        marginTop: '2%',
        width: 'calc(240px - 162px) !important',
        left: '162px !important',
      },
      '&.ag-cell-total': { color: '#141414', fontWeight: '500' },
    },
  },
});
