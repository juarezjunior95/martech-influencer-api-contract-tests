import { Button } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import ExportFileIcon from 'assets/icons/export-file.svg';

export const StyledExportPageContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  marginTop: '24px',
  paddingTop: '5px',
  position: 'relative',
  flex: 1,

  variants: {
    noMargin: {
      true: {
        marginTop: '0',
      },
    },
  },
});

export const StyledExportPageHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
  position: 'relative',
});

export const StyledExportPageSection = styled('div', {
  width: '1668px',
  minHeight: '938px',

  '.ag-header-cell-tooltip-icon, .ag-cell-content .tooltip-icon': {
    display: 'none !important',
  },
});

export const StyledExportHoverContainer = styled('div', {
  position: 'relative',
  '& [data-copy-action="true"]': {
    opacity: 0,
    pointerEvents: 'none',
  },
  '&:hover [data-copy-action="true"]': {
    opacity: 1,
    pointerEvents: 'auto',
  },
});

export const StyledExportCenterCopyButton = styled('button', {
  position: 'absolute',
  left: '60%',
  top: '15px',
  width: '36px',
  height: '36px',
  borderRadius: '9999px',
  border: '1px solid rgb(76, 73, 73)',
  backgroundColor: '#FFFFFF',
  color: '#5C5C5C',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 2,
  transition: 'opacity 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',

  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.7,
  },
});

export const StyledExportIcon = styled('div', {
  height: '80%',
  width: '80%',
  background: 'transparent',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundImage: `url(${ExportFileIcon})`,
  backgroundSize: 'cover',
});

export const StyledExportButton = styled(Button, {
  width: 'fit-content',
});
