import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

const StyledListContainer = styled('ul', {
  gap: '10px',
  display: 'flex',
  alignItems: 'center',
  padding: '0',
  width: 'fit-content',
  margin: 0,
});

const StyledSeparator = styled('div', {
  width: '1px',
  height: '15px',
  backgroundColor: '#ADADAD',
  transform: 'rotate(15deg)',
});

const navigationPageNameStyles = {
  listStyle: 'none',
  padding: '5px 0',
  overflow: 'hidden',
  position: 'relative',
  transition: '0.2s ease-in-out',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 4,
    left: 0,
    width: '100%',
    height: '1px',
    opacity: 0,
    transform: 'translateX(-100%)',
    backgroundColor: '#141414',
    transition: '0.4s ease-in-out',
  },

  '&:hover': {
    '> a': { color: '#141414', fontWeight: '$medium' },

    '&::after': { opacity: 1, transform: 'translateX(0)' },
  },

  '&:is(button):hover': { color: '#141414', fontWeight: 'bold' },

  '> a': {
    color: '#5C5C5C',
    fontFamily: '$paragraph',
    textDecoration: 'none',
    fontWeight: 'normal',
    fontSize: '$2',
  },
};

const StyledNavigationHomePageIcon = styled('li', {
  ...navigationPageNameStyles,

  padding: '0',

  '> a::after': { bottom: '3px' },
});

const StyledNavigationPageName = styled('li', navigationPageNameStyles);

const StyledCurrentPageName = styled(Paragraph, {
  color: '#141414 !important',
  fontWeight: '$medium !important',
  fontSize: '$2 !important',
});

const StyledEllipsis = styled('button', {
  ...navigationPageNameStyles,

  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px 4px',
});

export {
  StyledCurrentPageName,
  StyledEllipsis,
  StyledListContainer,
  StyledNavigationHomePageIcon,
  StyledNavigationPageName,
  StyledSeparator,
};
