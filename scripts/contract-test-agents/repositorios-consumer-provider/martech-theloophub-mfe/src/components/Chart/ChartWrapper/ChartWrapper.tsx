import { StyledChartWrapper } from './ChartWrapper.styles';

interface ChartWrapperProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  dataTestId?: string;
}

export const ChartWrapper = ({
  header,
  children,
  onClick,
  dataTestId,
}: ChartWrapperProps) => {
  const handleCLick = () => {
    if (!onClick) return;
    onClick();
  };

  return (
    <StyledChartWrapper
      onClick={handleCLick}
      data-testid={dataTestId}
      clickable={!!onClick}
    >
      {header && <div>{header}</div>}
      {children}
    </StyledChartWrapper>
  );
};
