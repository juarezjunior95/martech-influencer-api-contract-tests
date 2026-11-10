import React from 'react';

import { Paragraph } from '@hexa-ui/components';

import {
  StyledFooterItems,
  StyledFootnotesContent,
  StyledFootnotesText,
  StyledHorizontalDivider,
} from './Footer.styles';

export interface FooterProps {
  footnotes?: JSX.Element | string;
  page?: number;
}

export const Footer: React.FC<FooterProps> = ({ footnotes, page }) => {
  return (
    <div style={{ paddingTop: '16px', marginTop: 'auto' }} data-footer>
      <StyledHorizontalDivider />
      <StyledFooterItems>
        <StyledFootnotesText>
          Footnotes:{' '}
          <StyledFootnotesContent>{footnotes}</StyledFootnotesContent>
        </StyledFootnotesText>
        {!!page && <Paragraph size="small">{page}</Paragraph>}
      </StyledFooterItems>
    </div>
  );
};
