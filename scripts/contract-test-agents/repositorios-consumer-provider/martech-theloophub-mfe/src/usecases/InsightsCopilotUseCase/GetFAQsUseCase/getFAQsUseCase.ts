import { GetFAQsResponse } from 'models/InsightsCopilot';
import { getFAQsService } from 'services/InsightsCopilotService';

interface GetFAQsInput {
  projectKey: string;
  language?: string;
}

export default async function getFAQsUseCase(
  input: GetFAQsInput,
): Promise<GetFAQsResponse[]> {
  const faqs = await getFAQsService({
    projectKey: input.projectKey,
    language: input.language || 'en',
  });

  const validFaqs = faqs.filter(
    (faq) => faq.query && faq.query.trim().length > 0,
  );

  return validFaqs;
}
