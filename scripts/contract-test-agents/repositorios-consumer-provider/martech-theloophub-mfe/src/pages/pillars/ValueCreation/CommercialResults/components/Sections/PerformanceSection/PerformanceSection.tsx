import { ContentCardWithBreadcrumb } from '../../ContentCardWithBreadcrumb';

interface PerformanceSectionProps {
  title: string;
  tooltip?: string;
  children: React.ReactNode;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  title,
  tooltip,
  children,
}) => (
  <ContentCardWithBreadcrumb
    title={title}
    tooltip={tooltip}
    data-testid="commercial-results-performance-section"
  >
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      data-testid="performance-section-children"
    >
      {children}
    </div>
  </ContentCardWithBreadcrumb>
);
