import { render, screen } from '@testing-library/react';

jest.mock('@hexa-ui/components', () => ({
  Divider: ({ orientation }: any) => (
    <hr data-testid="divider" data-orientation={orientation} />
  ),
  Paragraph: ({ children, size, style }: any) => (
    <p data-testid="paragraph" data-size={size} style={style}>
      {children}
    </p>
  ),
}));

jest.mock('./VariationCaption.styles', () => ({
  StyledVariationGrid: ({
    children,
    style,
    'data-testid': dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'variation-grid'} style={style}>
      {children}
    </div>
  ),
  StyledVariationHeaderRow: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'header-row'}>{children}</div>
  ),
  StyledVariationHeaderContent: ({ children, style }: any) => (
    <div data-testid="header-content" style={style}>
      {children}
    </div>
  ),
  StyledVariationHeaderDivider: ({ children, style }: any) => (
    <div data-testid="header-divider" style={style}>
      {children}
    </div>
  ),
  StyledVariationCell: ({
    children,
    isFirstCell,
    hasDivider,
    'data-testid': dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'variation-cell'}
      data-is-first-cell={isFirstCell}
      data-has-divider={hasDivider}
    >
      {children}
    </div>
  ),
  StyledVariationValueContainer: ({ children, style }: any) => (
    <div data-testid="value-container" style={style}>
      {children}
    </div>
  ),
  StyledVariationValue: ({ children }: any) => (
    <div data-testid="variation-value">{children}</div>
  ),
  StyledParagraph: ({ children, style, divider }: any) => (
    <span data-testid="styled-paragraph" style={style} data-divider={divider}>
      {children}
    </span>
  ),
}));

import { VariationCaption } from './VariationCaption';

