import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Collapsible } from '../../atoms/Collapsible';
import { Loader } from '../../atoms/Loader';
import { MarkdownRenderer } from '../../atoms/MarkdownRenderer';
import { SkeletonLoader } from '../../atoms/SkeletonLoader';
import { Stepper } from '../../atoms/Stepper';
import type { StepperStep } from '../../atoms/Stepper';
import {
  AccordionTitle,
  EmptyState,
  ProgressLabel,
  Root,
  ScrollContainer,
  TimelineContainer,
} from './ExecutionLog.styles';
import type {
  AgentStepEvent,
  ExecutionLogProps,
  TimelineEntry,
} from './ExecutionLog.types';
import { formatStepByNodeType, getStatusLabel } from './formatters';
import { TimelineItem } from './TimelineItem';
import { useAutoScroll } from './useAutoScroll';

export const ExecutionLog = memo(function ExecutionLog({
  steps,
  status,
}: ExecutionLogProps) {
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const processedCountRef = useRef(0);

  const { containerRef } = useAutoScroll<HTMLDivElement>({
    isActive: status === 'streaming',
    dependency: timelineEntries.length,
  });

  // Append new steps as they arrive + reset on empty
  const formatStep = useCallback(
    (step: AgentStepEvent, index: number, allSteps: AgentStepEvent[]) => {
      const prev = index > 0 ? allSteps[index - 1] : undefined;
      return formatStepByNodeType(step, prev, allSteps);
    },
    [],
  );

  useEffect(() => {
    if (steps.length === 0 && processedCountRef.current > 0) {
      setTimelineEntries([]);
      processedCountRef.current = 0;
      return;
    }

    if (steps.length <= processedCountRef.current) return;

    const newEntries: TimelineEntry[] = [];

    for (let i = processedCountRef.current; i < steps.length; i++) {
      const result = formatStep(steps[i], i, steps);

      if (result) {
        newEntries.push({
          content: result.markdown,
          nodeType: steps[i].node,
          showSkeleton: result.showSkeleton,
        });
      }
    }

    if (newEntries.length > 0) {
      setTimelineEntries((prev) => [...prev, ...newEntries]);
    }

    processedCountRef.current = steps.length;
  }, [steps, formatStep]);

  const progressLabel = useMemo(
    () => getStatusLabel(steps[steps.length - 1]),
    [steps],
  );

  const durationLabel = useMemo(() => {
    if (steps.length === 0) return 'Details';
    const lastStep = steps[steps.length - 1];
    const ms = lastStep.execution_time_ms;

    if (!ms || typeof ms !== 'number') return 'Details';

    const totalSeconds = Math.floor(ms / 1000);
    if (totalSeconds === 0)
      return 'Thought and discussed with Insights Copilot for less than a second';

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return minutes > 0
      ? `Thought and discussed with Insights Copilot for ${minutes} min ${seconds} s`
      : `Thought and discussed with Insights Copilot for ${seconds} s`;
  }, [steps]);

  const timelineContent = useMemo(() => {
    if (status === 'streaming') {
      // STREAMING: Use Stepper atom (Figma design)
      const stepperSteps: StepperStep[] = timelineEntries.map((entry, idx) => ({
        id: `${entry.nodeType}-${idx}`,
        label: getStatusLabel(steps[idx] ?? { node: entry.nodeType }),
        description: (
          <>
            <MarkdownRenderer content={entry.content} />
            {entry.showSkeleton && idx === timelineEntries.length - 1 && (
              <SkeletonLoader count={1} size="sm" showAvatar={false} />
            )}
          </>
        ),
        state: idx === timelineEntries.length - 1 ? 'current' : 'complete',
      }));

      return (
        <ScrollContainer
          ref={containerRef}
          faded={false}
          tabIndex={0}
          role="log"
          aria-label="Agent execution timeline"
          aria-relevant="additions"
          aria-atomic={false}
          data-testid="execution-log"
        >
          <TimelineContainer>
            {stepperSteps.length > 0 ? <Stepper steps={stepperSteps} /> : null}
          </TimelineContainer>
        </ScrollContainer>
      );
    }

    // COMPLETE: Use legacy UI (preserved)
    return (
      <ScrollContainer
        ref={containerRef}
        faded={true}
        tabIndex={0}
        role="log"
        aria-label="Agent execution timeline"
        aria-relevant="additions"
        aria-atomic={false}
        data-testid="execution-log"
      >
        <TimelineContainer>
          {timelineEntries.length > 0 ? (
            <div>
              {timelineEntries.map((entry, index) => (
                <TimelineItem
                  key={`${entry.nodeType}-${index}`}
                  content={entry.content}
                  nodeType={entry.nodeType}
                  status={status}
                  isLast={index === timelineEntries.length - 1}
                  showSkeleton={entry.showSkeleton}
                />
              ))}
            </div>
          ) : (
            <EmptyState>No execution logs available</EmptyState>
          )}
        </TimelineContainer>
      </ScrollContainer>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineEntries, status, steps]);

  return (
    <Root data-testid="execution-log">
      {status === 'streaming' && (
        <ProgressLabel
          role="status"
          aria-live="polite"
          data-testid="execution-loader-logs"
        >
          {progressLabel}
          <Loader size="sm" />
        </ProgressLabel>
      )}

      {status === 'streaming'
        ? timelineContent
        : timelineEntries.length > 0 && (
            <Collapsible
              title={<AccordionTitle>{durationLabel}</AccordionTitle>}
            >
              {timelineContent}
            </Collapsible>
          )}
    </Root>
  );
});
