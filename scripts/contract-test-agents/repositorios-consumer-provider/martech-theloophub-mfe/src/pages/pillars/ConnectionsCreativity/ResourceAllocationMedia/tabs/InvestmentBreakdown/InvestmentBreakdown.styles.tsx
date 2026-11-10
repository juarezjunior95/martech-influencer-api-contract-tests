import { styled } from '@hexa-ui/theme';

export const StyledNoDataYetContent = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const BrandsCellNoBorder = styled('div', {
  ".ag-center-cols-container .ag-cell[col-id='brands']": {
    borderTop: 'none !important',
    borderBottom: 'none !important',
  },
});
