import type { AgentStepEvent } from '../../ExecutionLog.types';
import { extractPlanBullets, formatResult } from '../helpers';
import { registerNodeFormatter } from '../registry';
import type { FormatContext, FormatResult } from '../types';

registerNodeFormatter('planner', {
  statusLabel: 'Thinking and discussing with Insights Copilot',
  format(
    step: AgentStepEvent,
    { prevStep, allSteps }: FormatContext,
  ): FormatResult {
    const iteration = step.iteration ?? 0;
    const isAfterSimilarPlan = prevStep?.node === 'similar_plan_tool';
    const hasSimilarPlanInHistory = allSteps.some(
      (s) => s.node === 'similar_plan_tool',
    );
    const currentIndex = allSteps.indexOf(step);
    const isFirstPlanner = !allSteps
      .slice(0, currentIndex)
      .some((s) => s.node === 'planner');
    const isLast = allSteps[allSteps.length - 1] === step;

    const bullets = extractPlanBullets(step.outcome);
    let markdown = '';

    if (
      isAfterSimilarPlan ||
      (hasSimilarPlanInHistory && !isFirstPlanner) ||
      iteration > 1
    ) {
      markdown += 'Updated plan:\n\n';
    } else {
      markdown +=
        "**Thinking about how to address your query...**\n\nHere's my plan:\n\n";
    }

    for (const bullet of bullets) {
      markdown += `- ${bullet}\n`;
    }

    return formatResult(markdown, isLast);
  },
});
