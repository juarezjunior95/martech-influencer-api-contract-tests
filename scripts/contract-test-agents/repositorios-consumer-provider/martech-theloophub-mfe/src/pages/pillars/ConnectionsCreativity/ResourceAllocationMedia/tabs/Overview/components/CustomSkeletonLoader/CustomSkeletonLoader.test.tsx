import { render } from '@testing-library/react';

import { CustomSkeletonLoader } from './CustomSkeletonLoader';

jest.mock('components/Skeleton/Skeleton', () => ({
  Skeleton: ({ dataTestId, ...props }: any) => (
    <div data-testid={dataTestId} {...props} />
  ),
}));

describe('CustomSkeletonLoader', () => {
  it.each([{ type: 'table' as const }, { type: 'charts' as const }])(
    'renders $type skeleton layout',
    ({ type }) => {
      const { container } = render(<CustomSkeletonLoader type={type} />);

      expect(container.firstChild).toBeInTheDocument();
    },
  );

  describe('Custom dataTestId', () => {
    it('renders custom dataTestId for table type', () => {
      const { container } = render(
        <CustomSkeletonLoader type="table" dataTestId="custom" />,
      );

      expect(
        container.querySelector(
          '[data-testid="skeleton-custom-table-container"]',
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[data-testid="skeleton-custom-table-wrapper-margin-bottom"]',
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[data-testid="skeleton-custom-table-header-left"]',
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[data-testid="custom-skeleton-table-header-right"]',
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[data-testid="skeleton-custom-table-wrapper"]',
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[data-testid="skeleton-custom-table-body-left"]',
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[data-testid="skeleton-custom-table-body-right"]',
        ),
      ).toBeInTheDocument();
    });

    it('renders custom dataTestId for charts type', () => {
      const { container } = render(
        <CustomSkeletonLoader type="charts" dataTestId="custom" />,
      );

      expect(
        container.querySelector(
          '[data-testid="skeleton-custom-charts-container"]',
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="skeleton-custom-charts"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[data-testid="skeleton-custom-legend-container"]',
        ),
      ).toBeInTheDocument();

      [0, 1, 2].forEach((index) => {
        expect(
          container.querySelector(
            `[data-testid="skeleton-custom-legend-container-${index}"]`,
          ),
        ).toBeInTheDocument();
        expect(
          container.querySelector(
            `[data-testid="skeleton-custom-legend-${index}"]`,
          ),
        ).toBeInTheDocument();
      });
    });
  });
});
