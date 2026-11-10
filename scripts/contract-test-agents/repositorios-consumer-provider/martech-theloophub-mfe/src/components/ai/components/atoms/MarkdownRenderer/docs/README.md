# MarkdownRenderer

Componente para renderizar conteúdo Markdown gerado por IA com suporte a GFM (GitHub Flavored Markdown), sanitização hardened contra XSS, tags customizadas e acessibilidade WCAG 2.1.

## Estrutura

```
MarkdownRenderer/
├── docs/                    # Documentação
│   ├── CHANGELOG.md        # Histórico de mudanças
│   └── README.md           # Este arquivo
├── lib/                    # Implementação interna
│   ├── components.tsx      # Handlers de tags customizadas
│   ├── config.ts          # Sanitização e plugins
│   └── utils.ts           # Helpers (extração de texto)
├── MarkdownRenderer.tsx    # Componente principal
├── MarkdownRenderer.test.tsx
├── styles.ts
└── index.ts
```

## Dependências

- `react-markdown` - Renderização de Markdown
- `remark-gfm` - GitHub Flavored Markdown (tabelas, strikethrough, task lists)
- `rehype-raw` - Permite HTML inline
- `rehype-sanitize` - Proteção contra XSS
- `@emotion/react` e `@emotion/styled` - Styling

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

### Tags Customizadas

#### `<details>` e `<summary>` - Accordions

Renderizado como componente `Accordion` com acessibilidade completa:

```markdown
<details>
<summary>Clique para expandir</summary>
Conteúdo do accordion aqui
</details>
```

**Features:**
- ✅ ARIA attributes (aria-expanded, aria-controls, role)
- ✅ Ícone chevron animado
- ✅ Keyboard accessible
- ✅ Sincronização de estado

#### `<tabgroup>` - Agrupamento de tabelas

Wrapper transparente para agrupar tabelas relacionadas:

```markdown
<tabgroup>
| Col 1 | Col 2 |
|-------|-------|
| A     | B     |
</tabgroup>
```

#### `<chartsgroup>` - Placeholder para gráficos

Ignorado por enquanto (futuro: renderizar gráficos).

### Segurança (XSS Prevention)

**Sanitização strict com múltiplas camadas:**

1. **Tag whitelist** - Apenas tags específicas permitidas
2. **Attribute whitelist** - Apenas atributos seguros por tag
3. **Protocol whitelist** - Apenas http/https/mailto/tel
4. **Event handler blocking** - Todos os `on*` handlers bloqueados
5. **DOM clobbering prevention** - IDs e names prefixados

**Bloqueado:**
- `<script>`, `<iframe>`, `<object>`, `<embed>`
- `onclick`, `onerror`, `onload`, etc.
- `javascript:` URLs
- Injeção de HTML arbitrário

**Permitido:**
- Tags HTML padrão (p, div, span, etc.)
- Tags customizadas específicas (details, summary, mark, tabgroup)
- Atributos seguros (class, id)
- Links http/https

### Stack Overflow Prevention

Proteção contra conteúdo malicioso com aninhamento profundo:

- Limite de profundidade: 50 níveis
- Graceful degradation (retorna string vazia)
- Warning em dev mode

### Remoção de citações

Citações no formato `[a1]`, `[a2]`, etc. são removidas automaticamente. Útil para respostas de APIs de IA que incluem referências inline.

### Acessibilidade (WCAG 2.1)

**Accordion (`<details>`) com ARIA completo:**
- `aria-expanded` - Anuncia estado aberto/fechado
- `aria-controls` - Liga header ao conteúdo
- `role="region"` - Landmark semântico
- `aria-hidden` em ícones decorativos
- IDs únicos via `useId()`

### Performance

- **Module-level constants** - Plugins não recriam em cada render
- **Depth-limited recursion** - Previne performance degradation
- **Otimizado para listas longas** de mensagens

## Estilos suportados

Estilos via Emotion para elementos Markdown:

- **Headings** (h1-h6) - Tamanhos e pesos tipográficos
- **Parágrafos** - Espaçamento vertical
- **Listas** (ul, ol) - Indentação e espaçamento
- **Código inline** - Background cinza, font monospace
- **Code blocks** (pre) - Background cinza, scroll horizontal
- **Tabelas** - Borders, header bold, linhas alternadas
- **Blockquotes** - Borda esquerda, cor secundária
- **Links** - Cor azul, underline no hover
- **Separadores** (hr) - Linha cinza
- **Accordions** - Background, hover states, animações

## Histórico de mudanças

Ver [CHANGELOG.md](./CHANGELOG.md) para histórico completo de versões e melhorias.

## Arquitetura

### lib/config.ts
Configuração de sanitização e plugins remark/rehype. Define schema de segurança com whitelists explícitas.

### lib/components.tsx
Handlers customizados para tags HTML especiais. Implementa lógica de extração de `<summary>` e renderização de accordions.

### lib/utils.ts
Funções helper para extração de texto de ReactNodes. Implementa recursão segura com depth limit.

## Testes

```bash
yarn test MarkdownRenderer
```

**Coverage atual:** ~12% (needs improvement)

**TODO:**
- Unit tests para `lib/utils.ts`
- Interaction tests para Accordion
- Accessibility tests (ARIA)

## Troubleshooting

### Accordion não abre/fecha
- Verifique se o conteúdo tem tags `<details>` e `<summary>` corretas
- State é sincronizado com elemento nativo `<details>`

### Conteúdo HTML não renderiza
- HTML é permitido mas sanitizado
- Tags perigosas são removidas automaticamente
- Verifique console para warnings de sanitização

### Texto de summary duplicado
- `<summary>` renderiza `null` standalone (esperado)
- Conteúdo é extraído e usado no header do Accordion

## Contribuindo

Ao fazer mudanças:
1. Atualizar testes
2. Atualizar este README se mudar API
3. Adicionar entrada no CHANGELOG.md
4. Validar build: `yarn build`
5. Validar linter: `yarn lint`
