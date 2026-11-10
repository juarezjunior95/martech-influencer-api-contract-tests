import {
  StyledCaptionContainer,
  StyledFlagImg,
  StyledLabelText,
} from './CaptionWithFlag.styles';

interface Props {
  flag?: string;
  label: string;
  flagSize?: number;
  boldLabel?: boolean;
  dataTestId?: string;
}

export const CaptionWithFlag: React.FC<Props> = ({
  flag,
  label,
  flagSize,
  boldLabel = false,
  dataTestId,
}) => {
  if (!flag && !label) return null;

  return (
    <StyledCaptionContainer
      className="caption-with-flag"
      data-testid={dataTestId ? `caption-with-flag-${dataTestId}` : undefined}
    >
      {label && (
        <StyledLabelText
          data-testid={
            dataTestId ? `caption-with-flag-label-${dataTestId}` : undefined
          }
          style={{ fontWeight: boldLabel ? 600 : 400 }}
        >
          {label}
        </StyledLabelText>
      )}
      {flag && label && (
        <StyledFlagImg
          $flagSize={flagSize}
          data-testid={
            dataTestId ? `caption-with-flag-img-${dataTestId}` : undefined
          }
          src={flag}
          alt={label}
        />
      )}
    </StyledCaptionContainer>
  );
};
