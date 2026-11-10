# TemplateCard

Card clicável para templates e sugestões.

## Uso

```tsx
import { TemplateCard } from '@/features/ai-chat/components/molecules/TemplateCard';

<TemplateCard
  title="Brand KPI Trend"
  description='Eg. "How did Corona perform?"'
  onClick={() => handleSelect()}
/>
```

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `title` | `string` | - | Título (opcional) |
| `description` | `string` | **required** | Descrição/conteúdo |
| `onClick` | `() => void` | - | Callback ao clicar |
| `className` | `string` | - | Classe adicional |

## Variações

### Com título
Descrição menor (10px), título em destaque.

```tsx
<TemplateCard
  title="KPI Root Cause"
  description='Eg. "Why did brand power change?"'
/>
```

### Sem título
Descrição maior (12px), funciona como sugestão.

```tsx
<TemplateCard
  description="Why did the brand power of Budweiser change?"
/>
```

## Acessibilidade

- `role="button"` e `tabIndex={0}`
- Suporta Enter e Space para ativar
- Foco visível no tab

## Tokens Utilizados

| Categoria | Tokens |
|-----------|--------|
| **Cores** | `--ai-chat-color-bg-default`, `--ai-chat-color-bg-default-subtle`, `--ai-chat-color-bd-tertiary`, `--ai-chat-color-bd-secondary`, `--ai-chat-color-fg-default`, `--ai-chat-color-fg-secondary` |
| **Tipografia** | `--ai-chat-font-family`, `--ai-chat-font-size-xs`, `--ai-chat-font-size-sm`, `--ai-chat-font-size-lg`, `--ai-chat-font-weight-regular`, `--ai-chat-font-weight-semibold` |
| **Espaçamento** | `--ai-chat-space-1`, `--ai-chat-space-2`, `--ai-chat-space-3` |
| **Border** | `--ai-chat-radius-sm` |
| **Transition** | `--ai-chat-transition-fast` |
