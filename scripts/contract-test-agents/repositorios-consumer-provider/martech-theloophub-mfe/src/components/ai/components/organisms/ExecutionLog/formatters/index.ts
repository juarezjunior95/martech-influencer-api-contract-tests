import type { AgentStepEvent } from '../ExecutionLog.types';
import { getFormatter, getStatusLabelByNode } from './registry';
import type { FormatContext, FormatResult } from './types';

// Register all node formatters (side-effect imports)
import './nodes/planner';
import './nodes/similarPlan';
import './nodes/entityRecognizer';
import './nodes/analysisTool';
import './nodes/dataTools';
import './nodes/evaluator';
import './nodes/finalAnswer';
import './nodes/humanAssistance';

export type { FormatResult } from './types';

export function formatStepByNodeType(
  step: AgentStepEvent,
  prevStep: AgentStepEvent | undefined,
  allSteps: AgentStepEvent[],
): FormatResult | null {
  const formatter = getFormatter(step.node);

  if (!formatter) {
    return null;
  }

  const context: FormatContext = { prevStep, allSteps };
  return formatter.format(step, context);
}

export function getStatusLabel(step: AgentStepEvent | undefined): string {
  if (!step) return 'Thinking and discussing with Insights Copilot';
  return getStatusLabelByNode(step.node);
}
