import type { AgentStepEvent } from '../../ExecutionLog.types';
import { formatResult } from '../helpers';
import { registerNodeFormatter } from '../registry';
import type { FormatContext, FormatResult } from '../types';

registerNodeFormatter(
  ['human_assistance', 'human_interrupt_for_analysis_node'],
  {
    statusLabel: 'Just a quick clarification...',
    format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
      const markdown = '**Just a quick clarification...**\n\n';
      const isLast = allSteps[allSteps.length - 1] === step;
      return formatResult(markdown, isLast);
    },
  },
);
