import { Link } from 'react-router-dom';

import { styled } from '@hexa-ui/theme';

const linkStyle = {
  fontFamily: '$paragraph',
  fontWeight: 'normal',
  textDecoration: 'underline',
  fontSize: '$3',
  lineHeight: '$3',
  color: '$semanticInfoText',
};

export const StyledLink = styled(Link, linkStyle);

export const StyledLinkA = styled('a', linkStyle);
