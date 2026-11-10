# Icon

Ícones SVG consistentes.

## Uso

```tsx
import { ArrowRight, Close, Menu } from '@/features/ai-chat/components/atoms/Icon';

<ArrowRight size={20} color="#333" />
```

## Ícones Disponíveis

| Ícone | Uso |
|-------|-----|
| `ArrowRight` | Navegação, links |
| `ArrowUp` | Upload, envio |
| `ChevronLeft` | Voltar, colapsar |
| `ChevronRight` | Avançar, expandir |
| `Close` | Fechar, remover |
| `Menu` | Menu hamburguer |

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `size` | `number` | varia* | Tamanho em pixels |
| `color` | `string` | `'currentColor'` | Cor do ícone |

*Defaults: ArrowRight=20, outros=16, Menu=24

## Exemplos

### Com Button

```tsx
<Button startContent={<ArrowRight size={16} />}>
  Continue
</Button>
```

### Customizando cor

```tsx
<Close size={20} color="var(--ai-chat-color-text-secondary)" />
```

## Acessibilidade

Os ícones são decorativos por padrão. Se precisar de significado:

```tsx
<ArrowRight aria-label="Go to next page" role="img" />
```
