import type { AgentStepEvent } from '../../ExecutionLog.types';
import { formatEntityLabels, formatResult } from '../helpers';
import { registerNodeFormatter } from '../registry';
import type { FormatContext, FormatResult } from '../types';

const ENTITY_RECOGNIZER_NODES = [
  'entity_recognizer_for_analysis_node',
  'entity_recognizer_doc_qa_node',
  'entity_recognizer_for_doc_qa_node',
];

registerNodeFormatter(ENTITY_RECOGNIZER_NODES, {
  statusLabel: 'Analyzing your question...',
  format(step: AgentStepEvent, { allSteps }: FormatContext): FormatResult {
    const outcome = step.outcome as Record<string, unknown> | undefined;
    let markdown = 'Identified from your question:\n\n';

    if (
      outcome?.validated_entities ||
      outcome?.suggested_entities ||
      outcome?.unknown_entities
    ) {
      const labels = formatEntityLabels(outcome);
      markdown += labels.join(' · ') + '\n\n';
    }

    if (outcome?.hil_trigger) {
      markdown += '**Just a quick clarification...**';
      if (typeof outcome?.response === 'string') {
        markdown += `\n\n${outcome.response}`;
      }
      return { markdown, showSkeleton: false };
    }
    const isLast = allSteps[allSteps.length - 1] === step;

    return formatResult(markdown, isLast);
  },
});
