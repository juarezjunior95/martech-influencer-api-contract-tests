import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

const GRADIENT =
  'linear-gradient(216.66deg, rgba(245, 224, 3, 0.8) 0%, rgba(211, 162, 56, 0.8) 75%)';

const txtDefault = tokens.color.foundation.txt.default;
const txtSecondary = tokens.color.foundation.txt.secondary;
const bgSurface = tokens.color.foundation.bg['primary-clear'];
const borderSubtle = tokens.color.foundation.border.tertiary;
const borderItem = tokens.color.foundation.border.secondary;

export const StyledContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: 'rgba(245, 245, 244, 1)',
  borderTop: '8px solid transparent',
  borderImageSource: GRADIENT,
  borderImageSlice: 1,
});

export const StyledContent = styled('div', {
  flex: '1 1 auto',
  width: '100%',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const StyledTitle = styled('h2', {
  fontFamily: '$heading',
  fontSize: '24px',
  fontWeight: 700,
  color: txtDefault,
  lineHeight: '140%',
  letterSpacing: 0,
  margin: 0,
});

export const StyledStacked = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: bgSurface,
  borderRadius: '16px',
  border: `1px solid ${borderSubtle}`,
  overflow: 'hidden',
});

export const StyledStackedItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '16px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: borderItem,
  '&:first-child': {
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
  },
  '&:last-child': {
    borderBottomLeftRadius: '15px',
    borderBottomRightRadius: '15px',
  },
  '& + &': {
    marginTop: '-1px',
  },
});

export const StyledItemHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
  minWidth: 0,
});

export const StyledItemTitle = styled('span', {
  fontFamily: '$paragraph',
  fontSize: '18px',
  fontWeight: 700,
  color: txtDefault,
  lineHeight: '140%',
  letterSpacing: 0,
});

export const StyledItemDescription = styled('span', {
  fontFamily: '$paragraph',
  fontSize: '16px',
  fontWeight: 400,
  color: txtSecondary,
  lineHeight: '140%',
  letterSpacing: 0,
});

export const StyledItemPage = styled('span', {
  fontFamily: '$paragraph',
  fontSize: '16px',
  fontWeight: 400,
  color: txtDefault,
  lineHeight: '140%',
  letterSpacing: 0,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  flexShrink: 0,
});

export const StyledGrid = styled('div', {
  display: 'grid',
  gap: '12px',
});

export const StyledCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: bgSurface,
  borderRadius: '8px',
  border: `1px solid ${borderSubtle}`,
  overflow: 'hidden',
});

export const StyledCardHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '12px',
});

export const StyledDivider = styled('div', {
  width: '100%',
  height: '2px',
  background: GRADIENT,
  flexShrink: 0,
});

export const StyledCardHeaderLeft = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
  minWidth: 0,
});

export const StyledCardSubItems = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const StyledCardSubItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
});

export const StyledSubItemLabel = styled('span', {
  fontFamily: '$paragraph',
  fontSize: '16px',
  fontWeight: 700,
  color: txtDefault,
  lineHeight: '140%',
  letterSpacing: 0,
});

export const StyledFlag = styled('img', {
  width: '24px',
  height: '24px',
  minWidth: '24px',
  minHeight: '24px',
  borderRadius: '50%',
  objectFit: 'cover',
});

export const StyledIconWrapper = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});