describe('VariationCaption', () => {
  const mockVariationCaptionData = [
    {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      data: [
        { value: '10', unit_of_measure: '%', color: '#FF0000' },
        { value: '20', unit_of_measure: 'pp', color: '#00FF00' },
      ],
    },
  ];

  it('should render StyledVariationGrid', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    expect(screen.getByTestId('variation-grid')).toBeInTheDocument();
  });

  it('should render grid with correct gridTemplateColumns', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={3}
      />,
    );

    const grid = screen.getByTestId('variation-grid');
    expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' });
  });

  it('should render grid with default padding values', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const grid = screen.getByTestId('variation-grid');
    expect(grid).toHaveStyle({ paddingLeft: '20px', paddingRight: '15px' });
  });

  it('should render grid with custom padding values', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
        paddingLeft={30}
        paddingRight={25}
      />,
    );

    const grid = screen.getByTestId('variation-grid');
    expect(grid).toHaveStyle({ paddingLeft: '30px', paddingRight: '25px' });
  });

  it('should render grid with default gap values', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const grid = screen.getByTestId('variation-grid');
    expect(grid).toHaveStyle({ columnGap: '5px', rowGap: '5px' });
  });

  it('should render grid with custom gap values', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
        columnGap={10}
        rowGap={15}
      />,
    );

    const grid = screen.getByTestId('variation-grid');
    expect(grid).toHaveStyle({ columnGap: '10px', rowGap: '15px' });
  });

  it('should render header row when title is provided', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    expect(screen.getByTestId('header-row')).toBeInTheDocument();
  });

  it('should render title in header content', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const paragraphs = screen.getAllByTestId('paragraph');
    expect(paragraphs[0]).toHaveTextContent('Test Title');
  });

  it('should render subtitle in header content', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const paragraphs = screen.getAllByTestId('paragraph');
    expect(paragraphs[1]).toHaveTextContent('Test Subtitle');
  });

  it('should render divider in header', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const divider = screen.getByTestId('divider');
    expect(divider).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('should render header content with default marginLeft', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const headerContent = screen.getByTestId('header-content');
    expect(headerContent).toHaveStyle({ marginLeft: 0 });
  });

  it('should render header content with custom marginLeft', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
        headerMarginLeft={10}
      />,
    );

    const headerContent = screen.getByTestId('header-content');
    expect(headerContent).toHaveStyle({ marginLeft: 10 });
  });

  it('should render header divider with default paddingRight', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const headerDivider = screen.getByTestId('header-divider');
    expect(headerDivider).toHaveStyle({ paddingRight: 0 });
  });

  it('should render header divider with custom paddingRight', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
        dividerPaddingRight={20}
      />,
    );

    const headerDivider = screen.getByTestId('header-divider');
    expect(headerDivider).toHaveStyle({ paddingRight: 20 });
  });

  it('should render variation cells', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const cells = screen.getAllByTestId('variation-cell');
    expect(cells).toHaveLength(2);
  });

  it('should render first cell with isFirstCell true', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const cells = screen.getAllByTestId('variation-cell');
    expect(cells[0]).toHaveAttribute('data-is-first-cell', 'true');
  });

  it('should render non-first cell with isFirstCell false', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const cells = screen.getAllByTestId('variation-cell');
    expect(cells[1]).toHaveAttribute('data-is-first-cell', 'false');
  });

  it('should render value with color', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const styledParagraphs = screen.getAllByTestId('styled-paragraph');
    expect(styledParagraphs[0]).toHaveStyle({ color: '#FF0000' });
  });

  it('should render value with unit_of_measure for numeric values', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const styledParagraphs = screen.getAllByTestId('styled-paragraph');
    expect(styledParagraphs[0]).toHaveTextContent('10%');
  });

  it('should not render header row when title and subtitle are empty', () => {
    const dataWithoutTitle = [
      {
        title: '',
        subtitle: '',
        data: [{ value: '10', unit_of_measure: '%' }],
      },
    ];

    render(
      <VariationCaption
        variationCaptionData={dataWithoutTitle}
        gridColumnsCount={1}
      />,
    );

    expect(screen.queryByTestId('header-content')).not.toBeInTheDocument();
  });

  it('should render label row when label is provided', () => {
    const dataWithLabel = [
      {
        title: '',
        subtitle: '',
        label: 'Test Label',
        data: [{ value: '10', unit_of_measure: '%' }],
      },
    ];

    render(
      <VariationCaption
        variationCaptionData={dataWithLabel}
        gridColumnsCount={1}
      />,
    );

    const paragraphs = screen.getAllByTestId('paragraph');
    const labelParagraph = paragraphs.find(
      (p) => p.getAttribute('data-size') === 'xsmall',
    );
    expect(labelParagraph).toHaveTextContent('Test Label');
  });

  it('should render array of values in value container', () => {
    const dataWithArrayValues = [
      {
        title: 'Title',
        subtitle: 'Subtitle',
        data: [
          [
            { value: '10', unit_of_measure: '%' },
            { value: '20', unit_of_measure: '%' },
          ],
        ],
      },
    ];

    render(
      <VariationCaption
        variationCaptionData={dataWithArrayValues}
        gridColumnsCount={1}
      />,
    );

    expect(screen.getByTestId('value-container')).toBeInTheDocument();
  });

  it('should render multiple variation values for array data', () => {
    const dataWithArrayValues = [
      {
        title: 'Title',
        subtitle: 'Subtitle',
        data: [
          [
            { value: '10', unit_of_measure: '%' },
            { value: '20', unit_of_measure: '%' },
          ],
        ],
      },
    ];

    render(
      <VariationCaption
        variationCaptionData={dataWithArrayValues}
        gridColumnsCount={1}
      />,
    );

    const variationValues = screen.getAllByTestId('variation-value');
    expect(variationValues).toHaveLength(2);
  });

  it('should set hasDivider false for array with multiple values', () => {
    const dataWithArrayValues = [
      {
        title: 'Title',
        subtitle: 'Subtitle',
        data: [
          [
            { value: '10', unit_of_measure: '%' },
            { value: '20', unit_of_measure: '%' },
          ],
        ],
      },
    ];

    render(
      <VariationCaption
        variationCaptionData={dataWithArrayValues}
        gridColumnsCount={1}
      />,
    );

    const cell = screen.getByTestId('variation-cell');
    expect(cell).toHaveAttribute('data-has-divider', 'false');
  });

  it('should set hasDivider true for single value', () => {
    render(
      <VariationCaption
        variationCaptionData={mockVariationCaptionData}
        gridColumnsCount={2}
      />,
    );

    const cells = screen.getAllByTestId('variation-cell');
    expect(cells[0]).toHaveAttribute('data-has-divider', 'true');
  });

  it('should render empty div when cellData is undefined', () => {
    const dataWithMissingCell = [
      {
        title: 'Title',
        subtitle: 'Subtitle',
        data: [{ value: '10', unit_of_measure: '%' }],
      },
    ];

    render(
      <VariationCaption
        variationCaptionData={dataWithMissingCell}
        gridColumnsCount={3}
      />,
    );

    const cells = screen.getAllByTestId('variation-cell');
    expect(cells).toHaveLength(1);
  });

  it('should render multiple captions', () => {
    const multipleCapitions = [
      {
        title: 'Title 1',
        subtitle: 'Subtitle 1',
        data: [{ value: '10', unit_of_measure: '%' }],
      },
      {
        title: 'Title 2',
        subtitle: 'Subtitle 2',
        data: [{ value: '20', unit_of_measure: '%' }],
      },
    ];

    render(
      <VariationCaption
        variationCaptionData={multipleCapitions}
        gridColumnsCount={1}
      />,
    );

    const headerRows = screen.getAllByTestId('header-row');
    expect(headerRows).toHaveLength(2);
  });

  it('should not render unit_of_measure for non-numeric values', () => {
    const dataWithNonNumeric = [
      {
        title: 'Title',
        subtitle: 'Subtitle',
        data: [{ value: 'N/A', unit_of_measure: '%' }],
      },
    ];

    render(
      <VariationCaption
        variationCaptionData={dataWithNonNumeric}
        gridColumnsCount={1}
      />,
    );

    const styledParagraph = screen.getByTestId('styled-paragraph');
    expect(styledParagraph).toHaveTextContent('N/A');
    expect(styledParagraph).not.toHaveTextContent('%');
  });

  describe('dataTestId prop', () => {
    it('should apply dataTestId to main grid', () => {
      render(
        <VariationCaption
          variationCaptionData={mockVariationCaptionData}
          gridColumnsCount={2}
          dataTestId="test-variation"
        />,
      );

      expect(screen.getByTestId('test-variation')).toBeInTheDocument();
    });

    it('should apply dataTestId to header rows', () => {
      render(
        <VariationCaption
          variationCaptionData={mockVariationCaptionData}
          gridColumnsCount={2}
          dataTestId="test-variation"
        />,
      );

      expect(screen.getByTestId('test-variation-header-0')).toBeInTheDocument();
    });

    it('should apply dataTestId to cells', () => {
      render(
        <VariationCaption
          variationCaptionData={mockVariationCaptionData}
          gridColumnsCount={2}
          dataTestId="test-variation"
        />,
      );

      expect(screen.getByTestId('test-variation-cell-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('test-variation-cell-0-1')).toBeInTheDocument();
    });

    it('should not apply data-testid when dataTestId is not provided', () => {
      render(
        <VariationCaption
          variationCaptionData={mockVariationCaptionData}
          gridColumnsCount={2}
        />,
      );

      expect(screen.getByTestId('variation-grid')).toBeInTheDocument();
      expect(screen.queryByTestId('test-variation')).not.toBeInTheDocument();
    });
  });
});
