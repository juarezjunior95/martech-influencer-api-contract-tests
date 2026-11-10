/**
 * Formata o nome da conversa substituindo underscores por espaços
 */
export function formatConversationName(name: string): string {
  if (!name?.trim()) return 'New Chat';
  return name.replaceAll('_', ' ');
}
