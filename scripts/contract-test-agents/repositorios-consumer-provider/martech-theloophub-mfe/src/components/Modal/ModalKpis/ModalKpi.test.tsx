import { fireEvent, render, screen } from '@testing-library/react';

const mockSetModalOpen = jest.fn();
const mockSetShowAllRows = jest.fn();
const mockHandleDataForTab = jest.fn();
const mockToggleShowAllRows = jest.fn();

jest.mock('@hexa-ui/components', () => ({
  Heading: ({ children, size }: any) => (
    <h3 data-testid="heading" data-size={size}>
      {children}
    </h3>
  ),
  Modal: {
    Root: ({ children, open, variant, title, actions }: any) => (
      <div data-testid="modal-root" data-open={open} data-variant={variant}>
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-actions">{actions}</div>
        <div data-testid="modal-content">{children}</div>
      </div>
    ),
    Action: ({ children }: any) => (
      <div data-testid="modal-action">{children}</div>
    ),
  },
  Paragraph: ({ children }: any) => <p data-testid="paragraph">{children}</p>,
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon: IconComponent, size }: any) => (
    <span data-testid="icon" data-size={size}>
      <IconComponent />
    </span>
  ),
}));

jest.mock('@hexa-ui/icons', () => ({
  CalendarClock: ({ size }: any) => (
    <span data-testid="calendar-clock-icon" data-size={size}>
      CalendarClock
    </span>
  ),
  ChevronUp: () => <span data-testid="chevron-up-icon">ChevronUp</span>,
}));

jest.mock('@hexa-ui/icons2', () => ({
  Close: () => <span data-testid="close-icon">Close</span>,
}));

jest.mock('components', () => ({
  Skeleton: ({ width, height, length }: any) => (
    <div
      data-testid="skeleton"
      data-width={width}
      data-height={height}
      data-length={length}
    >
      Skeleton
    </div>
  ),
}));

jest.mock('contexts', () => ({
  useDataRefreshContext: () => ({
    modalOpen: true,
    setModalOpen: mockSetModalOpen,
    setShowAllRows: mockSetShowAllRows,
    modalData: {
      rows: [
        [{ id: 1, kpis: 'Test KPI', update: '2024-01-01', source: 'Test' }],
      ],
    },
    isDisabledBtn: false,
    handleDataForTab: mockHandleDataForTab,
    showAllRows: false,
    toggleShowAllRows: mockToggleShowAllRows,
    selectedTab: 'test-tab',
  }),
}));

