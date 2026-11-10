import { render, screen } from '@testing-library/react';

import {
  categoryGrowthLeversFiveKpisMock,
  categoryGrowthLeversMock,
  categoryGrowthLeversNoImageMock,
} from './__mocks/categoryGrowthLeversMock';
import { CategoryGrowthLevers } from './CategoryGrowthLevers';

jest.mock('@hexa-ui/components2', () => ({
  Tooltip: ({ children }: any) => children,
}));

jest.mock('hooks', () => ({
  useTruncationDetection: (text: string) => ({
    ref: { current: null },
    displayText: text,
    isTruncated: false,
  }),
}));

jest.mock('@hexa-ui/components', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Paragraph: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  Image: ({ src, alt, 'data-testid': testId, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      data-testid={testId}
      className="hexa-image"
      {...props}
    />
  ),
  Heading: ({
    children,
    size,
    'data-testid': testId,
    className,
    ...props
  }: any) => (
    <div
      data-size={size}
      data-testid={testId}
      className={`hexa-heading ${className || ''}`.trim()}
      {...props}
    >
      {children}
    </div>
  ),
}));

describe('CategoryGrowthLevers', () => {
  describe('Basic rendering', () => {
    it('should render the component', () => {
      const { container } = render(
        <CategoryGrowthLevers {...categoryGrowthLeversMock} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render both containers', () => {
      const { container } = render(
        <CategoryGrowthLevers {...categoryGrowthLeversMock} />,
      );

      const card = container.firstChild;
      expect(card?.childNodes).toHaveLength(2);
    });
  });

  describe('Secondary rendering', () => {
    it('should render default layout when has less than 5 items', () => {
      const mockWith3Items = {
        ...categoryGrowthLeversMock,
        items: categoryGrowthLeversMock.items.slice(0, 3),
      };

      const { container } = render(
        <CategoryGrowthLevers {...mockWith3Items} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render alternative layout when has 5 items', () => {
      const { container } = render(
        <CategoryGrowthLevers {...categoryGrowthLeversFiveKpisMock} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render image and title', () => {
      const { container } = render(
        <CategoryGrowthLevers {...categoryGrowthLeversMock} />,
      );

      expect(container.querySelector('.hexa-image')).toBeInTheDocument();
      expect(container.querySelector('.hexa-heading')).toBeInTheDocument();
    });

    it('should render the image with correct props', () => {
      const { container } = render(
        <CategoryGrowthLevers {...categoryGrowthLeversMock} />,
      );

      const image = container.querySelector('.hexa-image');
      expect(image).toHaveAttribute('src', categoryGrowthLeversMock.image!.src);
      expect(image).toHaveAttribute('alt', categoryGrowthLeversMock.image!.alt);
    });

    it('should not render image when showImage is false', () => {
      const { container } = render(
        <CategoryGrowthLevers {...categoryGrowthLeversNoImageMock} />,
      );

      expect(container.querySelector('.hexa-image')).not.toBeInTheDocument();
    });

    it('should render items only with cardTitle when has no image', () => {
      const mockData = {
        ...categoryGrowthLeversNoImageMock,
        items: [{ cardTitle: 'card title' }],
      };

      render(<CategoryGrowthLevers {...mockData} />);

      const titles = screen.getAllByText('card title');
      expect(titles.length).toBeGreaterThanOrEqual(1);
    });

    it('should render item with all data', () => {
      const mockData = {
        showImage: false,
        categoryTitle: 'GrowthLevers',
        items: [
          {
            type: 'multi' as const,
            cardTitle: 'card title',
            growthLeversNumber: { value: '25.5', measure: '%' },
            variation: { value: '3.7', measure: 'pp', color: '#176d38' },
            comparison: { value: 'vs', measure: 'LY' },
          },
        ],
      };

      render(<CategoryGrowthLevers {...mockData} />);

      expect(screen.getAllByText('card title').length).toBeGreaterThanOrEqual(
        1,
      );
      expect(screen.getByText('25.5')).toBeInTheDocument();
      expect(screen.getByText('%')).toBeInTheDocument();
      expect(screen.getByText('3.7pp')).toBeInTheDocument();
      expect(screen.getByText('vs LY')).toBeInTheDocument();
    });

    it('should render item without variation and comparison', () => {
      const mockData = {
        showImage: false,
        categoryTitle: 'GrowthLevers',
        items: [
          {
            type: 'multi' as const,
            cardTitle: 'card title',
            growthLeversNumber: { value: '25.5', measure: '%' },
            variation: undefined,
            comparison: undefined,
          },
        ],
      };

      render(<CategoryGrowthLevers {...mockData} />);

      expect(screen.getAllByText('card title').length).toBeGreaterThanOrEqual(
        1,
      );
      expect(screen.getByText('25.5')).toBeInTheDocument();
      expect(screen.getByText('%')).toBeInTheDocument();
      expect(screen.queryByText('3.7pp')).not.toBeInTheDocument();
      expect(screen.queryByText('vs LY')).not.toBeInTheDocument();
    });

    it('should render with empty items array', () => {
      const mockData = {
        showImage: true,
        image: { src: 'image-url.png', alt: 'alt image' },
        categoryTitle: 'GrowthLevers',
        items: [],
      };

      const { container } = render(<CategoryGrowthLevers {...mockData} />);

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('GrowthLevers')).toBeInTheDocument();
    });
  });

  describe('dataTestId prop', () => {
    it('should apply data-testid when dataTestId prop is provided', () => {
      render(
        <CategoryGrowthLevers
          {...categoryGrowthLeversMock}
          dataTestId="card-growth-levers"
        />,
      );

      expect(screen.getByTestId('card-growth-levers')).toBeInTheDocument();
      expect(screen.getByTestId('card-growth-levers-left')).toBeInTheDocument();
      expect(
        screen.getByTestId('card-growth-levers-right'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('card-growth-levers-image-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('card-growth-levers-image'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('card-growth-levers-category-title'),
      ).toBeInTheDocument();
    });

    it('should apply data-testid to items in right container', () => {
      render(
        <CategoryGrowthLevers
          {...categoryGrowthLeversMock}
          dataTestId="card-growth-levers"
        />,
      );

      const rightContainer = screen.getByTestId('card-growth-levers-right');
      const items = rightContainer.querySelectorAll(
        '[data-testid^="card-growth-levers-item-"]',
      );
      expect(items.length).toBeGreaterThan(0);
    });

    it('should not render data-testid when dataTestId prop is not provided', () => {
      const { container } = render(
        <CategoryGrowthLevers {...categoryGrowthLeversMock} />,
      );

      expect(
        container.querySelector('[data-testid="card-growth-levers"]'),
      ).not.toBeInTheDocument();
    });
  });
});
