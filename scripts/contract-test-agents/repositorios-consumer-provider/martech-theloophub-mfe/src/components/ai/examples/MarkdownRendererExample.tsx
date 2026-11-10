import { MarkdownRenderer } from '../components/atoms/MarkdownRenderer';

const SAMPLE_MARKDOWN = `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold**, *italic* and \`inline code\`.

- Item 1
- Item 2
- Item 3

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Value A  | Value B  | Value C  |
| Value D  | Value E  | Value F  |

> This is a blockquote with some important information.

\`\`\`
const greeting = "Hello World";
console.log(greeting);
\`\`\`

[Link example](https://example.com)

---

Text with citations [a1] that should be [a2] removed automatically.
`;

export const MarkdownRendererExample = () => {
  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>MarkdownRenderer</h3>
      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
        <MarkdownRenderer content={SAMPLE_MARKDOWN} />
      </div>
    </div>
  );
};
