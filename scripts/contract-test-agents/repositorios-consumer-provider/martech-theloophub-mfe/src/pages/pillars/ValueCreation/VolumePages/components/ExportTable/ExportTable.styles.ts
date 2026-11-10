import { styled } from '@hexa-ui/theme';
import ArrowCurvedRight from 'assets/icons/arrow-curved-right.svg';
import Crown from 'assets/icons/crown.svg';

export const StyledExportTable = styled('div', {
  border: '1px solid #E8E8E8',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: '#ffffff',

  '.ag-header': {
    '.ag-header-row': {
      '.ag-header-cell': {
        borderBottom: '1px solid #EDEDED',
        borderRight: '1px solid #EDEDED',
        '.ag-header-cell-label': {
          flexDirection: 'row',
        },

        '.ag-header-cell-text': {
          fontSize: '16px',
          color: '#67665F',
          fontFamily: 'Barlow',
        },

        '.ag-header-cell-subtext': {
          fontSize: '10px',
          color: '#67665F',
          marginTop: '5px',
        },
      },

      '.ag-column-first .ag-header-cell-label': {
        justifyContent: 'center',
      },

      '.ag-column-first': {
        borderTopLeftRadius: '16px',
      },
      '.ag-column-last': {
        borderTopRightRadius: '16px',
      },
    },
  },

  '.ag-row': {
    '.ag-cell': {
      borderRight: '1px solid #EDEDED',

      '&.ag-column-first': {
        '.ag-cell-content': {
          fontSize: '20px',
          fontFamily: 'Barlow',
        },

        '&.beyond-beer': {
          '.ag-cell-content': {
            fontSize: '16px',
          },
        },
      },

      '&.ag-column-last': {
        borderRight: 'none',
      },

      '&.ag-row-cell-odd': {
        backgroundColor: '#1414140a',
      },

      '&.ag-cell-last-of-group.ag-column-first': {
        borderBottomLeftRadius: '16px',
      },
      '&.ag-cell-last-of-group.ag-column-last': {
        borderBottomRightRadius: '16px',
      },

      '&.aggregated': {
        color: '#5C5C5C',
      },

      '&.total': {
        color: '#0D0D0C',
        backgroundColor: '#F0F9FF',
      },

      '&.text-align-left': {
        '.ag-cell-content': {
          justifyContent: 'flex-start',
        },
      },

      '&.text-align-left.aggregated': {
        '.ag-cell-content': {
          paddingLeft: '28px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',

          '&::before': {
            content: '""',
            display: 'inline-block',
            width: '8px',
            height: '8px',
            backgroundImage: `url(${ArrowCurvedRight})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            flexShrink: 0,
          },
        },
      },

      '.ag-cell-content': {
        fontSize: '16px',
      },

      '&.ag-cell-megabrands': {
        borderLeft: 0,
        color: '#0D0D0C',
        background:
          'linear-gradient(90deg, rgba(255, 222, 112, 0.48) 0%, rgba(255, 255, 255, 0.48) 100%)',

        '&::before': {
          position: 'absolute',
          top: 0,
          left: 0,
          content: '""',
          display: 'inline-block',
          width: '40px',
          height: '100%',
          background: `url(${Crown}) left center / cover no-repeat`,
        },
      },
      '&.ag-cell-expansion': {
        borderLeft: 0,
        color: '#0D0D0C',
        background:
          'linear-gradient(90deg, rgba(112, 198, 255, 0.48) 0%, rgba(255, 255, 255, 0.48) 100%)',
      },
      '&.ag-cell-sustain': {
        borderLeft: 0,
        color: '#0D0D0C',
        background:
          'linear-gradient(90deg, rgba(218, 200, 169, 0.48) 0%, rgba(255, 255, 255, 0.48) 100%)',
      },
      '&.ag-cell-tail': {
        borderLeft: 0,
        color: '#0D0D0C',
        background:
          'linear-gradient(90deg, rgba(216, 215, 212, 0.48) 0%, rgba(255, 255, 255, 0.48) 100%)',
      },
    },
  },
});
