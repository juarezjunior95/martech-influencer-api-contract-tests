import { styled } from '@hexa-ui/theme';
import Megabrands from 'assets/icons/megabrands.svg';

export const StyledPortfolioPerformanceTableContainer = styled('div', {
  '.ag-hidden-cell': {
    display: 'none !important',
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
        width: '180px !important',
      },

      '.ag-header-cell-span-vs-ly': {
        width: 'calc(var(--width) * 3) !important',
      },

      '.ag-header-cell-resize': {
        '&:after': {
          left: '4px',
          width: '1px',
          height: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#1414141F !important',
        },
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
        background: '#E5B611',
        height: '96%',
        marginBottom: '4px',
        width: '180px !important',

        '.ag-cell-content:before': {
          content: `url(${Megabrands})`,
          height: '28px',
        },
      },
      '&.ag-cell-expansion': {
        background: '#C2346A',
        height: '92%',
        marginBottom: '4px',
        marginTop: '4px',
        width: 'calc(180px - 32px) !important',
        left: '32px !important',
        color: 'white',
      },
      '&.ag-cell-sustain': {
        background: '#2F74AA',
        height: '92%',
        marginBottom: '4px',
        marginTop: '4px',
        width: 'calc(180px - 64px) !important',
        left: '64px !important',
        color: 'white',
      },
      '&.ag-cell-tail': {
        background: '#4E579F',
        height: '96%',
        marginTop: '4px',
        width: 'calc(180px - 96px) !important',
        left: '96px !important',
        color: 'white',
      },
      '&.ag-cell-total': {
        background: 'white',
        height: '96%',
        marginTop: '4px',
        width: 'calc(180px - 96px) !important',
        left: '96px !important',
      },
    },
  },
});
