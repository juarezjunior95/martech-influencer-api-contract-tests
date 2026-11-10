import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const InvestmentBreakdownTableStyles = styled('div', {
  '.ag-header': {
    '.ag-header-row': {
      '.ag-header-cell': {
        color: '#1414148F',
      },

      '.portfolio-header': {
        borderLeft: '1px solid #14141414',
        borderTop: '1px solid #14141414',
        borderTopLeftRadius: '16px',
        color: 'white',
        fontWeight: 'bold',
      },

      '.brands-header, .ag-header-group-cell': {
        borderTop: '1px solid #14141414',
        borderRight: '1px solid #141414',
        backgroundColor: 'white',
        color: '#141414',
        fontWeight: 'bold',
      },

      '.final-header': {
        borderRight: '1px solid #141414',
      },

      '.intermediate-header': {
        borderRight: '1px solid #14141414',
      },

      '.ag-column-last': {
        borderRight: '1px solid #14141414',
        '&.ag-header-group-cell': {
          borderTopRightRadius: '16px',
        },
      },
    },
  },

  '.ag-row': {
    '.ag-cell': {
      borderBottom: '1px solid #e1dfda',
      borderRight: '1px solid #e1dfda',
      zIndex: '0 !important',

      '&.ag-cell-final-header': {
        borderRight: '1px solid #141414',
      },

      '&.ag-cell-first-row': {
        background: theme.colors.charts.bg.neutrals[60],
        borderRight: '1px solid white',
        color: 'white',
        fontWeight: 'bold',

        '&.ag-column-first': {
          borderTopLeftRadius: '0 !important',
          borderBottomLeftRadius: '16px',
        },

        '&.ag-column-last': {
          borderTopRightRadius: '0 !important',
          borderBottomRightRadius: '16px',
          borderRight: 'none',
        },
      },

      '&[col-id="brands"] .ag-cell-content': {
        padding: '4px 10px',
        borderRight: '1px solid #141414',
        fontWeight: 'bold',
      },

      '&.ag-column-last': {
        '&.ag-cell-first-of-group': {
          borderTopRightRadius: '16px',
        },

        '&.ag-cell-last-of-group': {
          borderBottomRightRadius: '16px',
        },

        '&.ag-cell-megabrands': {
          borderRight: '1px solid #E5B611',
        },

        '&.ag-cell-expansion': {
          borderRight: '1px solid #C2346A',
        },

        '&.ag-cell-sustain': {
          borderRight: '1px solid #2F74AA',
        },

        '&.ag-cell-tail': {
          borderRight: '1px solid #4E579F',
        },

        '&.ag-cell-total': {
          borderRight: '1px solid #4C5965',
        },
      },

      '&.ag-cell-first-of-group': {
        '&.ag-cell-megabrands': {
          borderTop: '1px solid #E5B611',
        },

        '&.ag-cell-expansion': {
          borderTop: '1px solid #C2346A',
        },

        '&.ag-cell-sustain': {
          borderTop: '1px solid #2F74AA',
        },

        '&.ag-cell-tail': {
          borderTop: '1px solid #4E579F',
        },

        '&.ag-cell-total': {
          borderTop: '1px solid #4C5965',
        },
      },

      '&.ag-cell-last-of-group': {
        '&.ag-cell-megabrands': {
          borderBottom: '1px solid #E5B611',
        },

        '&.ag-cell-expansion': {
          borderBottom: '1px solid #C2346A',
        },

        '&.ag-cell-sustain': {
          borderBottom: '1px solid #2F74AA',
        },

        '&.ag-cell-tail': {
          borderBottom: '1px solid #4E579F',
        },

        '&.ag-cell-total': {
          borderBottom: '1px solid #4C5965',
        },
      },

      '&.ag-row-cell-even': {
        '&.ag-cell-megabrands': {
          backgroundColor: '#E5B6110A',
        },

        '&.ag-cell-expansion': {
          backgroundColor: '#C2346A0A',
        },

        '&.ag-cell-sustain': {
          backgroundColor: '#2F74AA0A',
        },

        '&.ag-cell-tail': {
          backgroundColor: '#4E579F0A',
        },

        '&.ag-cell-total': {
          backgroundColor: '#4C59650A',
        },
      },

      '&.ag-column-first': {
        fontWeight: 'bold',

        '&.ag-cell-first-of-group': {
          borderTopLeftRadius: '16px',
        },

        '&.ag-cell-last-of-group': {
          borderBottomLeftRadius: '16px',
        },

        '&.ag-column-last': {
          borderBottomRightRadius: '16px',
          borderLeft: 'none',
        },

        '&.ag-cell-megabrands': {
          backgroundColor: '#E5B611',
          color: '#E5B611',
          borderBottomLeftRadius: '16px',
        },

        '&.ag-cell-expansion': {
          backgroundColor: '#C2346A',
          color: '#C2346A',
          borderBottomLeftRadius: '16px',
        },

        '&.ag-cell-sustain': {
          backgroundColor: '#2F74AA',
          color: '#2F74AA',
          borderBottomLeftRadius: '16px',
        },

        '&.ag-cell-tail': {
          backgroundColor: '#4E579F',
          color: '#4E579F',
        },

        '&.ag-cell-total': {
          backgroundColor: '#4C5965',
          color: '#4C5965',
        },
      },
    },
  },
});
