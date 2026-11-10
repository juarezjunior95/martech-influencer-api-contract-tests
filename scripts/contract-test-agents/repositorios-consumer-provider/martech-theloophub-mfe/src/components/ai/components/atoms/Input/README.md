# Input

Componente de input reutilizável que segue o design system do projeto.

## Uso

```tsx
import { Input } from '../../atoms/Input';

// Input padrão
<Input 
  placeholder="Digite algo..." 
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Input com variante arredondada
<Input 
  variant="rounded"
  placeholder="Buscar..."
/>

// Input com erro
<Input 
  hasError
  placeholder="Campo obrigatório"
/>

// Input de largura total
<Input 
  fullWidth
  placeholder="Largura completa"
/>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | `'default' \| 'rounded'` | `'default'` | Variante visual do input |
| `hasError` | `boolean` | `false` | Indica estado de erro |
| `fullWidth` | `boolean` | `false` | Se o input deve ocupar toda a largura disponível |

Além disso, o componente aceita todas as props nativas de `HTMLInputElement`.

## Variantes

### Default
Input com bordas totalmente arredondadas (64px) e borda azul.

### Rounded
Input com bordas totalmente arredondadas (64px), ideal para barras de busca.

## Estados

- **Normal**: Estado padrão do input com borda azul
- **Hover**: Borda azul mais escura quando o mouse passa sobre o input
- **Focus**: Borda azul com sombra suave (box-shadow) quando o input está focado
- **Error**: Borda vermelha quando `hasError={true}`
- **Disabled**: Aparência opaca quando desabilitado

## Especificações do Figma

- **Border**: 1px solid (azul #0066FF)
- **Border radius**: XXXL (64px)
- **Height**: 37px fixo
- **Padding**: 8px (vertical) × 16px (horizontal)
- **Width**: Fill (302px max-width no contexto de conversas)

## Acessibilidade

- O componente usa `forwardRef` para permitir acesso direto ao elemento input
- Suporta todos os atributos nativos de acessibilidade do HTML
- Focus visível com outline customizado

