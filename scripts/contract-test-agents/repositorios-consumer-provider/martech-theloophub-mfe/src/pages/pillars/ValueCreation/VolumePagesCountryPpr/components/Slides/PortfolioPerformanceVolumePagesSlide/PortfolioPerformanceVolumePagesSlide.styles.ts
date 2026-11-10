import { styled } from '@hexa-ui/theme';

export const StyledPortfolioPerformanceVolumePagesSlideRoot = styled('div', {
  height: '790px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: '24px',
  padding: '32px',
  backgroundColor: 'white',
  borderRadius: '24px',
  border: '1px solid #00000014',

  '.table-container': {
    '.ag-header .ag-header-group-cell .ag-header-cell-icon-text': {
      fontSize: '20px !important',
      fontFamily: 'Barlow !important',
    },

    '.ag-header .ag-header-container': {
      borderRadius: '16px 16px 4px 4px !important',
    },

    '.ag-header-cell-subtext': {
      display: 'none !important',
    },

    '.ag-header .ag-header-row .ag-header-cell-resize::after': {
      height: '100% !important',
    },

    '.ag-header .ag-header-row .ag-header-cell-portfolio': {
      width: '236px !important',
      fontSize: '20px !important',
      fontFamily: '$heading',
      fontWeight: '600 !important',

      '.ag-header-cell-resize': {
        display: 'none !important',
      },
    },

    '.ag-row > .ag-cell.ag-cell-megabrands': {
      fontSize: '20px !important',
      fontFamily: '$heading',
      fontWeight: '600 !important',
      width: '236px !important',
      background:
        'linear-gradient(90deg, rgba(235, 180, 0, 0.64) 0%, rgba(255, 222, 112, 0.64) 100%)',
      border: 'none !important',
    },

    '.ag-row > .ag-cell.ag-cell-expansion': {
      fontSize: '20px !important',
      fontWeight: '600 !important',
      fontFamily: '$heading',
      width: '198px !important',
      left: '36px !important',
      background:
        'linear-gradient(90deg, rgba(112, 198, 255, 0.64) 0%, rgba(168, 224, 255, 0.41) 100%)',
      border: 'none !important',
      color: 'black !important',
    },

    '.ag-row > .ag-cell.ag-cell-sustain': {
      fontSize: '20px !important',
      fontWeight: '600 !important',
      fontFamily: '$heading',
      width: '152px !important',
      left: '84px !important',
      background:
        'linear-gradient(90deg, rgba(201, 175, 130, 0.64) 0%, rgba(226, 212, 187, 0.41) 100%)',
      border: 'none !important',
      color: 'black !important',
    },

    '.ag-row > .ag-cell.ag-cell-tail': {
      fontSize: '20px !important',
      fontWeight: '600 !important',
      fontFamily: '$heading',
      width: '114px !important',
      left: '120px !important',
      background:
        'linear-gradient(90deg, rgba(181, 180, 175, 0.64) 0%, rgba(216, 215, 212, 0.41) 100%)',
      border: 'none !important',
      color: 'black !important',
    },

    '.ag-row > .ag-cell.ag-cell-total': {
      fontSize: '20px !important',
      fontWeight: '600 !important',
      fontFamily: '$heading',
      width: '236px !important',
      left: '0px !important',
      borderRadius: '4px 4px 16px 16px',
      color: 'black !important',
      margin: '0px !important',
    },

    '.ag-row .ag-cell.ag-cell-first-row.ag-column-first': {
      borderTopLeftRadius: '4px !important',
    },

    '.ag-row .ag-cell.ag-cell-first-row.ag-column-last': {
      borderTopRightRadius: '4px !important',
    },

    '.ag-row .ag-cell.ag-cell-last-of-group.ag-column-first': {
      borderBottomLeftRadius: '4px !important',
      '&.ag-cell-last-row, &[col-id="brands_vol_og_vs_ly"]': {
        borderBottomLeftRadius: '16px !important',
      },
    },

    '.ag-row .ag-cell.ag-cell-last-of-group.ag-column-last': {
      borderBottomRightRadius: '4px !important',
      '&.ag-cell-last-row, &[col-id="brands_vol_og_vs_ly"]': {
        borderBottomRightRadius: '16px !important',
      },
    },
  },
});
