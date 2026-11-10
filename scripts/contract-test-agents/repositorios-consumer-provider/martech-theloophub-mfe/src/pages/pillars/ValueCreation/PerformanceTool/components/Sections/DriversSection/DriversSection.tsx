import { ContentCard } from 'components';

import { EmptySection } from '../BrandPowerDrivers/EmptySection';

interface DriversSectionProps {
  title: string;
  tooltip?: string;
}

export const DriversSection: React.FC<DriversSectionProps> = ({
  title,
  tooltip,
}) => {
  return (
    <ContentCard fullWidth title={title} tooltip={tooltip}>
      <EmptySection />
    </ContentCard>
  );
};
