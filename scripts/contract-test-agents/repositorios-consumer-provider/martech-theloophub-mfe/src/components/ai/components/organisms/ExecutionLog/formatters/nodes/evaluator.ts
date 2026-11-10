import type { AgentStepEvent } from '../../ExecutionLog.types';
import { formatResult } from '../helpers';
import { registerNodeFormatter } from '../registry';
import type { FormatContext, FormatResult } from '../types';

registerNodeFormatter('evaluator', {
  statusLabel: 'Reviewing results...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome as Record<string, unknown> | undefined;
    const decision = outcome?.decision ?? step.decision;
    const isLast = allSteps[allSteps.length - 1] === step;
    let markdown = '';

    if (decision === 'complete') {
      markdown +=
        '**My review is complete!**\n\nI have all the information I need to answer your question.';
    } else if (decision === 'incomplete') {
      const detail =
        (outcome?.missing_information as string) ??
        (outcome?.reasoning as string) ??
        'Additional information needed';
      markdown += `Needs more work\n\n${detail}`;
    }

    return formatResult(markdown, isLast);
  },
});
