import { memo } from 'react';

import { MarkdownRenderer } from '../../atoms/MarkdownRenderer';
import { SkeletonLoader } from '../../atoms/SkeletonLoader';
import {
  Connector,
  Gutter,
  ItemContent,
  ItemRow,
  Marker,
  SkeletonWrapper,
} from './ExecutionLog.styles';

interface TimelineItemProps {
  content: string;
  nodeType: string;
  status: 'streaming' | 'complete';
  isLast?: boolean;
  showSkeleton?: boolean;
}

export const TimelineItem = memo(function TimelineItem({
  content,
  nodeType,
  status,
  isLast = false,
  showSkeleton = false,
}: TimelineItemProps) {
  return (
    <ItemRow data-testid={`timeline-item-${nodeType}`}>
      <Gutter aria-hidden="true">
        <Marker />
        <Connector />
      </Gutter>

      <ItemContent>
        <MarkdownRenderer content={content} />
        {showSkeleton && isLast && status === 'streaming' && (
          <SkeletonWrapper>
            <SkeletonLoader count={1} size="sm" showAvatar={false} />
          </SkeletonWrapper>
        )}
      </ItemContent>
    </ItemRow>
  );
});
