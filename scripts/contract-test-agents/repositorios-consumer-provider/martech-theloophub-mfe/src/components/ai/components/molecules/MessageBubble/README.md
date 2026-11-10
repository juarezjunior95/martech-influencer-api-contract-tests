# MessageBubble

Componente de bolha de mensagem para chat com suporte a estados de erro e loading.

## Uso

```tsx
import { MessageBubble } from 'features/ai-chat/components';

// User message - default
<MessageBubble position="user">
  What were the Top 5 regions in Brazil?
</MessageBubble>

// User message - failed
<MessageBubble position="user" status="failed">
  What were the Top 5 regions in Brazil?
</MessageBubble>

// Assistant message - thinking
<MessageBubble position="assistant" status="thinking" />

// Assistant message - default
<MessageBubble position="assistant">
  The top 5 regions are...
</MessageBubble>

// Assistant message - error with retry
<MessageBubble
  position="assistant"
  status="error"
  onRetry={() => console.log('retry')}
/>

// Assistant message - custom error
<MessageBubble
  position="assistant"
  status="error"
  errorMessage="Please start a new chat and try again."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'user' \| 'assistant'` | - | Define o lado e estilo da mensagem |
| `status` | `'default' \| 'thinking' \| 'failed' \| 'error'` | `'default'` | Estado atual da mensagem |
| `children` | `ReactNode` | - | Conteúdo da mensagem |
| `onRetry` | `() => void` | - | Callback do botão "Try again" |
| `errorMessage` | `string` | - | Mensagem de erro customizada |

## Estados por Posição

### User
- `default` - Mensagem normal
- `failed` - Borda vermelha + ícone de alerta

### Assistant
- `default` - Mensagem normal
- `thinking` - "Thinking" + loading dots
- `error` - Mensagem de erro + botão "Try again"

## Especificações

### User
- Width: 342px
- Min-height: 72px
- Padding: 16px 24px
- Border-radius: 32px 4px 32px 32px

### Assistant
- Width: 482px
- Min-height: 92px (52px quando thinking)
- Padding: 16px
- Border-radius: 4px 32px 24px 24px
