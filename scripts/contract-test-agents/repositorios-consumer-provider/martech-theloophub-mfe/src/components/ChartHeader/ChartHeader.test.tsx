import { render, screen } from '@testing-library/react';

import { ChartHeader } from './ChartHeader';
import { IChartHeaderProps } from './types/interface';

jest.mock('@hexa-ui/components', () => ({
  Heading: ({ children, size, 'data-testid': testId }: any) => (
    <h1 className="hexa-heading" data-testid={testId} data-size={size}>
      {children}
    </h1>
  ),
  Paragraph: ({ children }: any) => (
    <p className="hexa-paragraph">{children}</p>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: 'info-icon',
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, size }: any) => (
    <span data-testid="icon" data-icon={icon} data-size={size}>
      Icon
    </span>
  ),
}));

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({ children, content, size, dataTestId }: any) => (
    <div className="custom-tooltip" data-testid={dataTestId} data-size={size}>
      {content}
      {children}
    </div>
  ),
}));

jest.mock('./ChartHeader.styles', () => ({
  StyledHeaderContainer: ({
    children,
    float,
    inline,
    'data-testid': testId,
  }: any) => (
    <div
      className="header-container"
      data-testid={testId}
      data-float={float}
      data-inline={inline}
    >
      {children}
    </div>
  ),
  StyledHeaderContent: ({ children, 'data-testid': testId }: any) => (
    <div className="header-content" data-testid={testId}>
      {children}
    </div>
  ),
  StyledContentContainer: ({ children, inline, style }: any) => (
    <div className="content-container" data-inline={inline} style={style}>
      {children}
    </div>
  ),
  StyledRowContainer: ({ children, inline }: any) => (
    <div className="row-container" data-inline={inline}>
      {children}
    </div>
  ),
  StyledTitle: ({ children, size, 'data-testid': testId }: any) => (
    <p className="styled-title" data-testid={testId} data-size={size}>
      {children}
    </p>
  ),
  StyledTitleContainer: ({ children, vertical, style }: any) => (
    <div className="title-container" data-vertical={vertical} style={style}>
      {children}
    </div>
  ),
  MeasureText: ({ children, size, isVertical, 'data-testid': testId }: any) => (
    <span
      className="measure-text"
      data-testid={testId}
      data-size={size}
      data-is-vertical={isVertical}
    >
      {children}
    </span>
  ),
  DescriptionText: ({ children, size, 'data-testid': testId }: any) => (
    <p className="description-text" data-testid={testId} data-size={size}>
      {children}
    </p>
  ),
  StyledIconInfo: ({ icon, size, 'data-testid': testId }: any) => (
    <span
      className="icon-info"
      data-testid={testId}
      data-icon={icon}
      data-size={size}
    >
      Icon
    </span>
  ),
  StyledChipRoot: ({ children, disabled, 'data-testid': testId }: any) => (
    <div className="chip-root" data-testid={testId} data-disabled={disabled}>
      {children}
    </div>
  ),
  StyledChipLabel: ({ children }: any) => (
    <span className="chip-label">{children}</span>
  ),
  StyledTopRightChipRoot: ({
    children,
    disabled,
    'data-testid': testId,
  }: any) => (
    <div
      className="chip-root-top-right"
      data-testid={testId}
      data-disabled={disabled}
    >
      {children}
    </div>
  ),
  StyledActionsContainer: ({ children, 'data-testid': testId }: any) => (
    <div className="actions-container" data-testid={testId}>
      {children}
    </div>
  ),
}));

