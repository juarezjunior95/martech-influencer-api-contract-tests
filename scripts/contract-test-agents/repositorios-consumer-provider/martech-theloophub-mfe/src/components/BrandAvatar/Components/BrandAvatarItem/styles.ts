import { Avatar, Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledBrandAvatarContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

export const StyledAvatarWrapper = styled('div', {
  position: 'relative',
  marginBottom: '2px',
  padding: '4px',
});

export const StyledBrandAvatar = styled(Avatar, {
  div: {
    '&:hover': {
      background: 'none',
    },
  },
});

export const StyledFlagBadge = styled('div', {
  position: 'absolute',
  bottom: '0px',
  right: '0px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  overflow: 'hidden',

  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

export const StyledTitleContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

export const StyledTitle = styled(Paragraph, {
  color: '#5C5C5C !important',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '16px !important',
  textAlign: 'center !important',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
  maxWidth: '100%',
  flexShrink: 1,
  minWidth: 0,
});

export const StyledSubtitle = styled(Paragraph, {
  color: '#5C5C5C !important',
  fontSize: '10px',
  lineHeight: '10px !important',
  textAlign: 'center !important',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
  maxWidth: '100%',
  flexShrink: 1,
  minWidth: 0,
});
