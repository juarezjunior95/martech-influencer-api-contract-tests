# AI Chat UI

Sistema de componentes para interfaces de chat com IA.

## Quick Start

```tsx
// 1. Importar os tokens CSS (uma vez no App)
import '@/features/ai-chat/tokens/styles.css';

// 2. Usar os componentes
import { Button, ChatBubble, Drawer } from '@/features/ai-chat/components';
```

## Estrutura

```
ai-chat/
├── tokens/              # Design tokens (CSS Variables)
├── components/
│   ├── atoms/           # Componentes básicos
│   │   ├── Button/
│   │   ├── LoadingDots/
│   │   └── Icon/
│   ├── molecules/       # Composições
│   │   ├── TextArea/
│   │   └── TemplateCard/
│   └── organisms/       # Componentes complexos
│       ├── ChatBubble/
│       └── Drawer/
├── examples/            # Exemplos de uso
└── utils/               # Utilitários
```

## Componentes

### Atoms

| Componente | Descrição | Doc |
|------------|-----------|-----|
| **Button** | Botão com variantes e estados | [README](./components/atoms/Button/README.md) |
| **LoadingDots** | Indicador de loading animado | [README](./components/atoms/LoadingDots/README.md) |
| **Icon** | Ícones SVG | [README](./components/atoms/Icon/README.md) |

### Molecules

| Componente | Descrição | Doc |
|------------|-----------|-----|
| **TextArea** | Campo de texto com submit | [README](./components/molecules/TextArea/README.md) |
| **TemplateCard** | Card clicável para templates | [README](./components/molecules/TemplateCard/README.md) |

### Organisms

| Componente | Descrição | Doc |
|------------|-----------|-----|
| **ChatBubble** | Balão de mensagem | [README](./components/organisms/ChatBubble/README.md) |
| **Drawer** | Painel lateral deslizante | [README](./components/organisms/Drawer/README.md) |

## Imports

### Por componente (recomendado para tree-shaking)

```tsx
import { Button } from '@/features/ai-chat/components/atoms/Button';
import { TextArea } from '@/features/ai-chat/components/molecules/TextArea';
import { ChatBubble } from '@/features/ai-chat/components/organisms/ChatBubble';
```

### Central

```tsx
import { Button, TextArea, ChatBubble, Drawer } from '@/features/ai-chat/components';
```

## Design Tokens

Os tokens estão em `tokens/styles.css` e seguem o padrão:

```css
--ai-chat-color-*      /* Cores */
--ai-chat-space-*      /* Espaçamento */
--ai-chat-font-*       /* Tipografia */
--ai-chat-radius-*     /* Border radius */
--ai-chat-shadow-*     /* Sombras */
--ai-chat-z-*          /* Z-index */
```

Ver documentação completa: [tokens/README.md](./tokens/README.md)

## Examples

Exemplos prontos para uso na página de development:

```tsx
import {
  ButtonExample,
  TextAreaExample,
  ChatBubbleExample,
  DrawerExample,
} from '@/features/ai-chat/examples';
```

## Convenções

- **Emotion** (`@emotion/styled`): estilos em `ComponentName.styles.ts` co-localizados
- **TypeScript**: Tipos exportados para todas as props
- **forwardRef**: Todos os componentes suportam ref
- **Atomic Design**: atoms → molecules → organisms
