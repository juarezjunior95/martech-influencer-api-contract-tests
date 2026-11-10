import type { Artifact, Chart, Message } from '../types';

interface RichData {
  charts?: Chart[];
  artifacts?: Artifact[];
}

export function createUserMessage(content: string): Message {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  };
}

export function createAssistantMessage(
  content: string,
  requestId?: string,
  richData?: RichData,
): Message {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    requestId,
    ...(richData?.charts?.length && { charts: richData.charts }),
    ...(richData?.artifacts?.length && { artifacts: richData.artifacts }),
  };
}

export function createErrorMessage(): Message {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: 'Sorry, something went wrong.',
    timestamp: new Date().toISOString(),
    isError: true,
  };
}

export function createAbandonedMessage(): Message {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content:
      "This conversation was interrupted and can't continue. Please start a new chat.",
    timestamp: new Date().toISOString(),
    isError: true,
    isAbandoned: true,
  };
}
