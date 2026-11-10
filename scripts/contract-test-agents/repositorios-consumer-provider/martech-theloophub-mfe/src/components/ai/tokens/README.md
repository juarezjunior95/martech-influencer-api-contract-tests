# Design Tokens

Tokens de design para o sistema AI Chat UI.

## Uso

```tsx
// Importar uma vez no App
import '@/features/ai-chat/tokens/styles.css';
```

## Cores

### Background
| Token | Valor | Uso |
|-------|-------|-----|
| `--ai-chat-color-bg-default` | `#ffffff` | Fundo padrão |
| `--ai-chat-color-bg-default-subtle` | `#fafafa` | Fundo sutil |
| `--ai-chat-color-bg-secondary` | `#f3f3f3` | Fundo secundário |
| `--ai-chat-color-bg-tertiary` | `#e2e2e2` | Fundo terciário |

### Brand
| Token | Valor | Uso |
|-------|-------|-----|
| `--ai-chat-color-primary` | `#e5b611` | Cor primária (amarelo) |
| `--ai-chat-color-primary-hover` | `#d3a238` | Hover da cor primária |

### Text
| Token | Valor | Uso |
|-------|-------|-----|
| `--ai-chat-color-text-primary` | `#141414` | Texto principal |
| `--ai-chat-color-text-secondary` | `rgba(20, 20, 20, 0.36)` | Texto secundário |
| `--ai-chat-color-text-inverse` | `#ffffff` | Texto em fundo escuro |
| `--ai-chat-color-text-negative` | `#e82727` | Texto de erro |

### Border
| Token | Valor | Uso |
|-------|-------|-----|
| `--ai-chat-color-bd-primary` | `rgba(0,0,0,0.24)` | Borda forte |
| `--ai-chat-color-bd-secondary` | `rgba(0,0,0,0.16)` | Borda média |
| `--ai-chat-color-bd-tertiary` | `rgba(0,0,0,0.08)` | Borda sutil |

## Espaçamento

Base de 4px.

| Token | Valor |
|-------|-------|
| `--ai-chat-space-1` | `4px` |
| `--ai-chat-space-2` | `8px` |
| `--ai-chat-space-3` | `12px` |
| `--ai-chat-space-4` | `16px` |
| `--ai-chat-space-6` | `24px` |
| `--ai-chat-space-8` | `32px` |

## Tipografia

### Font Family
```css
--ai-chat-font-family: 'Avantt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
| Token | Valor |
|-------|-------|
| `--ai-chat-font-size-xs` | `12px` |
| `--ai-chat-font-size-sm` | `12px` |
| `--ai-chat-font-size-md` | `14px` |
| `--ai-chat-font-size-lg` | `16px` |
| `--ai-chat-font-size-xl` | `18px` |

### Font Weights
| Token | Valor |
|-------|-------|
| `--ai-chat-font-weight-regular` | `400` |
| `--ai-chat-font-weight-medium` | `500` |
| `--ai-chat-font-weight-semibold` | `600` |
| `--ai-chat-font-weight-bold` | `700` |

## Border Radius

| Token | Valor |
|-------|-------|
| `--ai-chat-radius-sm` | `4px` |
| `--ai-chat-radius-md` | `8px` |
| `--ai-chat-radius-lg` | `12px` |
| `--ai-chat-radius-xl` | `16px` |
| `--ai-chat-radius-full` | `9999px` |

## Z-Index

| Token | Valor | Uso |
|-------|-------|-----|
| `--ai-chat-z-dropdown` | `1000` | Dropdowns |
| `--ai-chat-z-modal-backdrop` | `1040` | Overlay de modal |
| `--ai-chat-z-modal` | `1050` | Modal/Drawer |

## Fontes

As fontes Avantt estão em `tokens/fonts/`:
- Avantt-Light.ttf (300)
- Avantt-Regular.ttf (400)
- Avantt-SemiBold.ttf (600)
- Avantt-Bold.ttf (700)
