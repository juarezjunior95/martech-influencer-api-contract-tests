import {
  StyledHeaderContainer,
  StyledHeaderLegendsSlot,
  StyledHeaderTitleContainer,
  StyledHeaderTopRow,
} from './HeaderContainer.styles';

interface HeaderContainerProps {
  children: React.ReactNode;
  legends?: React.ReactNode;
  title: string;
  dataTestId?: string;
  showDivider?: boolean;
  noBorderBottom?: boolean;
}

export const HeaderContainer: React.FC<HeaderContainerProps> = ({
  children,
  legends,
  title,
  dataTestId,
  showDivider = false,
  noBorderBottom = false,
}) => {
  return (
    <StyledHeaderContainer data-testid={dataTestId} showDivider={showDivider}>
      <StyledHeaderTopRow noBorderBottom={noBorderBottom}>
        <StyledHeaderTitleContainer>{title}</StyledHeaderTitleContainer>
        {legends ? (
          <StyledHeaderLegendsSlot>{legends}</StyledHeaderLegendsSlot>
        ) : null}
      </StyledHeaderTopRow>
      <div>{children}</div>
    </StyledHeaderContainer>
  );
};
