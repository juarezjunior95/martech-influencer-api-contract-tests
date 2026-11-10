import { styled } from '@hexa-ui/theme';

export const StyledPnlBrandsVolumePagesSlideRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: '24px',

  '.ag-header': {
    '.ag-header-row': {
      '.ag-header-cell-tt-market.ag-header-cell-tt-market-volume-pages': {
        background: '#0000008f !important',
      },
      '.ag-header-cell-megabrands.ag-header-cell-megabrands-volume-pages': {
        background: '#EBB400 !important',
      },
      '.ag-header-cell-expansion.ag-header-cell-expansion-volume-pages': {
        background: '#70C6FF !important',
        color: 'black !important',
      },
      '.ag-header-cell-sustain.ag-header-cell-sustain-volume-pages': {
        background: '#C9AF82 !important',
        color: 'black !important',
      },
      '.ag-header-cell-tail.ag-header-cell-tail-volume-pages': {
        background: '#B5B4AF !important',
        color: 'black !important',
      },
    },
  },

  '.ag-header .ag-header-row .ag-header-cell': {
    background: '#0000008f !important',
    borderRight: '1px solid white !important',
  },

  '.ag-row .ag-cell.ag-last-child-pnl': {
    borderRight: '1px solid #00000029 !important',
  },

  '.ag-row .ag-cell.ag-cell-subheader-pnl': {
    background: '#00000014 !important',
  },

  '.ag-row .ag-cell.ag-cell-kpi-pnl': {
    background: '#0000000a !important',
  },

  '.legend-item-profit-loss-profit-loss-0 > div': {
    background: '#ABBFCB !important',
  },
  '.legend-item-profit-loss-profit-loss-1 > div': {
    background: '#D1A33C !important',
  },
});
