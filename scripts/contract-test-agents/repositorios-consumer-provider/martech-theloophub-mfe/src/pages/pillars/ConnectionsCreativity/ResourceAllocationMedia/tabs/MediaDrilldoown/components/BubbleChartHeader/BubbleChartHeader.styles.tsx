import { Icon } from '@hexa-ui/components2';
import { styled } from '@hexa-ui/theme';

export const StyledBubbleHeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  padding: '0 $2',
});

export const StyledBubbleHeaderFilters = styled('div', {
  display: 'flex',
  gap: '$2',
});

export const StyledBubbleHeaderTitle = styled('p', {
  fontWeight: 'bold',
  fontSize: '1rem',
  fontFamily: '$heading',
  margin: '0',
});

export const StyledBubbleHeaderMeasure = styled('span', {
  fontSize: '12px',
  fontWeight: '400',
  fontFamily: '$paragraph',
  color: 'rgba(20, 20, 20, 0.56)',
});

export const StyledBubbleHeaderTextBox = styled('p', {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const StyledIconInfo = styled(Icon, {
  color: '#5C5C5C',
  marginLeft: '4px',
});
