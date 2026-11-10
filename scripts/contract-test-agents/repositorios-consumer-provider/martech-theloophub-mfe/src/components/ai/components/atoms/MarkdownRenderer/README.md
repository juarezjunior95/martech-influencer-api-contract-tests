# MarkdownRenderer

Componente para renderizar conteúdo Markdown com suporte a GFM (GitHub Flavored Markdown), sanitização de HTML e remoção de citações.

## Dependências

- `react-markdown`
- `remark-gfm` (tabelas, strikethrough, task lists)
- `rehype-raw` (HTML inline)
- `rehype-sanitize` (proteção contra XSS)
- `@emotion/react` e `@emotion/styled`

## Importação

```tsx
import { MarkdownRenderer } from 'components/ai/components/atoms/MarkdownRenderer';
```

## Props

| Prop        | Tipo     | Obrigatório | Descrição                        |
| ----------- | -------- | ----------- | -------------------------------- |
| `content`   | `string` | Sim         | Conteúdo Markdown a renderizar   |
| `className` | `string` | Não         | Classe CSS adicional             |

## Uso básico

```tsx
import { MarkdownRenderer } from 'components/ai/components/atoms/MarkdownRenderer';

function ChatMessage({ text }: { text: string }) {
  return <MarkdownRenderer content={text} />;
}
```

## Uso com className

```tsx
<MarkdownRenderer
  content="**Texto em negrito** e *itálico*"
  className="my-custom-class"
/>
```

## Funcionalidades

### GFM (GitHub Flavored Markdown)

Suporta tabelas, strikethrough, task lists e autolinks:

```md
| Coluna 1 | Coluna 2 |
| -------- | -------- |
| valor    | valor    |

~~texto riscado~~

- [x] task completa
- [ ] task pendente
```

### Sanitização (XSS)

HTML inline é permitido via `rehype-raw`, mas sanitizado via `rehype-sanitize` com schema padrão. Tags perigosas como `<script>`, `<iframe>`, event handlers (`onclick`, etc.) são removidos automaticamente.

### Remoção de citações

Citações no formato `[a1]`, `[a2]`, etc. são removidas automaticamente do conteúdo antes da renderização. Útil para respostas de APIs de IA que incluem referências inline.

### Performance

Os arrays de plugins (`REMARK_PLUGINS` e `REHYPE_PLUGINS`) são definidos fora do componente como constantes de módulo, evitando recriação de referências a cada render. Isso é importante para listas longas de mensagens.

## Estilos suportados

O componente aplica estilos via emotion para os seguintes elementos Markdown:

- **Headings** (h1-h6): tamanhos e pesos tipográficos
- **Parágrafos**: espaçamento vertical
- **Listas** (ul, ol): indentação e espaçamento
- **Código inline**: background cinza, font monospace
- **Code blocks** (pre): background cinza, border-radius, scroll horizontal
- **Tabelas**: borders, header em negrito, linhas alternadas
- **Blockquotes**: borda esquerda, cor secundária
- **Links**: cor azul, underline no hover
- **Separadores** (hr): linha cinza
