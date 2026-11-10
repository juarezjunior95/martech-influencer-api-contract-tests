import { render } from '@testing-library/react';

import {
  RA_DEEP_DIVE_SUBFILTER,
  RA_DEEP_DIVE_SUBFILTER_PRESET,
  VIEW_TYPES,
} from '../../constants';
import DeepDiveHeader from './DeepDiveHeader';

const mockFormatMessage = jest.fn();
const mockSegmentedControl = jest.fn();
const mockSubFilterSelect = jest.fn();

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('@hexa-ui/components', () => {
  return {
    Heading: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid']}>{children}</div>
    ),
    SegmentedControl: (props: any) => {
      mockSegmentedControl(props);
      return <div data-testid={props['data-testid']} />;
    },
  };
});

jest.mock('components', () => ({
  SubFilter: {
    Select: (props: any) => {
      mockSubFilterSelect(props);
      return <div data-testid={props.dataTestId || props['data-testid']} />;
    },
  },
}));

describe('DeepDiveHeader', () => {
  const renderComponent = (
    overrideProps: Partial<{
      selectedView: string;
      onViewChange: (view: string) => void;
      isBreakdownViewer: boolean;
    }> = {},
  ) => {
    const props = {
      selectedView: VIEW_TYPES.BREAKDOWN,
      onViewChange: jest.fn(),
      isBreakdownViewer: true,
      ...overrideProps,
    };

    render(<DeepDiveHeader {...props} />);

    return { props };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatMessage.mockImplementation(
      ({ id }: { id: string }) => `translated-${id}`,
    );
  });

  it('renders heading and wires sub filter and segmented control props', () => {
    const { props } = renderComponent();

    expect(mockSubFilterSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: RA_DEEP_DIVE_SUBFILTER_PRESET,
        stateKey: RA_DEEP_DIVE_SUBFILTER,
        icon: expect.any(Function),
        dataApiKey: 'kpis',
        dataTestId: undefined,
      }),
    );

    const segmentedControlProps = mockSegmentedControl.mock.calls[0][0];
    expect(segmentedControlProps.onValueChange).toBe(props.onViewChange);
    expect(segmentedControlProps.value).toBe(props.selectedView);
  });

  it.each([
    {
      isBreakdownViewer: true,
      expectedOrder: [VIEW_TYPES.BREAKDOWN, VIEW_TYPES.RANKING],
    },
    {
      isBreakdownViewer: false,
      expectedOrder: [VIEW_TYPES.RANKING, VIEW_TYPES.BREAKDOWN],
    },
  ])(
    'orders segmented control options when isBreakdownViewer is $isBreakdownViewer',
    ({ isBreakdownViewer, expectedOrder }) => {
      renderComponent({ isBreakdownViewer });

      const segmentedControlProps = mockSegmentedControl.mock.calls[0][0];
      const optionValues = segmentedControlProps.options.map(
        (option: { value: string }) => option.value,
      );

      expect(optionValues).toEqual(expectedOrder);

      segmentedControlProps.options.forEach(
        (option: { label: string; value: string }) => {
          const expectedId =
            option.value === VIEW_TYPES.BREAKDOWN
              ? 'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.breakdown_toggle'
              : 'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.ranking_toggle';

          expect(option.label).toBe(`translated-${expectedId}`);
        },
      );
    },
  );

  describe('Custom dataTestId', () => {
    it('renders custom dataTestId for all components', () => {
      const customTestId = 'custom-test';
      renderComponent({ isBreakdownViewer: true });

      const { container } = render(
        <DeepDiveHeader
          selectedView={VIEW_TYPES.BREAKDOWN}
          onViewChange={jest.fn()}
          isBreakdownViewer={true}
          dataTestId={customTestId}
        />,
      );

      expect(
        container.querySelector(
          `[data-testid="${customTestId}-deep-dive-header-container"]`,
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          `[data-testid="${customTestId}-deep-dive-header-title"]`,
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          `[data-testid="${customTestId}-deep-dive-header-filters"]`,
        ),
      ).toBeInTheDocument();

      expect(mockSubFilterSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: `${customTestId}-deep-dive-header-select`,
        }),
      );

      expect(mockSegmentedControl).toHaveBeenCalledWith(
        expect.objectContaining({
          'data-testid': `${customTestId}-deep-dive-header-segmented-control`,
        }),
      );
    });
  });
});
