import type { AgentStepEvent } from '../../ExecutionLog.types';
import { registerNodeFormatter } from '../registry';
import type { FormatContext, FormatResult } from '../types';

registerNodeFormatter('final_answer_tool', {
  statusLabel: 'Preparing your response...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    let markdown = 'Your response is ready\n\n';
    const isComplete = step.request_state === 'SUCCESS';

    if (isComplete) {
      markdown += '\n\n**Complete!**';
      return { markdown, showSkeleton: false };
    }

    const isLast = allSteps[allSteps.length - 1] === step;
    return { markdown, showSkeleton: isLast };
  },
});
