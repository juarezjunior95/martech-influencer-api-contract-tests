import type { AgentStepEvent } from '../../ExecutionLog.types';
import {
  appendTableReferences,
  formatResult,
  truncateMarkdown,
  truncateText,
} from '../helpers';
import { registerNodeFormatter } from '../registry';
import type { FormatContext, FormatResult } from '../types';

registerNodeFormatter('sql_tool', {
  statusLabel: 'Querying your data...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome as Record<string, unknown> | undefined;
    let markdown = 'Insights generated!\n\n';

    if (typeof outcome?.response === 'string') {
      markdown += truncateText(outcome.response);
    }
    markdown = appendTableReferences(markdown, outcome?.table_references);
    const isLast = allSteps[allSteps.length - 1] === step;

    return formatResult(markdown, isLast);
  },
});

registerNodeFormatter('python_tool', {
  statusLabel: 'Crunching the numbers...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome as Record<string, unknown> | undefined;
    let markdown = 'Execution complete!\n\n';

    if (typeof outcome?.response === 'string') {
      markdown += truncateText(outcome.response);
    }
    const isLast = allSteps[allSteps.length - 1] === step;

    return formatResult(markdown, isLast);
  },
});

registerNodeFormatter('chart_creation_tool', {
  statusLabel: 'Creating your chart...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const markdown = 'Chart created!\n\n';
    const isLast = allSteps[allSteps.length - 1] === step;
    return formatResult(markdown, isLast);
  },
});

registerNodeFormatter('doc_qa_tool', {
  statusLabel: 'Searching internal reports...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome as Record<string, unknown> | undefined;
    let markdown = 'Insights generated!\n\n';

    const response = outcome?.response ?? outcome ?? '';
    if (typeof response === 'string' && response) {
      markdown += truncateMarkdown(response);
    }

    const refs = outcome?.document_references;
    if (Array.isArray(refs)) {
      const filenames = refs.map((ref: string) => {
        const parts = ref.split('/');
        return parts[parts.length - 1];
      });
      markdown += `\n **Sources:** ${filenames.join(', ')}`;
    }
    const isLast = allSteps[allSteps.length - 1] === step;

    return formatResult(markdown, isLast);
  },
});

registerNodeFormatter('internet_tool', {
  statusLabel: 'Searching the web...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome as Record<string, unknown> | undefined;
    let markdown = 'Insights generated!\n\n';

    if (typeof outcome?.response === 'string') {
      markdown += truncateMarkdown(outcome.response);
    }

    const refs = outcome?.internet_references;
    if (Array.isArray(refs)) {
      markdown += `\n **Sources:** ${refs.join(', ')}`;
    }
    const isLast = allSteps[allSteps.length - 1] === step;

    return formatResult(markdown, isLast);
  },
});

registerNodeFormatter('business_knowledge_tool', {
  statusLabel: 'Looking up relevant context...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome as Record<string, unknown> | undefined;
    let markdown = 'Context retrieved!\n\n';

    if (typeof outcome?.response === 'string') {
      markdown += truncateMarkdown(outcome.response);
    }
    const isLast = allSteps[allSteps.length - 1] === step;

    return formatResult(markdown, isLast);
  },
});
