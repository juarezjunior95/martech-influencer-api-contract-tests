import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledCampaignTrackerTable = styled('div', {
  '.ag-center-cols-container': {
    position: 'relative',
  },
  '.ag-header': {
    maxHeight: '56px',
    minHeight: '56px !important',
    borderLef: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    '.ag-header-viewport': {
      borderTop: '1px solid #14141414 !important',
      borderBottom: '1px solid #14141414',
      '.ag-header-container': {
        width: 'auto !important',
      },
    },
    '.ag-header-row': {
      '.ag-header-group-cell': {
        borderRight: '1px solid #141414',
      },
      '&[col-id*=campaign_$]': {
        borderRight: 'none !important',
      },
      '.ag-header-cell': {
        background: 'white',
        color: '#141414',
        borderBottom: '1px solid #14141414',
        '&[col-id*=gantt]': {
          padding: '0 !important',
          borderBottom: 'none !important',
        },

        borderRight: '1px solid #14141414',

        '&.ag-column-last': {
          borderRight: 'none',
          borderTop: 'none',
          borderLeft: 'none',
        },

        '.ag-header-cell-icon-text': {
          wordBreak: 'keep-all',
          overflowWrap: 'normal',
        },
      },
      '.ag-header-cell-kpi': {
        borderTopLeftRadius: '16px',
        borderLeft: '1px solid #14141414',
        borderTop: '1px solid #14141414',
      },
    },
  },

  '.ag-row': {
    '&.row-hover': {
      '&:before': {
        display: 'initial',
      },
      '.ag-cell': {
        background: '#E5B61114 !important',
      },
    },
    '.ag-cell,.ag-full-width-row .ag-cell-wrapper.ag-row-group': {
      border: 'none !important',
    },
    '&.ag-row-last': {},
    '.ag-cell': {
      background: 'none !important',
      borderBottom: '1px solid #14141414',
      borderRight: '1px solid #14141414',
      fontSize: '14px',
      '.ag-cell-content': {
        padding: '0 !important',
      },

      '&.ag-cell-first-of-group': {
        borderTop: '1px solid #14141414',
      },
      '&[col-id=campaign]': {
        fontSize: '12px',
      },
      '&[col-id=brand]': {
        maxWidth: '96px',
        minWidth: '96px',
      },
      '&[col-id=campaign_$]': {
        borderRight: '1px solid transparent !important',
        backgroundColor: 'red',
      },
      '&[col-id*=gantt]': {
        '.ag-cell-content': {
          padding: 0,
        },
      },

      '&.ag-cell-first-row': {
        borderTopLeftRadius: '0 !important',
        borderTopRightRadius: '0 !important',
      },

      '&.ag-column-first': {
        borderLeft: '1px solid #14141414',
      },

      '&.ag-column-last': {
        borderRight: 'none !important',
      },
    },
  },

  '.ag-body-horizontal-scroll': {
    display: 'none !important',
  },

  '.ag-body-vertical-scroll': {
    width: '16px !important',
    minWidth: '16px !important',
    maxWidth: '16px !important',
    justifyContent: 'center !important',
    borderLeft: '1px solid #14141414',
    borderRight: '1px solid #14141414',
  },

  '.ag-body-vertical-scroll-viewport': {
    width: '8px !important',
    minWidth: '8px !important',
    maxWidth: '8px !important',
    scrollbarColor: 'initial',

    '&::-webkit-scrollbar': {
      width: '8px',
      background: 'transparent',
      position: 'absolute',
      zIndex: 10,
    },

    '&::-webkit-scrollbar-track': {
      background: '#1414140A',
      borderRadius: '512px',
    },

    '&::-webkit-scrollbar-thumb': {
      background: '#1414143D',
      borderRadius: '512px',
      transition: 'background 0.2s',
    },

    '&::-webkit-scrollbar-': {},
  },
});

export const StyledCampaignTrackerLegend = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  padding: '22px 24px',
  '.legend-item': {
    fontWeight: '600 !important',
  },
});

export const StyledCampaignTrackerContainer = styled('div', {
  border: `1px solid ${tokens.color.foundation.border.secondary}`,
  borderRadius: '16px',
  margin: '24px',
  '.table-container': {
    maxHeight: '452px !important',
  },
});

export const StyledCampaignTrackerHeading = styled('div', {
  padding: '24px 16px',
});
