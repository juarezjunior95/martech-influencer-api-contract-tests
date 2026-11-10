import React from 'react';

import { render, screen } from '@testing-library/react';
import { Line } from 'components/Chart/Line';

import { SparkLine } from './SparkLine';

jest.mock('components/Chart/Line', () => ({
  Line: jest.fn((props: { datasets?: unknown[] }) => (
    <div data-testid="line-chart">{props.datasets?.length ?? 0} dataset(s)</div>
  )),
}));

const getLineProps = () => (Line as jest.Mock).mock.calls[0][0];

describe('SparkLine', () => {
  const mockDatasets = [
    {
      label: 'Dataset 1',
      data: [1, 2, 1],
    },
  ];
  const mockLabels = ['Label', 'Label', 'Label'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Line component', () => {
      render(<SparkLine datasets={mockDatasets} labels={mockLabels} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should pass datasets with fill, gradient and point config to Line', () => {
      render(<SparkLine datasets={mockDatasets} labels={mockLabels} />);

      const { datasets } = getLineProps();
      const dataset = datasets[0];

      expect(dataset.fill).toBe(true);
      expect(typeof dataset.backgroundColor).toBe('function');
      expect(typeof dataset.pointRadius).toBe('function');
      expect(typeof dataset.pointHoverRadius).toBe('function');
      expect(dataset.pointBackgroundColor).toBe('#DEB333');
      expect(dataset.pointBorderColor).toBe('#FFFFFF');
    });

    it('should forward labels and rest props to Line', () => {
      render(
        <SparkLine
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={[['1.0', '2.0', '1.0']]}
          showDivider
        />,
      );

      const props = getLineProps();
      expect(props.labels).toEqual(mockLabels);
      expect(props.formattedData).toEqual([['1.0', '2.0', '1.0']]);
      expect(props.showDivider).toBe(true);
    });

    it('should pass SparkLine fixed props to Line', () => {
      render(<SparkLine datasets={mockDatasets} labels={mockLabels} />);

      const props = getLineProps();
      expect(props.axisType).toBe('none');
      expect(props.showLabels).toBe(false);
      expect(props.showGrid).toBe(false);
      expect(props.drawZeroLine).toBe(false);
      expect(props.spacing).toBe(0);
      expect(props.labelColors).toEqual(['transparent']);
    });

    it('should pass options with hidden axes to Line', () => {
      render(<SparkLine datasets={mockDatasets} labels={mockLabels} />);

      const { options } = getLineProps();
      expect(options.scales?.x?.display).toBe(false);
      expect(options.scales?.y?.display).toBe(false);
    });

    it('should render nothing when the primary dataset has only one point', () => {
      const singlePointDatasets = [{ label: 'One', data: [7.5] }];
      const singleLabel = ['only'];

      const { container } = render(
        <SparkLine datasets={singlePointDatasets} labels={singleLabel} />,
      );

      expect(container.firstChild).toBeNull();
      expect(Line).not.toHaveBeenCalled();
    });
  });

  describe('Color prop', () => {
    it('should inject color as borderColor and point colors in datasets', () => {
      render(
        <SparkLine
          datasets={mockDatasets}
          labels={mockLabels}
          color="#9F33E0"
        />,
      );

      const { datasets } = getLineProps();
      expect(datasets[0].borderColor).toBe('#9F33E0');
      expect(datasets[0].pointBackgroundColor).toBe('#9F33E0');
      expect(datasets[0].pointHoverBackgroundColor).toBe('#9F33E0');
    });

    it('should use default color when color prop is not provided', () => {
      render(<SparkLine datasets={mockDatasets} labels={mockLabels} />);

      const { datasets } = getLineProps();
      expect(datasets[0].borderColor).toBe('#DEB333');
    });
  });

  describe('Gradient options', () => {
    it('should apply gradient via backgroundColor when gradientOptions not provided', () => {
      render(<SparkLine datasets={mockDatasets} labels={mockLabels} />);

      const { datasets } = getLineProps();
      expect(datasets[0].backgroundColor).toBeDefined();
      expect(typeof datasets[0].backgroundColor).toBe('function');
    });

    it('should use gradientOptions for gradient opacity', () => {
      render(
        <SparkLine
          datasets={mockDatasets}
          labels={mockLabels}
          gradientOptions={{ opacityStart: 0.5, opacityEnd: 0.1 }}
        />,
      );

      const { datasets } = getLineProps();
      expect(datasets[0].fill).toBe(true);
      expect(datasets[0].backgroundColor).toBeDefined();
    });
  });

  describe('Point visibility', () => {
    it('should set pointRadius only on last data point', () => {
      render(<SparkLine datasets={mockDatasets} labels={mockLabels} />);

      const { datasets } = getLineProps();
      const pointRadius = datasets[0].pointRadius;
      expect(pointRadius({ dataIndex: 0 })).toBe(0);
      expect(pointRadius({ dataIndex: 1 })).toBe(0);
      expect(pointRadius({ dataIndex: 2 })).toBe(5);
    });
  });
});
