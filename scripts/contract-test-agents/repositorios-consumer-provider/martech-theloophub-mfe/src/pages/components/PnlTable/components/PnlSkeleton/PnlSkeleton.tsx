import React from 'react';

import { SkeletonLoader } from '@hexa-ui/components';

interface PnlSkeletonProps {
  divided?: boolean;
  dataTestId?: string;
  isExportPage?: boolean;
}

export const PnlSkeleton: React.FC<PnlSkeletonProps> = ({
  divided = false,
  dataTestId,
  isExportPage,
}) => {
  if (isExportPage) {
    return <SkeletonLoader width="100%" height="762px" variant="body" />;
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      data-testid={dataTestId || 'skeleton'}
    >
      <SkeletonLoader height="484px" variant="body" width="100%" />
      <SkeletonLoader height="36px" variant="body" width="100%" />
      <SkeletonLoader height="36px" variant="body" width="100%" />
      {!divided && (
        <>
          <SkeletonLoader height="176px" variant="body" width="100%" />
          <SkeletonLoader height="248px" variant="body" width="100%" />
        </>
      )}
    </div>
  );
};
