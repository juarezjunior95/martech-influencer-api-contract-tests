# TextArea

Campo de texto multi-linha com botão de submit integrado.

## Uso

```tsx
import { TextArea } from '@/features/ai-chat/components/molecules/TextArea';

<TextArea
  placeholder="Ask a question..."
  showSubmit
  onSubmit={(value) => console.log(value)}
/>
```

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `placeholder` | `string` | `''` | Texto placeholder |
| `showSubmit` | `boolean` | `false` | Exibe botão de submit |
| `onSubmit` | `(value: string) => void` | - | Callback ao submeter |
| `disabled` | `boolean` | `false` | Desabilitado |
| `error` | `boolean` | `false` | Estado de erro |
| `singleLine` | `boolean` | `false` | Modo linha única |
| `fullWidth` | `boolean` | `true` | Largura 100% |
| `startContent` | `ReactNode` | - | Conteúdo à esquerda das ações |
| `endContent` | `ReactNode` | - | Conteúdo à direita (antes do submit) |

## Comportamentos

### Submit
- **Enter**: Submete (se `onSubmit` definido e tem valor)
- **Shift+Enter**: Nova linha
- **Botão**: Fica ativo (amarelo) quando tem texto

### Controlled vs Uncontrolled
```tsx
// Uncontrolled (interno)
<TextArea defaultValue="Initial" />

// Controlled (externo)
const [value, setValue] = useState('');
<TextArea value={value} onChange={(e) => setValue(e.target.value)} />
```

## Exemplos

### Chat Input

```tsx
<TextArea
  placeholder="Type your message..."
  showSubmit
  onSubmit={handleSend}
/>
```

### Com conteúdo adicional

```tsx
<TextArea
  placeholder="Ask anything..."
  startContent={<AttachButton />}
  endContent={<MicButton />}
  showSubmit
/>
```

## Tokens Utilizados

| Categoria | Tokens |
|-----------|--------|
| **Cores** | `--ai-chat-color-bg-default-muted`, `--ai-chat-color-bd-secondary`, `--ai-chat-color-bd-primary`, `--ai-chat-color-text-primary`, `--ai-chat-color-text-secondary`, `--ai-chat-color-primary` |
| **Tipografia** | `--ai-chat-font-family`, `--ai-chat-font-size-lg`, `--ai-chat-line-height-normal` |
| **Espaçamento** | `--ai-chat-space-2`, `--ai-chat-space-3`, `--ai-chat-space-4` |
| **Border** | `--ai-chat-radius-lg`, `--ai-chat-radius-full` |
