import { render, screen } from '@testing-library/react';
import { useIsInExportPage } from 'hooks';

import {
  CategoryOverview,
  CategoryOverviewInterface,
} from './CategoryOverview';

jest.mock('@hexa-ui/components', () => ({
  Heading: ({ children, size, alignment, style, ...props }: any) => (
    <div
      className="hexa-heading"
      data-size={size}
      data-alignment={alignment}
      style={style}
      {...props}
    >
      {children}
    </div>
  ),
  Paragraph: ({
    children,
    size,
    alignment,
    colortype,
    style,
    ...props
  }: any) => (
    <div
      className="hexa-paragraph"
      data-size={size}
      data-alignment={alignment}
      data-colortype={colortype}
      style={style}
      {...props}
    >
      {children}
    </div>
  ),
  Grid: {
    Container: ({ children, ...props }: any) => (
      <div className="grid-container" {...props}>
        {children}
      </div>
    ),
    Item: ({ children, ...props }: any) => (
      <div className="grid-item" {...props}>
        {children}
      </div>
    ),
  },
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon: _icon, size, 'data-testid': testId, ...props }: any) => (
    <div className="hexa-icon" data-testid={testId} data-size={size} {...props}>
      Icon
    </div>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: 'Info',
}));

jest.mock('@hexa-ui/theme', () => ({
  styled: (component: any, _styles: any) => {
    return ({ children, ...props }: any) => {
      const Component = typeof component === 'string' ? component : 'div';
      return <Component {...props}>{children}</Component>;
    };
  },
}));

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({ children, content, dataTestId }: any) => (
    <div className="custom-tooltip" data-testid={dataTestId}>
      {children}
      <div
        className="tooltip-content"
        data-testid={dataTestId ? `${dataTestId}-content` : undefined}
      >
        {content}
      </div>
    </div>
  ),
}));

jest.mock('./components', () => ({
  GridHolderComponent: ({ data, dataTestId }: any) => (
    <div
      className="grid-holder-component"
      data-testid={dataTestId}
      data-title={data?.title}
    >
      Grid Holder Content
    </div>
  ),
}));

jest.mock('hooks', () => ({
  useIsInExportPage: jest.fn(),
}));

const mockUseIsInExportPage = useIsInExportPage as jest.Mock;
const mockCategoryOverview: CategoryOverviewInterface = {
  title: 'Category Overview',
  versus: "vs Q1'24 YTD",
  dateRefresh: "Q1'25",
  kpi: {
    header: [
      { id: 'label', title: '' },
      { id: 'mix', title: 'MIX' },
      { id: 'vsLy', title: 'vs LY' },
    ],
    rows: [
      {
        label: 'Vol',
        mix: {
          value: 2.1,
          unitOfMeasure: '%',
        },
        vsLy: {
          value: 2.1,
          unitOfMeasure: 'pp',
          direction: 'up',
        },
      },
    ],
  },
  tooltip: 'This is a tooltip content',
};

describe('CategoryOverview', () => {
  beforeEach(() => {
    mockUseIsInExportPage.mockReturnValue(false);
  });

  it('should render the component', () => {
    const { container } = render(
      <CategoryOverview data={mockCategoryOverview} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render the title', () => {
    const { container } = render(
      <CategoryOverview data={mockCategoryOverview} />,
    );

    const heading = container.querySelector('.hexa-heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(mockCategoryOverview.title);
  });

  it('should render the versus information', () => {
    const { container } = render(
      <CategoryOverview data={mockCategoryOverview} />,
    );

    const paragraph = container.querySelector('.hexa-paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(mockCategoryOverview.versus);
  });

  it('should render the background image', () => {
    const { container } = render(
      <CategoryOverview data={mockCategoryOverview} />,
    );

    expect(container.querySelector('[backgroundimage]')).toBeInTheDocument();
  });

  it('should render the grid holder component', () => {
    const { container } = render(
      <CategoryOverview data={mockCategoryOverview} />,
    );

    const gridHolder = container.querySelector('.grid-holder-component');
    expect(gridHolder).toBeInTheDocument();
    expect(gridHolder).toHaveAttribute(
      'data-title',
      mockCategoryOverview.title,
    );
  });

  it('should apply data-testid when dataTestId prop is provided', () => {
    render(
      <CategoryOverview
        data={mockCategoryOverview}
        dataTestId="card-category-overview"
      />,
    );

    expect(screen.getByTestId('card-category-overview')).toBeInTheDocument();
    expect(
      screen.getByTestId('card-category-overview-title'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('card-category-overview-tooltip'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('card-category-overview-tooltip-icon'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('card-category-overview-grid-holder'),
    ).toBeInTheDocument();
  });

  it('should not render data-testid when dataTestId prop is not provided', () => {
    const { container } = render(
      <CategoryOverview data={mockCategoryOverview} />,
    );

    expect(
      container.querySelector('[data-testid="card-category-overview"]'),
    ).not.toBeInTheDocument();
  });
});
