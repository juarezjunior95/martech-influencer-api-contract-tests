# Button

Botão com múltiplas variantes, tamanhos e estados.

## Uso

```tsx
import { Button } from '@/features/ai-chat/components/atoms/Button';

<Button variant="primary" size="medium">
  Click me
</Button>
```

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive' \| 'action'` | `'primary'` | Estilo visual |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamanho |
| `loading` | `boolean` | `false` | Exibe spinner e desabilita |
| `disabled` | `boolean` | `false` | Desabilitado |
| `fullWidth` | `boolean` | `false` | Largura 100% |
| `iconMode` | `boolean` | `false` | Modo só ícone (quadrado) |
| `startContent` | `ReactNode` | - | Conteúdo antes do texto |
| `endContent` | `ReactNode` | - | Conteúdo depois do texto |

## Variantes

### Primary
Ação principal. Fundo amarelo.
```tsx
<Button variant="primary">Confirm</Button>
```

### Secondary
Ação secundária. Fundo cinza.
```tsx
<Button variant="secondary">Cancel</Button>
```

### Tertiary
Ação terciária. Sem fundo, só texto.
```tsx
<Button variant="tertiary">Learn more</Button>
```

### Destructive
Ação destrutiva. Fundo vermelho.
```tsx
<Button variant="destructive">Delete</Button>
```

### Action
CTA arredondado. Fundo amarelo, border-radius pill.
```tsx
<Button variant="action">New Chat</Button>
```

## Tamanhos

| Size | Height | Font |
|------|--------|------|
| `small` | 24px | 12px |
| `medium` | 32px | 14px |
| `large` | 40px | 16px |

## Icon Mode

Para botões só com ícone:

```tsx
<Button iconMode startContent={<CloseIcon />} />
```

## Tokens Utilizados

| Categoria | Tokens |
|-----------|--------|
| **Cores** | `--ai-chat-color-primary`, `--ai-chat-color-primary-hover`, `--ai-chat-color-text-primary`, `--ai-chat-color-text-inverse`, `--ai-chat-color-text-negative` |
| **Tipografia** | `--ai-chat-font-family`, `--ai-chat-font-weight-regular`, `--ai-chat-font-weight-semibold`, `--ai-chat-font-size-sm/md/lg` |
| **Espaçamento** | `--ai-chat-space-1` |
| **Focus** | `--ai-chat-color-focus` |
