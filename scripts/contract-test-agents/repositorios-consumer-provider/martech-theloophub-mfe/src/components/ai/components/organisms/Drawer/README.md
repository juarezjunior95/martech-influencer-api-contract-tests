# Drawer

Painel lateral deslizante (slide-in from right).

## Uso

```tsx
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerBody,
} from '@/features/ai-chat/components/organisms/Drawer';

const [open, setOpen] = useState(false);

<Drawer open={open} onOpenChange={setOpen}>
  <DrawerContent>
    <DrawerTrigger>Open Chat</DrawerTrigger>
    <DrawerHeader>
      <DrawerTitle>Chat with AI</DrawerTitle>
      <DrawerClose />
    </DrawerHeader>
    <DrawerBody>
      {/* Conteúdo */}
    </DrawerBody>
  </DrawerContent>
</Drawer>
```

## Componentes

### Drawer
Container principal. Gerencia estado.

| Prop | Tipo | Descrição |
|------|------|-----------|
| `open` | `boolean` | Estado aberto/fechado |
| `onOpenChange` | `(open: boolean) => void` | Callback de mudança |

### DrawerContent
Wrapper do conteúdo e configurações.

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `width` | `string \| number` | `420` | Largura do drawer |
| `showOverlay` | `boolean` | `true` | Exibe backdrop |
| `closeOnOverlayClick` | `boolean` | `true` | Fecha ao clicar no overlay |
| `closeOnEscape` | `boolean` | `true` | Fecha ao pressionar Escape |
| `contained` | `boolean` | `false` | Usa `position: absolute` para ficar contido em um container pai |

### DrawerTrigger
Botão vertical que abre/fecha.

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `top` | `string \| number` | `64` | Posição vertical |
| `asChild` | `boolean` | `false` | Usa children como trigger |

### DrawerHeader
Container do título e close button.

### DrawerTitle
Título do drawer.

### DrawerBody
Área de conteúdo com scroll.

### DrawerClose
Botão de fechar. Pode ser customizado:

```tsx
// Default (X icon)
<DrawerClose />

// Custom
<DrawerClose>
  <CustomCloseButton />
</DrawerClose>
```

## Exemplos

### Básico

```tsx
<Drawer open={open} onOpenChange={setOpen}>
  <DrawerContent>
    <DrawerTrigger>Ask AI</DrawerTrigger>
    <DrawerHeader>
      <DrawerTitle>Assistant</DrawerTitle>
      <DrawerClose />
    </DrawerHeader>
    <DrawerBody>
      <p>Content here</p>
    </DrawerBody>
  </DrawerContent>
</Drawer>
```

### Contained (em container)

Usa `position: absolute` em vez de `fixed`, permitindo que o drawer fique contido dentro de um elemento pai com `position: relative`.

```tsx
<div style={{ position: 'relative', height: 400 }}>
  <Drawer open={open} onOpenChange={setOpen}>
    <DrawerContent contained showOverlay={false} width={380}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerBody>Content</DrawerBody>
    </DrawerContent>
  </Drawer>
</div>
```

### Trigger customizado

```tsx
<DrawerTrigger asChild top={100}>
  <MyCustomButton>Open</MyCustomButton>
</DrawerTrigger>
```

## Acessibilidade

- `role="dialog"` e `aria-modal="true"`
- Fecha com Escape (configurável)
- Trap de foco no conteúdo
- `aria-expanded` no trigger

## Tokens Utilizados

| Categoria | Tokens |
|-----------|--------|
| **Cores** | `--ai-chat-color-bg-default`, `--ai-chat-color-bg-default-subtle`, `--ai-chat-color-bg-secondary`, `--ai-chat-color-bd-tertiary`, `--ai-chat-color-fg-default`, `--ai-chat-color-text-primary`, `--ai-chat-color-text-secondary` |
| **Tipografia** | `--ai-chat-font-family`, `--ai-chat-font-size-lg`, `--ai-chat-font-size-xl`, `--ai-chat-font-weight-semibold`, `--ai-chat-line-height-tight` |
| **Espaçamento** | `--ai-chat-space-1`, `--ai-chat-space-3`, `--ai-chat-space-4` |
| **Border** | `--ai-chat-radius-xl`, `--ai-chat-radius-full` |
| **Z-index** | `--ai-chat-z-modal-backdrop`, `--ai-chat-z-modal` |
