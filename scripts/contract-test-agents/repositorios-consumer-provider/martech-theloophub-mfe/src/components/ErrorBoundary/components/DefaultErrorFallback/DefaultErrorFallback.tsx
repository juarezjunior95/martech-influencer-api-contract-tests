import { useCallback } from 'react';

import { useEnvService } from 'admin-portal-shared-services';
import { ErrorContainer } from 'components';

import { ErrorDetails } from '../ErrorDetails/ErrorDetails';
import {
  StyledErrorFallback,
  StyledErrorId,
} from './DefaultErrorFallback.styles';

export const DefaultErrorFallback: React.FC<{
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
  resetError?: () => void;
  isReseting?: boolean;
  reloadPage?: () => void;
  errorId?: string | null;
  title?: string;
  message?: string;
  dataTestId?: string;
}> = ({
  error,
  errorInfo,
  resetError,
  isReseting,
  reloadPage,
  errorId,
  title = 'Ooops! Something went wrong',
  message = "We're sorry for the inconvenience. Please try again.",
  dataTestId,
}) => {
  const isDevelopment = useEnvService().getEnv() !== 'PROD';

  const handleReset = useCallback(() => {
    if (!resetError) return;

    resetError();
  }, [resetError]);

  return (
    <StyledErrorFallback
      data-testid={dataTestId ? `error-fallback-${dataTestId}` : undefined}
    >
      <ErrorContainer
        title={title}
        message={message}
        actions
        actionOne="Try Again"
        handleActionOne={handleReset}
        isLoadingOne={isReseting}
        actionTwo="Reload Page"
        handleActionTwo={reloadPage}
        dataTestId={dataTestId ? `${dataTestId}-error-container` : undefined}
      />

      {errorId && (
        <StyledErrorId
          data-testid={dataTestId ? `${dataTestId}-error-id` : undefined}
        >
          Error ID: {errorId}
        </StyledErrorId>
      )}

      {/* Only development environments */}
      {isDevelopment && error && (
        <ErrorDetails
          dataTestId={dataTestId ? `${dataTestId}-error-details` : undefined}
          error={error}
          errorInfo={errorInfo}
        />
      )}
    </StyledErrorFallback>
  );
};
