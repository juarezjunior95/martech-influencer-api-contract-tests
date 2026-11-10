import { Skeleton } from 'components/Skeleton';

import {
  StyledPageHeader,
  StyledPageHeaderTitle,
  StyledPageSubtitle,
} from './PageHeader.styles';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
}
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  loading = false,
}) => {
  const showSubtitleRow = loading || subtitle;

  return (
    <StyledPageHeader data-testid="page-header" className="page-header">
      {loading ? (
        <Skeleton width="400px" height="40px" length={1} borderRadius="large" />
      ) : (
        <StyledPageHeaderTitle className="title" size="H1">
          {title}
        </StyledPageHeaderTitle>
      )}

      {showSubtitleRow &&
        (loading ? (
          <Skeleton
            width="500px"
            height="24px"
            length={1}
            borderRadius="large"
          />
        ) : (
          <StyledPageSubtitle>{subtitle}</StyledPageSubtitle>
        ))}
    </StyledPageHeader>
  );
};
