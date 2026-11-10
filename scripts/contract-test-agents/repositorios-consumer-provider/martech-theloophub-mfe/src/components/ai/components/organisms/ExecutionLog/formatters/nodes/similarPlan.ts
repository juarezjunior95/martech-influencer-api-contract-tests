import type { AgentStepEvent } from '../../ExecutionLog.types';
import { formatResult } from '../helpers';
import { registerNodeFormatter } from '../registry';
import type { FormatContext, FormatResult } from '../types';

registerNodeFormatter('similar_plan_tool', {
  statusLabel: 'Planning next steps...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome;
    let markdown = '';

    if (Array.isArray(outcome) && outcome.length > 0) {
      markdown += `Found ${outcome.length} similar questions I've answered before.\n`;
    } else {
      markdown +=
        'This is a new type of question - building a fresh approach.\n';
    }
    const isLast = allSteps[allSteps.length - 1] === step;

    return formatResult(markdown, isLast);
  },
});
