import { render } from '@testing-library/react';

import { SourceTooltipContent } from './SourceTooltipContent';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

describe('SourceTooltipContent', () => {
  it.each([
    ['sunlight', 'monthly'],
    ['anaplan', 'quarterly'],
    ['kantar', 'yearly'],
  ] as const)(
    'renders translated source "%s" and refresh "%s" in the expected format',
    (source, refresh) => {
      const { container } = render(
        <SourceTooltipContent source={source} refresh={refresh} />,
      );

      expect(container.textContent).toBe(
        `Label.source: Label.${source}. Label.refresh: Label.${refresh}.`,
      );
    },
  );
});
