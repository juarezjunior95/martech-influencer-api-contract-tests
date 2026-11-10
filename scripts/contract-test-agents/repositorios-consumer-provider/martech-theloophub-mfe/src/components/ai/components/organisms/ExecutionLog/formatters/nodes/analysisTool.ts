import type { AgentStepEvent } from '../../ExecutionLog.types';
import { appendTableReferences, formatResult, truncateText } from '../helpers';
import { registerNodeFormatter } from '../registry';
import type { FormatContext, FormatResult } from '../types';

registerNodeFormatter('analysis_tool', {
  statusLabel: 'Running your Smart Flow...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome as Record<string, unknown> | undefined;
    const fnName = outcome?.function_name ?? outcome?.stored_proc;
    let markdown = fnName
      ? `Insights generated using Smart Flow: **${fnName}**!\n\n`
      : '**Insights generated using Smart Flow!**\n\n';

    if (typeof outcome?.summary === 'string') {
      markdown += ` ${truncateText(outcome.summary)}`;
    }
    markdown = appendTableReferences(markdown, outcome?.table_references);
    const isLast = allSteps[allSteps.length - 1] === step;

    return formatResult(markdown, isLast);
  },
});

registerNodeFormatter('smartflow_analysis_tool_node', {
  statusLabel: 'Running your Smart Flow...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome as Record<string, unknown> | undefined;
    let markdown =
      'Running your Smart Flow...\nThis usually takes about 30 seconds.\n\n';

    const fnName = outcome?.function_name ?? outcome?.stored_proc;
    if (typeof fnName === 'string') {
      markdown += `Insights generated using Smart Flow: **${fnName}**!\n\n`;
    }
    if (typeof outcome?.response === 'string') {
      markdown += truncateText(outcome.response);
    }
    markdown = appendTableReferences(markdown, outcome?.table_references);
    const isLast = allSteps[allSteps.length - 1] === step;

    return formatResult(markdown, isLast);
  },
});
