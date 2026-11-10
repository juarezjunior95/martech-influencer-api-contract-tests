import { useCallback } from 'react';

const useThrowError = () => {
  return useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    throw errorObj;
  }, []);
};

// ✅ Component to trigger errors for testing ErrorBoundary
export const ErrorTrigger: React.FC<{
  type?: 'render' | 'async' | 'event';
  dataTestId?: string;
}> = ({ type = 'render', dataTestId }) => {
  const throwError = useThrowError();

  const triggerRenderError = () => {
    throw new Error('Test render error from ErrorTrigger');
  };

  const triggerAsyncError = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('Test async error from ErrorTrigger');
  };

  const triggerEventError = () => {
    throwError(new Error('Test event error from ErrorTrigger'));
  };

  if (type === 'render') {
    return triggerRenderError();
  }

  return (
    <div
      data-testid={dataTestId ? `error-trigger-${dataTestId}` : undefined}
      style={{ padding: '20px' }}
    >
      <h3
        data-testid={
          dataTestId ? `error-trigger-title-${dataTestId}` : undefined
        }
      >
        Error Boundary Test
      </h3>
      <div
        data-testid={
          dataTestId ? `error-trigger-buttons-${dataTestId}` : undefined
        }
        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
      >
        <button
          data-testid={
            dataTestId ? `error-trigger-button-event-${dataTestId}` : undefined
          }
          onClick={triggerEventError}
        >
          Trigger Event Error
        </button>
        <button
          data-testid={
            dataTestId ? `error-trigger-button-async-${dataTestId}` : undefined
          }
          onClick={triggerAsyncError}
        >
          Trigger Async Error
        </button>
        <button
          data-testid={
            dataTestId
              ? `error-trigger-button-immediate-${dataTestId}`
              : undefined
          }
          onClick={() => {
            throw new Error('Immediate error from button');
          }}
        >
          Trigger Immediate Error
        </button>
      </div>
    </div>
  );
};
