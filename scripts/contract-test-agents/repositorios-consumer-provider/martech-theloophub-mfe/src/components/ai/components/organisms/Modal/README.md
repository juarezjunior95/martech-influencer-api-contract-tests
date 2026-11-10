# Modal

Compound component para diálogos modais. Usa o pattern `Modal.SubComponent` para composição flexível.

## Dependências

- `@emotion/react` e `@emotion/styled`
- Tokens CSS opcionais (`--ai-chat-*`) para theming

## Importação

```tsx
import { Modal } from 'components/ai/components/organisms/Modal';
```

## Props

### `<Modal>` (Root)

| Prop           | Tipo                      | Obrigatório | Descrição                      |
| -------------- | ------------------------- | ----------- | ------------------------------ |
| `open`         | `boolean`                 | Sim         | Controla visibilidade do modal |
| `onOpenChange` | `(open: boolean) => void` | Sim         | Callback de mudança de estado  |
| `children`     | `ReactNode`               | Sim         | Sub-componentes do modal       |

### `<Modal.Overlay>`

| Prop           | Tipo                | Default  | Descrição                          |
| -------------- | ------------------- | -------- | ---------------------------------- |
| `variant`      | `'light' \| 'dark'` | `'dark'` | Variante visual do overlay         |
| `closeOnClick` | `boolean`           | `true`   | Fecha o modal ao clicar no overlay |
| `className`    | `string`            | —        | Classe CSS adicional               |

### `<Modal.Content>`

| Prop            | Tipo                                   | Default | Descrição                          |
| --------------- | -------------------------------------- | ------- | ---------------------------------- |
| `size`          | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | Largura do modal                   |
| `closeOnEscape` | `boolean`                              | `true`  | Fecha o modal ao pressionar Escape |
| `className`     | `string`                               | —       | Classe CSS adicional               |
| `children`      | `ReactNode`                            | —       | Conteúdo do modal                  |

### `<Modal.Header>`

| Prop        | Tipo        | Descrição            |
| ----------- | ----------- | -------------------- |
| `children`  | `ReactNode` | Conteúdo do header   |
| `className` | `string`    | Classe CSS adicional |

### `<Modal.Close>`

| Prop        | Tipo        | Default     | Descrição                     |
| ----------- | ----------- | ----------- | ----------------------------- |
| `children`  | `ReactNode` | Ícone Close | Conteúdo customizado do botão |
| `className` | `string`    | —           | Classe CSS adicional          |

### `<Modal.Body>`

| Prop        | Tipo        | Descrição            |
| ----------- | ----------- | -------------------- |
| `children`  | `ReactNode` | Conteúdo do body     |
| `className` | `string`    | Classe CSS adicional |

### `<Modal.Footer>`

| Prop        | Tipo        | Descrição            |
| ----------- | ----------- | -------------------- |
| `children`  | `ReactNode` | Conteúdo do footer   |
| `className` | `string`    | Classe CSS adicional |

## Uso básico

```tsx
import { useState } from 'react';
import { Modal } from 'components/ai/components/organisms/Modal';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir Modal</button>

      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              Título do Modal
            </h2>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body>
            <p>Conteúdo do modal aqui.</p>
          </Modal.Body>

          <Modal.Footer>
            <button onClick={() => setOpen(false)}>Cancelar</button>
            <button onClick={() => setOpen(false)}>Confirmar</button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
```

## Uso: Modal de feedback

```tsx
function FeedbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            Help us improve this response
          </h2>
          <Modal.Close />
        </Modal.Header>

        <Modal.Body>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a' }}>
            What went wrong?{' '}
            <span style={{ fontWeight: 400, color: '#5c5c5c' }}>
              (Optional)
            </span>
          </p>
          {/* Checkboxes ou inputs aqui */}
        </Modal.Body>

        <Modal.Footer>
          <button onClick={onClose}>Submit</button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
```

## Comportamentos

- **Escape**: Fecha o modal por padrão. Desative com `<Modal.Content closeOnEscape={false}>`
- **Overlay click**: Fecha o modal por padrão. Desative com `<Modal.Overlay closeOnClick={false}>`
- **Propagação**: Click dentro do content não fecha o modal (stopPropagation)
- **Acessibilidade**: `role="dialog"`, `aria-modal="true"`, `aria-label` no botão close

## Overlay variants

| Variant | Background                                  | Opacity | Uso                        |
| ------- | ------------------------------------------- | ------- | -------------------------- |
| `light` | `#ffffff`                                   | `0.8`   | Tom branco claro           |
| `dark`  | `var(--color-bg-surface_inverted, #141414)` | `0.16`  | Default — tom escuro sutil |

```tsx
<Modal.Overlay />                   {/* dark (default) */}
<Modal.Overlay variant="light" />   {/* light */}
```

## Size variants

| Size | Largura | Uso                             |
| ---- | ------- | ------------------------------- |
| `xs` | 288px   | Confirmações simples (delete)   |
| `sm` | 400px   | Diálogos compactos              |
| `md` | 522px   | Default — feedback, formulários |
| `lg` | 640px   | Conteúdo mais amplo             |
| `xl` | 800px   | Formulários grandes             |

```tsx
<Modal.Content size="xs">  {/* 288px */}
<Modal.Content>             {/* 522px — default md */}
<Modal.Content size="xl">  {/* 800px */}
```

## Specs visuais

- Container: width via size prop (default 522px), 8px border-radius, 12px/16px padding
- Overlay light: branco com 0.8 opacity
- Overlay dark: #141414 com 0.16 opacity
- Shadow: `0px 4px 17px 0px rgba(0, 0, 0, 0.12)`
