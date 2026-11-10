# Sandbox

Container isolado para preview de componentes. Simula um viewport independente, ideal para demonstrar componentes com `position: fixed`.

## Uso

```tsx
import { Sandbox } from '@/features/ai-chat/components/organisms/Sandbox';

<Sandbox title="Button Example" background="grid" height={300}>
  <Button>Click me</Button>
</Sandbox>
```

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `title` | `string` | - | Título no header |
| `description` | `string` | - | Descrição abaixo do título |
| `background` | `'light' \| 'dark' \| 'grid' \| 'dots' \| 'transparent'` | `'grid'` | Fundo do viewport |
| `device` | `'desktop' \| 'tablet' \| 'mobile' \| 'auto'` | `'auto'` | Largura máxima simulada |
| `height` | `number \| string` | `400` | Altura do viewport |
| `width` | `number \| string` | - | Largura (auto se não definido) |
| `padding` | `number \| string` | `24` | Padding interno do conteúdo |
| `showFrame` | `boolean` | `false` | Adiciona moldura interna |
| `className` | `string` | - | Classe adicional |
| `style` | `CSSProperties` | - | Estilos inline |

## Backgrounds

| Valor | Descrição |
|-------|-----------|
| `light` | Branco sólido |
| `dark` | Escuro (#1a1a1a) |
| `grid` | Fundo com grid sutil |
| `dots` | Fundo com pontos |
| `transparent` | Padrão xadrez (transparência) |

## Devices

| Valor | Largura máxima |
|-------|----------------|
| `desktop` | 100% |
| `tablet` | 768px |
| `mobile` | 375px |
| `auto` | 100% |

## Exemplos

### Básico

```tsx
<Sandbox title="Buttons">
  <Button>Primary</Button>
</Sandbox>
```

### Com Drawer (position: fixed)

```tsx
<Sandbox
  title="Drawer Example"
  description="Drawer dentro do container"
  background="dots"
  height={500}
>
  <Drawer.Root open={open} onOpenChange={setOpen}>
    ...
  </Drawer.Root>
</Sandbox>
```

### Mobile preview

```tsx
<Sandbox
  title="Mobile View"
  device="mobile"
  height={600}
  background="light"
>
  <MobileComponent />
</Sandbox>
```

### Com frame interno

```tsx
<Sandbox
  title="Card Preview"
  showFrame
  background="grid"
>
  <Card>Content</Card>
</Sandbox>
```

## Isolamento de position: fixed

O Sandbox automaticamente converte elementos com `position: fixed` para `position: absolute`, garantindo que fiquem contidos dentro do viewport.

Funciona com:
- Drawers
- Modals
- Overlays
- Toasts
- Qualquer elemento fixed
