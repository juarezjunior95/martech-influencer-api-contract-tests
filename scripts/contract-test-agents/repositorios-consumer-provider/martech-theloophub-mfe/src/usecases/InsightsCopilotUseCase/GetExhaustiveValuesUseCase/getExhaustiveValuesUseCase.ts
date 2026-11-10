import { LabelValuePair, SourceTable } from 'models/InsightsCopilot';
import { getExhaustiveValuesService } from 'services/InsightsCopilotService';

interface GetExhaustiveValuesInput {
  projectKey: string;
  sourceTables: SourceTable[];
}

export default async function getExhaustiveValuesUseCase(
  input: GetExhaustiveValuesInput,
): Promise<LabelValuePair[]> {
  if (!input.sourceTables || input.sourceTables.length === 0) {
    return [];
  }

  return getExhaustiveValuesService({
    projectKey: input.projectKey,
    sourceTables: input.sourceTables,
  });
}
