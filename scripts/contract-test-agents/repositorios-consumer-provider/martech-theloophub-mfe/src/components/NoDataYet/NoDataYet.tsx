import { memo } from 'react';

import NoDataAvailable from 'assets/NoDataAvailable.svg';
import NoDataYetIcon from 'assets/NoDataYet.svg';

import { StyledEmptyState } from './NoDataYet.styles';

interface Props {
  title?: string;
  description?: string;
  fontSize?: 'basis' | 'large' | 'small';
  color?: 'primary' | 'secondary';
  size?: 'auto';
  dataTestId?: string;
  illustration?: 'noDataYet' | 'noDataAvailable';
}

const illustrationMap = {
  noDataYet: NoDataYetIcon,
  noDataAvailable: NoDataAvailable,
};

export const NoDataYet: React.FC<Props> = ({
  fontSize,
  color,
  title,
  description = 'Data not available',
  size,
  dataTestId,
  illustration = 'noDataAvailable',
}) => {
  return (
    <StyledEmptyState
      font={fontSize}
      color={color}
      size={size}
      data-testid={dataTestId ? `no-data-yet-${dataTestId}` : undefined}
      title={title}
      description={description}
      customIlustration={{
        alt: 'no data yet',
        height: '125px',
        src: illustrationMap[illustration],
        width: '125px',
      }}
    />
  );
};

export default memo(NoDataYet);
