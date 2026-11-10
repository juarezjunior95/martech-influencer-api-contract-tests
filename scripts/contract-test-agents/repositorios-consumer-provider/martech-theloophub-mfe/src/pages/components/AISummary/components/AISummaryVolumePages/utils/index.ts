export function extractFirstParagraph(content: string): {
  firstParagraph: string;
  rest: string;
} {
  const lines = content.split('\n');
  let firstParagraph = '';
  let restStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#') && !line.startsWith('|')) {
      firstParagraph = line;
      restStartIndex = i + 1;
      break;
    }
    restStartIndex = i + 1;
  }

  const rest = lines.slice(restStartIndex).join('\n');
  return { firstParagraph, rest };
}
