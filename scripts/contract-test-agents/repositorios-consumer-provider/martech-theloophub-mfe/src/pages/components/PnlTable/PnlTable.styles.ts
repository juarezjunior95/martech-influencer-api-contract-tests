import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledPnlTable = styled('div', {
  '.ag-header': {
    '.ag-header-container': {
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
    },

    '.ag-header-row': {
      '.ag-header-group-cell': {
        borderRight: '1px solid #141414',
        '&.ag-column-last': {
          borderRight: 'none',
          borderTopRightRadius: '16px',
        },
      },
      '.ag-header-cell': {
        background: theme.colors.gray[50],
        color: 'white',

        '.ag-header-cell-label': {
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',

          '.ag-header-cell-subtext': {
            color: 'white',
            fontSize: '10px',
            fontWeight: 400,
          },
        },

        '&.ag-column-first': {
          borderLeft: '1px solid #14141414',
          borderRight: '1px solid #141414',
          '.ag-cell-content': {
            justifyContent: 'flex-start',
            '.cell-subtitle': {
              fontSize: '14px',
              color: theme.colors.txt.secondary + ' !important',
            },
          },
        },

        '&[col-id*=og_vs_ly], &.ag-last-child-pnl, &[col-id=organic_growth_vs_ly]':
          {
            borderRight: '1px solid #141414 !important',
          },
        '&[col-id=tt_market_beer_adj]': {
          borderRight: '1px solid #141414',
        },
        '&[col-id=*sustain]': {
          borderRight: '1px solid #141414',
        },
        '&[col-id*=ac], &[col-id*=organic_growth_vs_bu_mio], &[col-id=organic_growth_vs_bu], &[col-id=organic_growth_vs_ly_mio], &[col-id=py_ac], &[col-id=cy_bu]':
          {
            borderRight: '1px solid #14141414',
            '&.ag-cell-without-border': {
              borderRight: 'none',
            },
          },
        '&.ag-not-last-child-pnl': {
          borderRight: '1px solid white',
        },
      },
      '.ag-header-cell-kpi': {
        borderTopLeftRadius: '16px',
        borderLeft: '1px solid #14141414',
        borderTop: '1px solid #14141414',
      },
      '.ag-header-cell-tt-abi': {
        background: theme.colors.gray[50],
        color: 'white',
      },
      '.ag-header-cell-tt-market': {
        color: 'white',
        background: theme.colors.charts.bg.neutrals[60],

        '&.ag-header-cell-tt-market-volume-pages': {
          background: '#0000008f',
        },
      },
      '.ag-header-cell-megabrands': {
        background: theme.colors.charts.bg.categories.primary.yellow,
        '&.ag-header-cell-megabrands-volume-pages': {
          background: '#EBB400',
        },
      },
      '.ag-header-cell-expansion': {
        background: theme.colors.charts.bg.categories.primary.magenta,
        color: 'white',
        '&.ag-header-cell-expansion-volume-pages': {
          background: '#70C6FF',
          color: 'black',
        },
      },
      '.ag-header-cell-sustain': {
        background: theme.colors.charts.bg.categories.primary.blue,
        color: 'white',
        '&.ag-header-cell-sustain-volume-pages': {
          background: '#C9AF82',
          color: 'black',
        },
      },
      '.ag-header-cell-tail': {
        background: theme.colors.charts.bg.categories.primary.purple,
        color: 'white',
        borderTopRightRadius: '16px',
      },
      '.ag-header-cell-organic-growth': {
        borderTop: '1px solid #14141414',
      },
      '.ag-header-cell-period': {
        borderTop: '1px solid #14141414',
        borderRight: '1px solid #14141414',
        borderTopRightRadius: '16px',
      },
    },
  },

  '.ag-row': {
    '.ag-cell': {
      '&.ag-cell-last-of-group': {
        borderBottom: '1px solid #14141414',
      },
      '&.ag-cell-first-of-group': {
        borderTop: '1px solid #14141414',
      },
      '&.ag-column-first.ag-cell-last-of-group': {
        borderBottomLeftRadius: '16px',
      },
      '&.ag-column-first.ag-cell-first-of-group': {
        borderTopLeftRadius: '16px',
      },
      '&.ag-cell-first-row': {
        borderTopLeftRadius: '0 !important',
        borderTopRightRadius: '0 !important',
      },
      '&.ag-column-last.ag-cell-last-of-group': {
        borderBottomRightRadius: '16px',
      },
      '&.ag-column-last.ag-cell-first-of-group': {
        borderTopRightRadius: '16px',
      },
      '&.ag-column-first': {
        borderLeft: '1px solid #14141414',
        borderRight: '1px solid #141414',

        '&.ag-cell-kpi-with-refresh': {
          '.ag-cell-content': {
            justifyContent: 'flex-start',
            '.cell-subtitle': {
              fontSize: '10px',
              color: '#141414 !important',
            },
          },
        },
        '.ag-cell-content': {
          justifyContent: 'flex-start',
          '.cell-subtitle': {
            fontSize: '14px',
            color: theme.colors.txt.secondary + ' !important',
          },
        },
      },
      '&[col-id*=og_vs_ly], &.ag-last-child-pnl, &[col-id=organic_growth_vs_ly]':
        {
          borderRight: '1px solid #141414 !important',
        },
      '&[col-id*=tt_market_beer_adj], &[col-id=*sustain]': {
        borderRight: '1px solid #141414',
      },
      '&[col-id*=ac], &[col-id*=organic_growth_vs_bu_mio], &[col-id=organic_growth_vs_bu], &[col-id=organic_growth_vs_ly_mio], &[col-id=py_ac], &[col-id=cy_bu]':
        {
          borderRight: '1px solid #14141414',
          '&.ag-cell-without-border': {
            borderRight: 'none',
          },
        },

      '&.ag-cell-subheader-pnl': {
        fontWeight: 'bold',
        background: theme.colors.gray[20],
      },
      '&.ag-column-last, &.ag-not-last-child-pnl': {
        borderRight: '1px solid #14141414 !important',
      },

      '&.ag-cell-header-pnl': {
        color: 'white',
        background: theme.colors.gray[50],
        border: 'none !important',
      },
      '&.ag-cell-kpi-pnl': {
        fontWeight: 600,
        background: theme.colors.charts.bg.neutrals[20],
      },
    },
  },

  '.ag-horizontal-left-spacer': {
    overflowX: 'hidden !important',
  },
});
