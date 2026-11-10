import React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { GanttRow } from '../../../../GanttChart/types/Gantt';
import { GanttChartRenderer } from './GanttChartRenderer';

jest.mock('components/GanttChart/components', () => ({
  GanttChartBody: ({ rows, dataTestId }: any) => (
    <div
      data-testid={
        dataTestId ? `gantt-chart-body-${dataTestId}` : 'gantt-chart-body'
      }
    >
      <div data-testid="rows-data">{JSON.stringify(rows)}</div>
      <div data-testid="rows-count">{rows?.length || 0}</div>
    </div>
  ),
}));

describe('GanttChartRenderer', () => {
  const mockGanttData: GanttRow[] = [
    {
      id: '1',
      label: 'Task 1',
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      cells: [],
    } as GanttRow,
    {
      id: '2',
      label: 'Task 2',
      startDate: '2024-01-10',
      endDate: '2024-01-20',
      cells: [],
    } as GanttRow,
  ];

  it('should render the component', () => {
    render(<GanttChartRenderer ganttData={mockGanttData} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
  });

  it('should render wrapper div with correct styles', () => {
    const { container } = render(
      <GanttChartRenderer ganttData={mockGanttData} />,
    );

    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv).toHaveStyle({
      width: '100%',
      height: '100%',
    });
  });

  it('should pass ganttData to GanttChartBody as rows prop', () => {
    render(<GanttChartRenderer ganttData={mockGanttData} />);

    const rowsData = screen.getByTestId('rows-data');
    expect(rowsData).toHaveTextContent('"id":"1"');
    expect(rowsData).toHaveTextContent('"label":"Task 1"');
    expect(rowsData).toHaveTextContent('"id":"2"');
    expect(rowsData).toHaveTextContent('"label":"Task 2"');
  });

  it('should pass correct number of rows', () => {
    render(<GanttChartRenderer ganttData={mockGanttData} />);

    const rowsCount = screen.getByTestId('rows-count');
    expect(rowsCount).toHaveTextContent('2');
  });

  it('should render with empty ganttData array', () => {
    render(<GanttChartRenderer ganttData={[]} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
    expect(screen.getByTestId('rows-count')).toHaveTextContent('0');
  });

  it('should render with single row', () => {
    const singleRow: GanttRow[] = [
      {
        id: '1',
        label: 'Single Task',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        cells: [],
      } as GanttRow,
    ];

    render(<GanttChartRenderer ganttData={singleRow} />);

    const rowsCount = screen.getByTestId('rows-count');
    expect(rowsCount).toHaveTextContent('1');
  });

  it('should render with multiple rows', () => {
    const manyRows: GanttRow[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      label: `Task ${i + 1}`,
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      cells: [],
    })) as GanttRow[];

    render(<GanttChartRenderer ganttData={manyRows} />);

    const rowsCount = screen.getByTestId('rows-count');
    expect(rowsCount).toHaveTextContent('10');
  });

  it('should handle ganttData with complex row structure', () => {
    const complexData: GanttRow[] = [
      {
        id: '1',
        label: 'Parent Task',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        cells: [],
        children: [
          {
            id: '1.1',
            label: 'Child Task',
            startDate: '2024-01-01',
            endDate: '2024-01-15',
            cells: [],
          },
        ],
      } as GanttRow,
    ];

    render(<GanttChartRenderer ganttData={complexData} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
  });

  it('should render correctly when ganttData is undefined', () => {
    render(<GanttChartRenderer ganttData={undefined as any} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
    expect(screen.getByTestId('rows-count')).toHaveTextContent('0');
  });

  it('should render correctly when ganttData is null', () => {
    render(<GanttChartRenderer ganttData={null as any} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
    expect(screen.getByTestId('rows-count')).toHaveTextContent('0');
  });

  it('should have correct wrapper structure', () => {
    const { container } = render(
      <GanttChartRenderer ganttData={mockGanttData} />,
    );

    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv.tagName).toBe('DIV');
    expect(wrapperDiv).toContainElement(screen.getByTestId('gantt-chart-body'));
  });

  it('should pass all row properties to GanttChartBody', () => {
    const dataWithAllProps: GanttRow[] = [
      {
        id: '1',
        label: 'Full Task',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        progress: 50,
        dependencies: ['task-0'],
        cells: [],
      } as GanttRow,
    ];

    render(<GanttChartRenderer ganttData={dataWithAllProps} />);

    const rowsData = screen.getByTestId('rows-data');
    expect(rowsData).toHaveTextContent('"progress":50');
    expect(rowsData).toHaveTextContent('"dependencies"');
  });

  it('should handle ganttData with date objects', () => {
    const dataWithDates: GanttRow[] = [
      {
        id: '1',
        label: 'Task',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-15'),
        cells: [],
      } as any,
    ];

    render(<GanttChartRenderer ganttData={dataWithDates} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
  });

  it('should update when ganttData changes', () => {
    const initialData: GanttRow[] = [
      {
        id: '1',
        label: 'Initial Task',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        cells: [],
      } as GanttRow,
    ];

    const { rerender } = render(<GanttChartRenderer ganttData={initialData} />);

    expect(screen.getByTestId('rows-data')).toHaveTextContent('Initial Task');

    const updatedData: GanttRow[] = [
      {
        id: '2',
        label: 'Updated Task',
        startDate: '2024-02-01',
        endDate: '2024-02-15',
        cells: [],
      } as GanttRow,
    ];

    rerender(<GanttChartRenderer ganttData={updatedData} />);

    expect(screen.getByTestId('rows-data')).toHaveTextContent('Updated Task');
    expect(screen.getByTestId('rows-data')).not.toHaveTextContent(
      'Initial Task',
    );
  });

  it('should update when ganttData length changes', () => {
    const { rerender } = render(
      <GanttChartRenderer ganttData={mockGanttData} />,
    );

    expect(screen.getByTestId('rows-count')).toHaveTextContent('2');

    const newData: GanttRow[] = [
      ...mockGanttData,
      {
        id: '3',
        label: 'Task 3',
        startDate: '2024-01-20',
        endDate: '2024-01-30',
        cells: [],
      } as GanttRow,
    ];

    rerender(<GanttChartRenderer ganttData={newData} />);

    expect(screen.getByTestId('rows-count')).toHaveTextContent('3');
  });

  it('should transition from empty to populated data', () => {
    const { rerender } = render(<GanttChartRenderer ganttData={[]} />);

    expect(screen.getByTestId('rows-count')).toHaveTextContent('0');

    rerender(<GanttChartRenderer ganttData={mockGanttData} />);

    expect(screen.getByTestId('rows-count')).toHaveTextContent('2');
  });

  it('should transition from populated to empty data', () => {
    const { rerender } = render(
      <GanttChartRenderer ganttData={mockGanttData} />,
    );

    expect(screen.getByTestId('rows-count')).toHaveTextContent('2');

    rerender(<GanttChartRenderer ganttData={[]} />);

    expect(screen.getByTestId('rows-count')).toHaveTextContent('0');
  });

  it('should handle very large datasets', () => {
    const largeData: GanttRow[] = Array.from({ length: 1000 }, (_, i) => ({
      id: `task-${i}`,
      label: `Task ${i}`,
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      cells: [],
    })) as GanttRow[];

    render(<GanttChartRenderer ganttData={largeData} />);

    expect(screen.getByTestId('rows-count')).toHaveTextContent('1000');
  });

  it('should handle rows with missing optional properties', () => {
    const minimalData: GanttRow[] = [
      {
        id: '1',
        label: 'Minimal Task',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        cells: [],
      } as GanttRow,
    ];

    render(<GanttChartRenderer ganttData={minimalData} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
  });

  it('should handle rows with special characters in labels', () => {
    const specialData: GanttRow[] = [
      {
        id: '1',
        label: 'Task with @#$%^&*() special chars',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        cells: [],
      } as GanttRow,
    ];

    render(<GanttChartRenderer ganttData={specialData} />);

    expect(screen.getByTestId('rows-data')).toHaveTextContent(
      'Task with @#$%^&*() special chars',
    );
  });

  it('should handle rows with empty string labels', () => {
    const emptyLabelData: GanttRow[] = [
      {
        id: '1',
        label: '',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        cells: [],
      } as GanttRow,
    ];

    render(<GanttChartRenderer ganttData={emptyLabelData} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
  });

  it('should handle rows with numeric IDs', () => {
    const numericIdData: GanttRow[] = [
      {
        id: 1,
        label: 'Task with numeric ID',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
      } as any,
    ];

    render(<GanttChartRenderer ganttData={numericIdData} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
  });

  it('should maintain wrapper div structure across re-renders', () => {
    const { container, rerender } = render(
      <GanttChartRenderer ganttData={mockGanttData} />,
    );

    const initialWrapper = container.firstChild as HTMLElement;
    expect(initialWrapper.tagName).toBe('DIV');

    rerender(<GanttChartRenderer ganttData={[]} />);

    const updatedWrapper = container.firstChild as HTMLElement;
    expect(updatedWrapper.tagName).toBe('DIV');
  });

  it('should render without errors when rows have duplicate IDs', () => {
    const duplicateIdData: GanttRow[] = [
      {
        id: '1',
        label: 'Task 1',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        cells: [],
      } as GanttRow,
      {
        id: '1',
        label: 'Task 2',
        startDate: '2024-01-10',
        endDate: '2024-01-20',
        cells: [],
      } as GanttRow,
    ];

    render(<GanttChartRenderer ganttData={duplicateIdData} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
  });

  it('should render JSX Element correctly', () => {
    const { container } = render(
      <GanttChartRenderer ganttData={mockGanttData} />,
    );

    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it('should pass ganttData reference to GanttChartBody', () => {
    render(<GanttChartRenderer ganttData={mockGanttData} />);

    const rowsData = screen.getByTestId('rows-data');
    const parsedData = JSON.parse(rowsData.textContent || '[]');

    expect(parsedData).toHaveLength(2);
    expect(parsedData[0].id).toBe('1');
    expect(parsedData[1].id).toBe('2');
  });

  it('should handle consecutive renders with same data', () => {
    const { rerender } = render(
      <GanttChartRenderer ganttData={mockGanttData} />,
    );

    const firstRender = screen.getByTestId('rows-data').textContent;

    rerender(<GanttChartRenderer ganttData={mockGanttData} />);

    const secondRender = screen.getByTestId('rows-data').textContent;

    expect(firstRender).toEqual(secondRender);
  });

  it('should handle ganttData with mixed data types', () => {
    const mixedData: any[] = [
      {
        id: '1',
        label: 'Task 1',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        cells: [],
      },
      {
        id: 2,
        label: 123,
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-01-20'),
      },
    ];

    render(<GanttChartRenderer ganttData={mixedData as GanttRow[]} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
  });
});

describe('data-testid', () => {
  const mockGanttData: GanttRow[] = [
    {
      id: '1',
      label: 'Task 1',
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      cells: [],
    } as GanttRow,
  ];

  it('should render with data-testid when provided', () => {
    render(
      <GanttChartRenderer ganttData={mockGanttData} dataTestId="test-gantt" />,
    );

    expect(screen.getByTestId('gantt-chart-test-gantt')).toBeInTheDocument();
    expect(
      screen.getByTestId('gantt-chart-body-test-gantt'),
    ).toBeInTheDocument();
  });

  it('should not render data-testid when not provided', () => {
    const { container } = render(
      <GanttChartRenderer ganttData={mockGanttData} />,
    );

    // Wrapper div should not have custom gantt-chart-* data-testid
    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv.getAttribute('data-testid')).toBeNull();
  });

  it('should render data-testid with different values', () => {
    const { rerender } = render(
      <GanttChartRenderer ganttData={mockGanttData} dataTestId="first" />,
    );
    expect(screen.getByTestId('gantt-chart-first')).toBeInTheDocument();
    expect(screen.getByTestId('gantt-chart-body-first')).toBeInTheDocument();

    rerender(
      <GanttChartRenderer ganttData={mockGanttData} dataTestId="second" />,
    );
    expect(screen.getByTestId('gantt-chart-second')).toBeInTheDocument();
    expect(screen.getByTestId('gantt-chart-body-second')).toBeInTheDocument();
    expect(screen.queryByTestId('gantt-chart-first')).not.toBeInTheDocument();
  });

  it('should propagate dataTestId to GanttChartBody', () => {
    render(
      <GanttChartRenderer
        ganttData={mockGanttData}
        dataTestId="propagation-test"
      />,
    );

    expect(
      screen.getByTestId('gantt-chart-body-propagation-test'),
    ).toBeInTheDocument();
  });
});
