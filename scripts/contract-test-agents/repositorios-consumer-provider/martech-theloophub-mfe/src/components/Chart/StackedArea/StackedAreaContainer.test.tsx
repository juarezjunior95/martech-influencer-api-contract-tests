import { render } from '@testing-library/react';
import { BasicContainer } from 'components';

import { StackedAreaBody } from './components/StackedAreaBody';
import { StackedAreaContainer } from './StackedAreaContainer';
import type { ContainerHeaderProps, StackedAreaData } from './types';

jest.mock('components', () => ({
  BasicContainer: jest.fn(({ children, header, layout, dataTestId }: any) => (
    <div data-testid={dataTestId || 'basic-container'}>
      <div data-testid="container-header">{header?.title}</div>
      <div data-testid="container-body">{children}</div>
    </div>
  )),
}));

jest.mock('./components/StackedAreaBody', () => ({
  StackedAreaBody: jest.fn((props: any) => (
    <div data-testid="stacked-area-body" />
  )),
}));

const mockData: StackedAreaData = {
  columns: [{ label: '2024', segments: [{ value: 50 }, { value: 50 }] }],
  colors: ['#EFD328', '#D9AA4A'],
  connectorColors: ['#F0DF78', '#EEC879'],
};

describe('StackedAreaContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders only StackedAreaBody when no containerHeader', () => {
    render(<StackedAreaContainer data={mockData} />);

    expect(StackedAreaBody).toHaveBeenCalled();
    expect(BasicContainer).not.toHaveBeenCalled();
  });

  it('renders inside BasicContainer when containerHeader is provided', () => {
    const header: ContainerHeaderProps = {
      title: 'Share of Throat',
      subtitle: '[%]',
    };

    render(<StackedAreaContainer data={mockData} containerHeader={header} />);

    expect(BasicContainer).toHaveBeenCalled();
    expect(StackedAreaBody).toHaveBeenCalled();
  });

  it('passes default layout to BasicContainer', () => {
    const header: ContainerHeaderProps = { title: 'Test' };

    render(<StackedAreaContainer data={mockData} containerHeader={header} />);

    expect(BasicContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        layout: expect.objectContaining({
          bodyPadding: false,
          headerPadding: 'small',
          borderRadius: 'large',
          border: 'gray',
          shadow: 'none',
        }),
      }),
      expect.anything(),
    );
  });

  it('allows containerLayout to override default layout', () => {
    const header: ContainerHeaderProps = { title: 'Test' };
    const customLayout = { border: 'small' as const, shadow: 'none' as const };

    render(
      <StackedAreaContainer
        data={mockData}
        containerHeader={header}
        containerLayout={customLayout}
      />,
    );

    expect(BasicContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        layout: expect.objectContaining({
          border: 'small',
          shadow: 'none',
          bodyPadding: false,
          headerPadding: 'small',
          borderRadius: 'large',
        }),
      }),
      expect.anything(),
    );
  });

  it('passes dataTestId to BasicContainer', () => {
    const header: ContainerHeaderProps = { title: 'Test' };

    render(
      <StackedAreaContainer
        data={mockData}
        containerHeader={header}
        dataTestId="my-chart"
      />,
    );

    expect(BasicContainer).toHaveBeenCalledWith(
      expect.objectContaining({ dataTestId: 'my-chart' }),
      expect.anything(),
    );
  });

  it('passes data and remaining props to StackedAreaBody', () => {
    render(<StackedAreaContainer data={mockData} size="large" height={400} />);

    expect(StackedAreaBody).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockData,
        size: 'large',
        height: 400,
      }),
      expect.anything(),
    );
  });
});
