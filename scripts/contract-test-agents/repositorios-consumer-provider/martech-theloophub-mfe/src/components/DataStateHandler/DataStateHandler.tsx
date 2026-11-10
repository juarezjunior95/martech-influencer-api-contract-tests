// DataStateHandler.tsx
import { Skeleton } from 'components';
import NoDataYet from 'components/NoDataYet/NoDataYet';

import { StyledDataStateHandlerEmpty } from './DataStateHandler.styles';

interface DataStateHandlerProps {
  loading: boolean;
  error?: any;
  empty: boolean;
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
  children: React.ReactNode;
  dataTestId?: string;
  message?: {
    title?: string;
    description?: string;
  };
}

export const DataStateHandler = ({
  loading,
  error,
  empty,
  skeletonProps,
  children,
  dataTestId,
  message,
}: DataStateHandlerProps) => {
  if (loading) {
    return (
      <Skeleton
        {...(skeletonProps || {
          width: '100%',
          height: '100%',
          length: 1,
        })}
        data-testid={
          dataTestId ? `data-state-handler-skeleton-${dataTestId}` : undefined
        }
      />
    );
  }

  if (error) {
    return (
      <StyledDataStateHandlerEmpty
        data-testid={
          dataTestId ? `data-state-handler-${dataTestId}` : undefined
        }
      >
        <NoDataYet
          title={message?.title || 'An error occurred'}
          description={message?.description || 'Please try again later.'}
          dataTestId={dataTestId ? `${dataTestId}-error` : undefined}
        />
      </StyledDataStateHandlerEmpty>
    );
  }

  if (empty) {
    return (
      <StyledDataStateHandlerEmpty
        data-testid={
          dataTestId ? `data-state-handler-${dataTestId}` : undefined
        }
      >
        <NoDataYet
          title={message?.title || null}
          description={message?.description || null}
          dataTestId={dataTestId ? `${dataTestId}-empty` : undefined}
        />
      </StyledDataStateHandlerEmpty>
    );
  }

  return <>{children}</>;
};