jest.mock('./components/ModalTable', () => ({
  ModalBodyWrapper: ({ children }: any) => (
    <div data-testid="modal-body-wrapper">{children}</div>
  ),
  ModalContentSection: ({ children }: any) => (
    <div data-testid="modal-content-section">{children}</div>
  ),
  ModalContentWrapper: ({ children }: any) => (
    <div data-testid="modal-content-wrapper">{children}</div>
  ),
  ModalTable: ({ data }: any) => (
    <div data-testid="modal-table" data-rows={JSON.stringify(data?.rows)}>
      ModalTable
    </div>
  ),
  ModalTitleContent: ({ children }: any) => (
    <div data-testid="modal-title-content">{children}</div>
  ),
  StyledCloseButton: ({ children, onClick, ...props }: any) => (
    <button data-testid="close-modal" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  StyledSeeMoreButton: ({
    children,
    onClick,
    showAllRows,
    disabled,
    singleRow,
  }: any) => (
    <button
      data-testid="see-more-button"
      onClick={onClick}
      data-show-all-rows={showAllRows}
      data-disabled={disabled}
      data-single-row={singleRow}
      disabled={disabled}
    >
      {children}
    </button>
  ),
  WrapperTable: ({ children }: any) => (
    <div data-testid="wrapper-table">{children}</div>
  ),
}));

import { ModalKpi } from './ModalKpi';

describe('ModalKpi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal when modalOpen is true', () => {
    render(<ModalKpi />);

    expect(screen.getByTestId('modal-content-wrapper')).toBeInTheDocument();
  });

  it('should render Modal.Root with correct props', () => {
    render(<ModalKpi />);

    const modalRoot = screen.getByTestId('modal-root');
    expect(modalRoot).toHaveAttribute('data-open', 'true');
    expect(modalRoot).toHaveAttribute('data-variant', 'overlay');
  });

  it('should render CalendarClock icon in title', () => {
    render(<ModalKpi />);

    const calendarIcon = screen.getByTestId('calendar-clock-icon');
    expect(calendarIcon).toBeInTheDocument();
    expect(calendarIcon).toHaveAttribute('data-size', 'xlarge');
  });

  it('should render heading with correct text', () => {
    render(<ModalKpi />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveTextContent('Data Refresh & Source');
    expect(heading).toHaveAttribute('data-size', 'H3');
  });

  it('should render close button', () => {
    render(<ModalKpi />);

    expect(screen.getByTestId('close-modal')).toBeInTheDocument();
  });

  it('should call setModalOpen and setShowAllRows when close button is clicked', () => {
    render(<ModalKpi />);

    const closeButton = screen.getByTestId('close-modal');
    fireEvent.click(closeButton);

    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
    expect(mockSetShowAllRows).toHaveBeenCalledWith(false);
  });

  it('should render description paragraph', () => {
    render(<ModalKpi />);

    const paragraphs = screen.getAllByTestId('paragraph');
    const descriptionParagraph = paragraphs.find((p) =>
      p.textContent?.includes('Displays details'),
    );
    expect(descriptionParagraph).toBeInTheDocument();
  });

  it('should render ModalTable when modalData exists', () => {
    render(<ModalKpi />);

    expect(screen.getByTestId('modal-table')).toBeInTheDocument();
  });

  it('should render see more button', () => {
    render(<ModalKpi />);

    expect(screen.getByTestId('see-more-button')).toBeInTheDocument();
  });

  it('should show "See more" text when showAllRows is false', () => {
    render(<ModalKpi />);

    const paragraphs = screen.getAllByTestId('paragraph');
    const seeMoreParagraph = paragraphs.find(
      (p) => p.textContent === 'See more',
    );
    expect(seeMoreParagraph).toBeInTheDocument();
  });

  it('should render ChevronUp icon in see more button', () => {
    render(<ModalKpi />);

    expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
  });

  it('should call toggleShowAllRows when see more button is clicked', () => {
    render(<ModalKpi />);

    const seeMoreButton = screen.getByTestId('see-more-button');
    fireEvent.click(seeMoreButton);

    expect(mockToggleShowAllRows).toHaveBeenCalled();
  });

  it('should call handleDataForTab on mount when selectedTab and modalOpen are truthy', () => {
    render(<ModalKpi />);

    expect(mockHandleDataForTab).toHaveBeenCalledWith('test-tab');
  });
});

describe('ModalKpi - when modalOpen is false', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.doMock('contexts', () => ({
      useDataRefreshContext: () => ({
        modalOpen: false,
        setModalOpen: mockSetModalOpen,
        setShowAllRows: mockSetShowAllRows,
        modalData: null,
        isDisabledBtn: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
        toggleShowAllRows: mockToggleShowAllRows,
        selectedTab: null,
      }),
    }));
  });

  it('should not render modal content when modalOpen is false', () => {
    const isolateSpy = jest.spyOn(jest, 'isolateModules');

    jest.isolateModules(() => {
      jest.doMock('contexts', () => ({
        useDataRefreshContext: () => ({
          modalOpen: false,
          setModalOpen: jest.fn(),
          setShowAllRows: jest.fn(),
          modalData: null,
          isDisabledBtn: false,
          handleDataForTab: jest.fn(),
          showAllRows: false,
          toggleShowAllRows: jest.fn(),
          selectedTab: null,
        }),
      }));
    });

    expect(isolateSpy).toHaveBeenCalled();
    isolateSpy.mockRestore();
  });
});
