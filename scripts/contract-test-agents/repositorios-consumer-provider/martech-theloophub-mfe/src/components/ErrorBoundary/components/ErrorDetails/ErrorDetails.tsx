import { Paragraph } from '@hexa-ui/components';

import {
  StyledErrorDetails,
  StyledErrorMessage,
  StyledErrorMessageContainer,
  StyledErrorSummary,
  StyledPre,
} from './ErrorDetails.styles';

interface ErrorDetailsProps {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
  dataTestId?: string;
}

export const ErrorDetails: React.FC<ErrorDetailsProps> = ({
  error,
  errorInfo,
  dataTestId,
}: ErrorDetailsProps) => {
  return (
    <StyledErrorDetails
      data-testid={dataTestId ? `error-details-${dataTestId}` : undefined}
    >
      <StyledErrorSummary
        data-testid={
          dataTestId ? `error-details-summary-${dataTestId}` : undefined
        }
      >
        <Paragraph
          data-testid={
            dataTestId ? `error-details-summary-text-${dataTestId}` : undefined
          }
          style={{ display: 'inline' }}
        >
          Show Error Details
        </Paragraph>
      </StyledErrorSummary>

      {error?.message && (
        <StyledErrorMessageContainer
          data-testid={
            dataTestId
              ? `error-details-message-container-${dataTestId}`
              : undefined
          }
        >
          <StyledErrorMessage
            data-testid={
              dataTestId ? `error-details-message-${dataTestId}` : undefined
            }
          >
            <Paragraph
              data-testid={
                dataTestId
                  ? `error-details-message-text-${dataTestId}`
                  : undefined
              }
            >
              Error Message:
            </Paragraph>
          </StyledErrorMessage>
          <StyledPre
            data-testid={
              dataTestId
                ? `error-details-message-text-${dataTestId}`
                : undefined
            }
          >
            {error.message}
          </StyledPre>
        </StyledErrorMessageContainer>
      )}

      {error.stack && (
        <StyledErrorMessageContainer
          data-testid={
            dataTestId
              ? `error-details-message-container-${dataTestId}`
              : undefined
          }
        >
          <StyledErrorMessage
            data-testid={
              dataTestId ? `error-details-message-${dataTestId}` : undefined
            }
            color="red"
          >
            <Paragraph
              data-testid={
                dataTestId
                  ? `error-details-message-text-${dataTestId}`
                  : undefined
              }
            >
              Stack Trace:
            </Paragraph>
          </StyledErrorMessage>
          <StyledPre
            data-testid={
              dataTestId
                ? `error-details-message-text-${dataTestId}`
                : undefined
            }
          >
            {error.stack}
          </StyledPre>
        </StyledErrorMessageContainer>
      )}

      {errorInfo?.componentStack && (
        <StyledErrorMessageContainer
          data-testid={
            dataTestId
              ? `error-details-message-container-${dataTestId}`
              : undefined
          }
        >
          <StyledErrorMessage
            data-testid={
              dataTestId ? `error-details-message-${dataTestId}` : undefined
            }
            color="blue"
          >
            <Paragraph
              data-testid={
                dataTestId
                  ? `error-details-message-text-${dataTestId}`
                  : undefined
              }
            >
              Component Stack:
            </Paragraph>
          </StyledErrorMessage>
          <StyledPre
            data-testid={
              dataTestId
                ? `error-details-message-text-${dataTestId}`
                : undefined
            }
          >
            {errorInfo.componentStack}
          </StyledPre>
        </StyledErrorMessageContainer>
      )}
    </StyledErrorDetails>
  );
};
