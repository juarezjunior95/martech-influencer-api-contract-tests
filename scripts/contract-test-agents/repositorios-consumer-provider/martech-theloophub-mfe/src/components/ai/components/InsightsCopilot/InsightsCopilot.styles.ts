import styled from '@emotion/styled';

import { Body } from '../organisms/Drawer/Drawer.styles';

export const StyledCopilotBody = styled(Body)`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
`;

export const StyledSidebarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
`;
