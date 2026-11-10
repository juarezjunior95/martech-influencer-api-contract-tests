import { styled } from '@hexa-ui/theme';

export const StyledCountrySlideContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  alignItems: 'start',

  variants: {
    hasAlert: {
      true: {},
      false: {},
    },
    hasAiSummary: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      hasAlert: false,
      hasAiSummary: false,
      css: {
        gridTemplateAreas: `
          "total brands brands"
        `,
      },
    },
    {
      hasAlert: true,
      hasAiSummary: false,
      css: {
        gridTemplateAreas: `
          "alert brands brands"
          "total brands brands"
        `,
      },
    },
    {
      hasAlert: false,
      hasAiSummary: true,
      css: {
        gridTemplateAreas: `
          "ai-summary ai-summary ai-summary"
          "total brands brands"
        `,
      },
    },
    {
      hasAlert: true,
      hasAiSummary: true,
      css: {
        gridTemplateAreas: `
          "ai-summary ai-summary ai-summary"
          "alert brands brands"
          "total brands brands"
        `,
      },
    },
  ],

  defaultVariants: {
    hasAlert: false,
    hasAiSummary: false,
  },
});