describe('ChartHeader Component', () => {
  const defaultProps: IChartHeaderProps = {
    title: 'Chart Title',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with only required props (title)', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      expect(container.querySelector('.header-container')).toBeInTheDocument();
      expect(screen.getByText('Chart Title')).toBeInTheDocument();
    });

    it('should render title with default H5 size', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      const title = container.querySelector('.styled-title');
      expect(title).toBeInTheDocument();
    });

    it('should render title with H4 size when type is large', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ type: 'large' }} />,
      );

      const title = container.querySelector('.styled-title');
      expect(title).toHaveAttribute('data-size', 'large');
    });

    it('should render title with H5 size when type is small', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ type: 'small' }} />,
      );

      const title = container.querySelector('.styled-title');
      expect(title).toHaveAttribute('data-size', 'small');
    });
  });

  describe('Optional Props', () => {
    it('should render measure when provided', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} measure="Revenue (USD)" />,
      );

      expect(container.querySelector('.measure-text')).toBeInTheDocument();
      expect(screen.getByText('Revenue (USD)')).toBeInTheDocument();
    });

    it('should not render measure when not provided', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      expect(container.querySelector('.measure-text')).not.toBeInTheDocument();
    });

    it('should render measure with xsmall size by default', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} measure="Revenue" />,
      );

      const measureText = container.querySelector('.measure-text');
      expect(measureText).toHaveAttribute('data-size', 'xsmall');
    });

    it('should render measure with small size when type is large', () => {
      const { container } = render(
        <ChartHeader
          {...defaultProps}
          measure="Revenue"
          config={{ type: 'large' }}
        />,
      );

      const measureText = container.querySelector('.measure-text');
      expect(measureText).toHaveAttribute('data-size', 'small');
    });

    it('should render info tooltip when provided', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} info="This is a tooltip" />,
      );

      expect(container.querySelector('.custom-tooltip')).toBeInTheDocument();
      expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
    });

    it('should not render info tooltip when not provided', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      expect(
        container.querySelector('.custom-tooltip'),
      ).not.toBeInTheDocument();
    });

    it('should render period chip when provided', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} period="Jan 2024" />,
      );

      expect(container.querySelector('.chip-root')).toBeInTheDocument();
      expect(container.querySelector('.chip-label')).toBeInTheDocument();
      expect(screen.getByText('Jan 2024')).toBeInTheDocument();
    });

    it('should render period chip as disabled', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} period="Jan 2024" />,
      );

      const chipRoot = container.querySelector('.chip-root');
      expect(chipRoot).toHaveAttribute('data-disabled', 'true');
    });

    it('should not render period chip when not provided', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      expect(container.querySelector('.chip-root')).not.toBeInTheDocument();
    });

    it('should render description when provided', () => {
      const { container } = render(
        <ChartHeader
          {...defaultProps}
          description="This is a chart description"
        />,
      );

      expect(container.querySelector('.description-text')).toBeInTheDocument();
      expect(
        screen.getByText('This is a chart description'),
      ).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      expect(
        container.querySelector('.description-text'),
      ).not.toBeInTheDocument();
    });

    it('should render description with xsmall size', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} description="Description" />,
      );

      const descriptionText = container.querySelector('.description-text');
      expect(descriptionText).toHaveAttribute('data-size', 'xsmall');
    });
  });

  describe('Actions', () => {
    it('should render actions container when actions are provided', () => {
      const actions = [
        <button key="action-1">Action 1</button>,
        <button key="action-2">Action 2</button>,
      ];

      const { container } = render(
        <ChartHeader {...defaultProps} actions={actions} />,
      );

      expect(container.querySelector('.actions-container')).toBeInTheDocument();
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('should not render actions container when actions are not provided', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      expect(
        container.querySelector('.actions-container'),
      ).not.toBeInTheDocument();
    });

    it('should render multiple actions', () => {
      const actions = [
        <div key="1" data-testid="action-1">
          Action 1
        </div>,
        <div key="2" data-testid="action-2">
          Action 2
        </div>,
        <div key="3" data-testid="action-3">
          Action 3
        </div>,
      ];

      render(<ChartHeader {...defaultProps} actions={actions} />);

      expect(screen.getByTestId('action-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-2')).toBeInTheDocument();
      expect(screen.getByTestId('action-3')).toBeInTheDocument();
    });

    it('should render single action', () => {
      const actions = [<button key="single">Single Action</button>];

      render(<ChartHeader {...defaultProps} actions={actions} />);

      expect(screen.getByText('Single Action')).toBeInTheDocument();
    });
  });

  describe('Config - Float', () => {
    it('should apply float config when provided', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ float: true }} />,
      );

      const headerContainer = container.querySelector('.header-container');
      expect(headerContainer).toHaveAttribute('data-float', 'true');
    });

    it('should not apply float by default', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      const headerContainer = container.querySelector('.header-container');
      expect(headerContainer).not.toHaveAttribute('data-float', 'true');
    });
  });

  describe('Config - Inline', () => {
    it('should apply inline when inline is horizontal', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ inline: 'horizontal' }} />,
      );

      const headerContainer = container.querySelector('.header-container');
      expect(headerContainer).toHaveAttribute('data-inline', 'true');
    });

    it('should apply inline when inline is vertical', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ inline: 'vertical' }} />,
      );

      const headerContainer = container.querySelector('.header-container');
      expect(headerContainer).toHaveAttribute('data-inline', 'true');
    });

    it('should not apply inline when inline is none', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ inline: 'none' }} />,
      );

      const headerContainer = container.querySelector('.header-container');
      expect(headerContainer).toHaveAttribute('data-inline', 'false');
    });

    it('should not apply inline by default', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      const headerContainer = container.querySelector('.header-container');
      expect(headerContainer).not.toHaveAttribute('data-inline', 'true');
    });

    it('should set title container to vertical when inline is vertical', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ inline: 'vertical' }} />,
      );

      const titleContainer = container.querySelector('.title-container');
      expect(titleContainer).toHaveAttribute('data-vertical', 'true');
    });

    it('should set measure text as vertical when inline is vertical', () => {
      const { container } = render(
        <ChartHeader
          {...defaultProps}
          measure="Measure"
          config={{ inline: 'vertical' }}
        />,
      );

      const measureText = container.querySelector('.measure-text');
      expect(measureText).toHaveAttribute('data-is-vertical', 'true');
    });

    it('should apply flexDirection column style when inline is vertical', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ inline: 'vertical' }} />,
      );

      const titleContainer = container.querySelector('.title-container');
      expect(titleContainer).toHaveStyle({ flexDirection: 'column' });
    });

    it('should apply flexDirection row style when inline is not vertical', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ inline: 'horizontal' }} />,
      );

      const titleContainer = container.querySelector('.title-container');
      expect(titleContainer).toHaveStyle({ flexDirection: 'row' });
    });
  });

  describe('Config - Alignment', () => {
    it('should apply left alignment', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ alignment: 'left' }} />,
      );

      const contentContainer = container.querySelector('.content-container');
      expect(contentContainer).toHaveStyle({ alignItems: 'flex-start' });
    });

    it('should apply center alignment', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ alignment: 'center' }} />,
      );

      const contentContainer = container.querySelector('.content-container');
      expect(contentContainer).toHaveStyle({ alignItems: 'center' });
    });

    it('should default to flex-start when alignment is not provided', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      const contentContainer = container.querySelector('.content-container');
      expect(contentContainer).toHaveStyle({ alignItems: 'flex-start' });
    });
  });

  describe('Complex Scenarios', () => {
    it('should render with all props provided', () => {
      const actions = [<button key="action">Action</button>];
      const allProps: IChartHeaderProps = {
        title: 'Complete Chart',
        measure: 'Revenue (USD)',
        info: 'Tooltip information',
        period: 'Jan 2024',
        description: 'Complete description',
        actions,
        config: {
          float: true,
          inline: 'vertical',
          type: 'large',
          alignment: 'center',
        },
      };

      render(<ChartHeader {...allProps} />);

      expect(screen.getByText('Complete Chart')).toBeInTheDocument();
      expect(screen.getByText('Revenue (USD)')).toBeInTheDocument();
      expect(screen.getByText('Tooltip information')).toBeInTheDocument();
      expect(screen.getByText('Jan 2024')).toBeInTheDocument();
      expect(screen.getByText('Complete description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('should render with minimal config', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} config={{ type: 'small' }} />,
      );

      expect(screen.getByText('Chart Title')).toBeInTheDocument();
      const title = container.querySelector('.styled-title');
      expect(title).toHaveAttribute('data-size', 'small');
    });

    it('should render with period and description together', () => {
      const { container } = render(
        <ChartHeader
          {...defaultProps}
          period="Jan 2024"
          description="Description text"
        />,
      );

      expect(container.querySelector('.chip-root')).toBeInTheDocument();
      expect(container.querySelector('.description-text')).toBeInTheDocument();
    });

    it('should render tooltip with correct size', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} info="Tooltip" />,
      );

      const tooltip = container.querySelector('.custom-tooltip');
      expect(tooltip).toHaveAttribute('data-size', 'small');
    });

    it('should render icon info with correct size', () => {
      const { container } = render(
        <ChartHeader {...defaultProps} info="Info" />,
      );

      const iconInfo = container.querySelector('.icon-info');
      expect(iconInfo).toHaveAttribute('data-size', 'large');
    });
  });

  describe('dataTestId prop', () => {
    it('should apply data-testid when dataTestId prop is provided', () => {
      render(
        <ChartHeader {...defaultProps} dataTestId="chart-header-revenue" />,
      );

      expect(screen.getByTestId('chart-header-revenue')).toBeInTheDocument();
      expect(
        screen.getByTestId('chart-header-revenue-content'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('chart-header-revenue-title'),
      ).toBeInTheDocument();
    });

    it('should apply data-testid to optional elements when provided', () => {
      render(
        <ChartHeader
          {...defaultProps}
          measure="Measure"
          info="Info"
          period="Jan 2024"
          description="Description"
          dataTestId="chart-header"
        />,
      );

      expect(screen.getByTestId('chart-header-measure')).toBeInTheDocument();
      expect(screen.getByTestId('chart-header-tooltip')).toBeInTheDocument();
      expect(
        screen.getByTestId('chart-header-tooltip-icon'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('chart-header-period')).toBeInTheDocument();
      expect(
        screen.getByTestId('chart-header-description'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId prop is not provided', () => {
      const { container } = render(<ChartHeader {...defaultProps} />);

      expect(
        container.querySelector('[data-testid="chart-header"]'),
      ).not.toBeInTheDocument();
      expect(container.querySelector('.header-container')).toBeInTheDocument();
    });
  });
});
