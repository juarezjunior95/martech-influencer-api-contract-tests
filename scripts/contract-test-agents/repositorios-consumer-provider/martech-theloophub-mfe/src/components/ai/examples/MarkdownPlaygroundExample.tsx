import { useState } from 'react';

import { MarkdownRenderer } from '../components/atoms/MarkdownRenderer';
import { Sandbox } from '../components/organisms/Sandbox';
import {
  CharCount,
  Container,
  EditorPanel,
  Label,
  PreviewContainer,
  PreviewPanel,
  TextArea,
} from './MarkdownPlaygroundExample.styles';

const DEFAULT_MARKDOWN = `# Markdown Playground

Teste o **MarkdownRenderer** aqui. Cole ou edite o markdown e veja o resultado renderizado.

## Formatação

- **Negrito** e *itálico*
- \`código inline\`
- [Links](https://example.com)

## Listas

1. Item numerado 1
2. Item numerado 2
   - Sub-item com bullet
   - Outro sub-item

## Code Block

\`\`\`javascript
function example() {
  return "Hello World";
}
\`\`\`

## Tabelas

| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Dado A   | Dado B   | Dado C   |
| Dado D   | Dado E   | Dado F   |

## Citações

> Esta é uma citação de exemplo.
> Pode ter várias linhas.

---

**Nota:** Teste diferentes formatos de markdown usados pela IA aqui!
`;

export const MarkdownPlaygroundExample = () => {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  return (
    <Sandbox
      title="Markdown Playground"
      description="Teste o MarkdownRenderer — cole ou edite markdown e veja o preview renderizado"
      background="light"
      height={700}
    >
      <Container>
        <EditorPanel>
          <Label htmlFor="markdown-input">Markdown Input</Label>
          <TextArea
            id="markdown-input"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Cole ou digite seu markdown aqui..."
            spellCheck={false}
          />
          <CharCount>{markdown.length} caracteres</CharCount>
        </EditorPanel>

        <PreviewPanel>
          <Label>Preview (MarkdownRenderer)</Label>
          <PreviewContainer>
            <MarkdownRenderer content={markdown} />
          </PreviewContainer>
        </PreviewPanel>
      </Container>
    </Sandbox>
  );
};
