import { SmartFlowConfig } from 'models/InsightsCopilot';
import { getSmartFlowsService } from 'services/InsightsCopilotService';

interface GetSmartFlowsInput {
  projectKey: string;
}

export default async function getSmartFlowsUseCase(
  input: GetSmartFlowsInput,
): Promise<SmartFlowConfig[]> {
  return getSmartFlowsService({
    projectKey: input.projectKey,
  });
}
