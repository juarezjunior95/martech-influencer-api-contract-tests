export function removeCitations(text: string): string {
  return text.replaceAll(/\s?\[a\d+\]\s?/g, ' ').trim();
}
