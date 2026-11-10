import { styled } from '@hexa-ui/theme';

// Global brands header styles
const generateHeaderBackgroundStyles = (color: string) => ({
  '.ag-header-cell-comp-wrapper': {
    borderRadius: '16px',
    border: '2px solid',
    borderColor: color,
    borderTopWidth: '16px',
    height: '64px',
  },
});

const headerBackgroundColors: Record<string, string> = {
  yellow: '#F4E89E',
  green: '#BBEBCF',
  pink: '#F9CBDD',
  blue: '#BBDCF7',
  orange: '#F3D79F',
};

const generateGlobalBrandsHeaderStyles = () => {
  return Object.entries(headerBackgroundColors).reduce(
    (acc, [key, color]) => {
      acc[`.ag-header-box-layout-${key}`] =
        generateHeaderBackgroundStyles(color);
      return acc;
    },
    {} as Record<string, any>,
  );
};

export const StyledPOSBookTableContainer = styled('div', {
  // Odd row background
  '.ag-row .ag-cell.ag-row-cell-odd': {
    background: '#1414140A',
  },

  '.ag-header-cell-label .ag-header-cell-icon-text': {
    height: '100% !important',
  },

  // Header styles
  '.ag-header-pos-book': {
    padding: '0 16px !important',
    display: 'flex',
    alignItems: 'flex-end',

    '.ag-header-cell-resize:after': {
      background: 'rgba(0,0,0,0)',
      height: '100%',
    },

    '.ag-header-cell-comp-wrapper': {
      height: '48px',
      border: '1px solid #1414141F',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      borderBottomLeftRadius: '4px',
      borderBottomRightRadius: '4px',
    },
  },

  // Header background colors
  '.ag-header-bg-secondary-black .ag-header-cell-comp-wrapper': {
    background: '#C9D1D6',
  },
  '.ag-header-bg-yellow .ag-header-cell-comp-wrapper': {
    background: '#F0DF78',
  },
  '.ag-header-bg-orange .ag-header-cell-comp-wrapper': {
    background: '#EEC879',
  },
  '.ag-header-bg-blue .ag-header-cell-comp-wrapper': {
    background: '#A1CFF4',
  },
  '.ag-header-bg-magenta .ag-header-cell-comp-wrapper': {
    background: '#F6B7D0',
  },
  '.ag-header-bg-green .ag-header-cell-comp-wrapper': {
    background: '#A1E3BC',
  },
  '.ag-header-bg-purple .ag-header-cell-comp-wrapper': {
    background: '#B5BDF7',
  },

  // Export styles
  '.ag-header-bg-export-gray .ag-header-cell-comp-wrapper': {
    background: '#CBCAC7',
  },
  '.ag-header-bg-export-yellow .ag-header-cell-comp-wrapper': {
    background: '#FDD349',
  },
  '.ag-header-bg-export-blue .ag-header-cell-comp-wrapper': {
    background: '#A8E0FF',
  },
  '.ag-header-bg-export-brown .ag-header-cell-comp-wrapper': {
    background: '#DAC8A9',
  },
  '.ag-header-bg-export-orange .ag-header-cell-comp-wrapper': {
    background: '#FFBA8F',
  },

  '.bold-text': {
    fontWeight: 'bold',
  },

  ...generateGlobalBrandsHeaderStyles(),

  // Cell styles
  '.ag-cell': {
    borderTop: 'none',
    borderRight: '1px solid #1414141F',

    '&.ag-column-first': {
      borderLeft: '1px solid #1414141F',
    },

    '&.ag-cell-first-of-group': {
      borderTop: '1px solid #1414141F',

      '&.ag-cell-first-merge': {
        borderBottom: '1px solid #1414141F',
        borderBottomLeftRadius: '8px',
      },
    },

    '&.ag-cell-last-of-group': {
      borderBottom: '1px solid #1414141F',
    },

    '&.ag-cell-first-of-group.ag-column-first': {
      borderTopLeftRadius: '8px',
    },

    '&.ag-cell-last-of-group.ag-column-first': {
      borderBottomLeftRadius: '8px',
    },

    '&.ag-cell-first-of-group.ag-column-last': {
      borderTopRightRadius: '8px',
    },

    '&.ag-cell-last-of-group.ag-column-last': {
      borderBottomRightRadius: '8px',
    },

    '&.ag-cell-merge-col': {
      borderBottom: '1px solid #1414141F',
      borderBottomLeftRadius: '8px',
    },

    '.ag-cell-content': {
      paddingLeft: '5px !important',
    },

    '&.ag-cell-first-row': {
      '&:first-child': {
        borderRight: 'none',
      },
    },

    '&.ag-cell-label-col': {
      '.ag-cell-content': {
        paddingLeft: '4px !important',
        paddingRight: '0 !important',
        fontWeight: 'bold',
      },

      '&.ag-zone-cell-label-col': {
        '.ag-cell-content': {
          transform: 'rotate(-90deg)',
        },
      },
    },

    '&.ag-cell-country-col .ag-cell-content': {
      paddingLeft: '0',
      paddingRight: '4px !important',
      justifyContent: 'flex-end !important',
    },

    '&.ag-manufacture-cell-country-col .ag-cell-content': {
      justifyContent: 'flex-end !important',
      paddingLeft: '0',
      paddingRight: '4px !important',
    },

    '&.ag-cohort-cell-label-col': {
      '.ag-cell-content': {
        justifyContent: 'flex-end !important',
        paddingRight: '4px !important',
      },
    },

    '&[col-id=other_competitors] [class*=Icon]': {
      display: 'none !important',
    },
  },

  '.ag-header-group-cell': {
    display: 'none',
  },

  '.ag-focus-managed': {
    border: 'none',
  },
});
