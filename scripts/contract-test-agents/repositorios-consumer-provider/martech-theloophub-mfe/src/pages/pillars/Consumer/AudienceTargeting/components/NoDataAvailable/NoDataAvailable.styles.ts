import styled from '@emotion/styled';
import { theme } from 'theme';

const NO_DATA_CONTENT_MAX_WIDTH = '512px';
const NO_DATA_ICON_SIZE = '200px';

export const StyledNoDataCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 16px;
  border: 1px solid ${theme.colors.txt.default}14;
  background-color: ${theme.colors.specificProperty.noDataBackground};
  padding: 48px 40px;
  width: 100%;
  min-height: 525px;
  box-sizing: border-box;
`;

export const StyledNoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  flex: 1;
`;

export const StyledIconWrapper = styled.div`
  img {
    width: ${NO_DATA_ICON_SIZE};
    height: ${NO_DATA_ICON_SIZE};
  }
`;

export const StyledTitle = styled.p`
  font-family: Barlow, sans-serif;
  font-size: 24px;
  font-weight: 600;
  font-style: normal;
  line-height: 120%;
  letter-spacing: 0px;
  text-align: center;
  color: ${theme.colors.txt.default};
  margin: 0;
`;

export const StyledDescription = styled.p`
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  line-height: 140%;
  letter-spacing: 0px;
  text-align: center;
  color: ${theme.colors.txt.secondary};
  margin: 0;
  max-width: ${NO_DATA_CONTENT_MAX_WIDTH};
`;

export const StyledActionsWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 0;
  width: ${NO_DATA_CONTENT_MAX_WIDTH};
  justify-content: center;

  button {
    height: 40px;
    padding: 0 16px;
    border-radius: 100px;
    border: 1px solid ${theme.colors.txt.default};
    background: ${theme.colors.txt.on.informative.default};
    font-family: 'Work Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    color: ${theme.colors.txt.default};
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover {
      background: ${theme.colors.txt.default}0a;
    }

    &[data-variant='primary'] {
      background: ${theme.colors.txt.default};
      color: ${theme.colors.txt.on.informative.default};

      &:hover {
        background: ${theme.colors.txt.default}cc;
      }
    }
  }
`;
