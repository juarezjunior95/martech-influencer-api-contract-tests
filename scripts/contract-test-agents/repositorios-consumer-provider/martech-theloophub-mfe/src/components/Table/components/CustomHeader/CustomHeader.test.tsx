import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CustomHeader } from './CustomHeader';

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, className, color }: any) => (
    <span
      data-testid="icon"
      data-icon={icon?.name || 'icon'}
      className={className}
      data-color={color}
    >
      Icon
    </span>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  BarChart2: { name: 'BarChart2' },
  Beer: { name: 'Beer' },
  BeerBottles: { name: 'BeerBottles' },
  Info: { name: 'Info' },
  Placeholder: { name: 'Placeholder' },
  World: { name: 'World' },
}));

jest.mock('components', () => ({
  TextDynamicTruncation: ({ children }: any) => (
    <div data-testid="text-truncation">{children}</div>
  ),
}));

jest.mock('../ImgRenderer', () => ({
  ImgRenderer: ({ src, name, dataTestId }: any) => (
    <div
      data-testid="img-renderer"
      data-src={src}
      data-name={name}
      data-datatestid={dataTestId}
    >
      Image
    </div>
  ),
}));

jest.mock('utils/regex', () => ({
  isImage: {
    test: (str: string) => /\.(jpg|jpeg|png|gif|svg)$/i.test(str),
  },
}));

describe('CustomHeader', () => {
  const mockProps: any = {
    displayName: 'Test Header',
    api: {},
    column: {
      getColId: () => 'test-column-id',
    },
    columnGroup: null,
    setExpanded: jest.fn(),
  };

  it('should render the component', () => {
    const { container } = render(<CustomHeader {...mockProps} />);

    expect(
      container.querySelector('.ag-cell-label-container'),
    ).toBeInTheDocument();
  });

  it('should render displayName', () => {
    const { getByText } = render(<CustomHeader {...mockProps} />);

    expect(getByText('Test Header')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    const propsWithSubtitle = {
      ...mockProps,
      subtitle: 'Test Subtitle',
    };

    const { getByText } = render(<CustomHeader {...propsWithSubtitle} />);

    expect(getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should render tooltip icon when tooltip is provided', () => {
    const propsWithTooltip = {
      ...mockProps,
      tooltip: 'Test tooltip',
    };

    const { getAllByTestId } = render(<CustomHeader {...propsWithTooltip} />);

    const icons = getAllByTestId('icon');
    const infoIcon = icons.find(
      (icon) => icon.getAttribute('data-icon') === 'Info',
    );
    expect(infoIcon).toBeInTheDocument();
  });

  it('should render kpi icon', () => {
    const propsWithIcon = {
      ...mockProps,
      icon: 'kpi' as const,
    };

    const { getByTestId } = render(<CustomHeader {...propsWithIcon} />);

    const icon = getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon', 'BarChart2');
  });

  it('should render region icon', () => {
    const propsWithIcon = {
      ...mockProps,
      icon: 'region' as const,
    };

    const { getByTestId } = render(<CustomHeader {...propsWithIcon} />);

    const icon = getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon', 'World');
  });

  it('should render category icon', () => {
    const propsWithIcon = {
      ...mockProps,
      icon: 'category' as const,
    };

    const { getByTestId } = render(<CustomHeader {...propsWithIcon} />);

    const icon = getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon', 'BeerBottles');
  });

  it('should render brands icon', () => {
    const propsWithIcon = {
      ...mockProps,
      icon: 'brands' as const,
    };

    const { getByTestId } = render(<CustomHeader {...propsWithIcon} />);

    const icon = getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon', 'Beer');
  });

  it('should render empty icon', () => {
    const propsWithIcon = {
      ...mockProps,
      icon: 'empty' as const,
    };

    const { getByTestId } = render(<CustomHeader {...propsWithIcon} />);

    const icon = getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon', 'Placeholder');
  });

  it('should render ImgRenderer when displayName is image URL', () => {
    const propsWithImage = {
      ...mockProps,
      displayName: 'https://example.com/image.png',
      imgName: 'Test Image',
    };

    const { getByTestId } = render(<CustomHeader {...propsWithImage} />);

    const imgRenderer = getByTestId('img-renderer');
    expect(imgRenderer).toBeInTheDocument();
    expect(imgRenderer).toHaveAttribute(
      'data-src',
      'https://example.com/image.png',
    );
    expect(imgRenderer).toHaveAttribute('data-name', 'Test Image');
  });

  it('should render TextDynamicTruncation when shouldTruncate is true', () => {
    const propsWithTruncate = {
      ...mockProps,
      shouldTruncate: true,
    };

    const { getByTestId } = render(<CustomHeader {...propsWithTruncate} />);

    expect(getByTestId('text-truncation')).toBeInTheDocument();
    expect(getByTestId('text-truncation')).toHaveTextContent('Test Header');
  });

  it('should not render tooltip icon when tooltip is not provided', () => {
    const { container } = render(<CustomHeader {...mockProps} />);

    const tooltipIcon = container.querySelector('.ag-header-cell-tooltip-icon');
    expect(tooltipIcon).not.toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    const { container } = render(<CustomHeader {...mockProps} />);

    const subtitle = container.querySelector('.ag-header-cell-subtext');
    expect(subtitle).not.toBeInTheDocument();
  });

  it('should not render icon when not provided', () => {
    const { container } = render(<CustomHeader {...mockProps} />);

    const iconInText = container.querySelector(
      '.ag-header-cell-icon-text .icon',
    );
    expect(iconInText).not.toBeInTheDocument();
  });

  it('should render with data-testid on container when provided', () => {
    const { container } = render(
      <CustomHeader {...mockProps} dataTestId="test-header" />,
    );

    const headerContainer = container.querySelector(
      '[data-testid="custom-header-test-header"]',
    );
    expect(headerContainer).toBeInTheDocument();
  });

  it('should render with data-testid using columnId as fallback when dataTestId is not provided', () => {
    const { container } = render(<CustomHeader {...mockProps} />);

    const headerContainer = container.querySelector(
      '[data-testid="custom-header-test-column-id"]',
    );
    expect(headerContainer).toBeInTheDocument();
  });

  it('should pass dataTestId to ImgRenderer when displayName is an image', () => {
    const { container } = render(
      <CustomHeader
        {...mockProps}
        displayName="brand-logo.png"
        imgName="Test Brand"
        dataTestId="brand-header"
      />,
    );

    const imgRenderer = container.querySelector('[data-testid="img-renderer"]');
    expect(imgRenderer).toBeInTheDocument();
    expect(imgRenderer).toHaveAttribute('data-datatestid', 'brand-header');
  });

  it('should sanitize columnId for data-testid (remove special chars, spaces, accents)', () => {
    const propsWithSpecialChars = {
      ...mockProps,
      column: {
        getColId: () => "25'dec Volume (HL)",
      },
    };

    const { container } = render(<CustomHeader {...propsWithSpecialChars} />);

    const headerContainer = container.querySelector(
      '[data-testid="custom-header-25-dec-volume-hl"]',
    );
    expect(headerContainer).toBeInTheDocument();
  });

  it('should sanitize displayName when used as fallback', () => {
    const propsWithSpecialDisplayName = {
      ...mockProps,
      column: null,
      displayName: 'Portfolio Performance (Açaí & Café)',
    };

    const { container } = render(
      <CustomHeader {...propsWithSpecialDisplayName} />,
    );

    const headerContainer = container.querySelector(
      '[data-testid="custom-header-portfolio-performance-acai-cafe"]',
    );
    expect(headerContainer).toBeInTheDocument();
  });
});
