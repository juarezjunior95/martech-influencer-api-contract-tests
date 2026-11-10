import styled from '@emotion/styled';

export const StyledAudienceWithBrandVolumeWrapper = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  gap: '8px',
  alignItems: 'stretch',
  width: '364px',
  height: '82px',
});

export const StyledAudienceDemographicsHorizontal = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  justifyContent: 'center',
});

export const StyledAudienceRow = styled('div')({
  display: 'flex',
  gap: '8px',
  alignItems: 'baseline',
  fontSize: '16px',
  fontFamily: 'Inter, sans-serif',
  lineHeight: '20px',
  flexWrap: 'nowrap',
  whiteSpace: 'nowrap',
});

export const StyledAudienceLabel = styled('span')({
  fontWeight: '400',
  color: '#6B7280',
  fontSize: '16px',
  lineHeight: '20px',
  whiteSpace: 'nowrap',
});

export const StyledAudienceValue = styled('span')({
  fontWeight: '500',
  color: '#141414',
  fontSize: '16px',
  lineHeight: '20px',
  whiteSpace: 'nowrap',
});
