import { styled } from '@hexa-ui/theme';

export const AccordionContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0 24px',
});

export const AccordionItemWrapper = styled('div', {
  borderBottom: '1px solid rgba(20, 20, 20, 0.12)',
});

export const AccordionTrigger = styled('button', {
  height: '72px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'color 0.2s ease',
  fontFamily: 'Barlow',
  fontWeight: '600',
  fontSize: '18px',
  padding: '0',
});

export const AccordionIcon = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  transition: 'transform 0.2s ease',

  variants: {
    isOpen: {
      true: {
        transform: 'rotate(180deg)',
      },
      false: {
        transform: 'rotate(0deg)',
      },
    },
  },

  defaultVariants: {
    isOpen: false,
  },
});

export const AccordionContent = styled('div', {
  overflow: 'hidden',
  transition: 'max-height 0.3s ease, opacity 0.3s ease',

  variants: {
    isOpen: {
      true: {
        maxHeight: '2000px',
        opacity: 1,
      },
      false: {
        maxHeight: 0,
        opacity: 0,
      },
    },
  },

  defaultVariants: {
    isOpen: false,
  },
});

export const AccordionContentInner = styled('div', {
  padding: '0 0 $6 0',
});
