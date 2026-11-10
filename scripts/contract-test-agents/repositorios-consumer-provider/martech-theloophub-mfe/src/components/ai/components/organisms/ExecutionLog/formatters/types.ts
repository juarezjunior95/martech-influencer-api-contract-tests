import type { AgentStepEvent } from '../ExecutionLog.types';

export interface FormatContext {
  prevStep: AgentStepEvent | undefined;
  allSteps: AgentStepEvent[];
}

export interface FormatResult {
  markdown: string;
  showSkeleton: boolean;
}

export interface NodeFormatter {
  statusLabel: string;
  format: (step: AgentStepEvent, context: FormatContext) => FormatResult;
}
