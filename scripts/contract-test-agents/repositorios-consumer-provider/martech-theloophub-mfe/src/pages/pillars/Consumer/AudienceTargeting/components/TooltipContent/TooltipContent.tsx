import {
  StyledTooltipContainer,
  StyledTooltipContent,
  StyledTooltipHeader,
  StyledTooltipSubtitle,
  StyledTooltipText,
  StyledTooltipTitle,
} from './TooltipContent.styles';

interface TooltipContentProps {
  title: string;
  subtitle?: string;
  text?: string;
  paddingLeft?: boolean;
}

export const TooltipContent = ({
  title,
  subtitle,
  text,
  paddingLeft = true,
}: TooltipContentProps) => {
  return (
    <StyledTooltipContainer>
      <StyledTooltipHeader>
        <StyledTooltipTitle>{title}</StyledTooltipTitle>
      </StyledTooltipHeader>
      <StyledTooltipContent $paddingLeft={paddingLeft}>
        {subtitle && <StyledTooltipSubtitle>{subtitle}</StyledTooltipSubtitle>}
        {text && <StyledTooltipText>{text}</StyledTooltipText>}
      </StyledTooltipContent>
    </StyledTooltipContainer>
  );
};
