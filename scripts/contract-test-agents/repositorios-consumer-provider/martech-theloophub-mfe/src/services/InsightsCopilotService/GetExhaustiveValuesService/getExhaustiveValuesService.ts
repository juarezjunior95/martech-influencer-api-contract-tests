import { initialAxiosIC } from 'Api/ApiIC';
import { LabelValuePair, SourceTable } from 'models/InsightsCopilot';

interface GetExhaustiveValuesServiceParams {
  projectKey: string;
  sourceTables: SourceTable[];
}

export default async function getExhaustiveValuesService(
  params: GetExhaustiveValuesServiceParams,
): Promise<LabelValuePair[]> {
  const url = `/v2/smart-flows/exhaustive-values?project_key=${params.projectKey}`;

  const response = await initialAxiosIC.post(url, {
    source_tables: params.sourceTables,
  });

  return response.data || [];
}
