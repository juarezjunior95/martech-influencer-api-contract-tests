import styled from '@emotion/styled';

import { TABLE_COLORS } from '../../styles/colors';
import { TABLE_BORDER_RADIUS, TABLE_SPACING } from '../../styles/spacing';

export const FooterContainer = styled.div`
  width: 100%;
  min-width: 720px;
  max-height: 152px;
  background-color: ${TABLE_COLORS.background.primary};
  border: 1px solid ${TABLE_COLORS.border.header};
  border-radius: ${TABLE_BORDER_RADIUS.footer.default};
  padding: ${TABLE_SPACING.section.padding};
`;
