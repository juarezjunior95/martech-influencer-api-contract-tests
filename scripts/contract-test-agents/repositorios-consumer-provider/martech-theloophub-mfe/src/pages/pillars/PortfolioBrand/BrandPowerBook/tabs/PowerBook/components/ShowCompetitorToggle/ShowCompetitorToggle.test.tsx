import { fireEvent, render, screen } from '@testing-library/react';

import { ShowCompetitorToggle } from './ShowCompetitorToggle';

const mockFormatMessage = jest.fn(({ id }) => id);

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children, style }: any) => (
    <p data-testid="paragraph" style={style}>
      {children}
    </p>
  ),
}));

jest.mock('./ShowCompetitorToggle.styles', () => ({
  StyledShowCompetitorToggle: ({ children }: any) => (
    <div data-testid="styled-show-competitor-toggle">{children}</div>
  ),
}));

describe('ShowCompetitorToggle Component', () => {
  const mockSetShowCompetitor = jest.fn();
  const mockHandleGAEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render toggle and paragraph', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
        />,
      );

      expect(screen.getByRole('switch')).toBeInTheDocument();
      expect(screen.getByTestId('paragraph')).toBeInTheDocument();
    });

    it('should render with correct checked state when showCompetitor is true', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={true}
          setShowCompetitor={mockSetShowCompetitor}
        />,
      );

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('should render with correct checked state when showCompetitor is false', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
        />,
      );

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Toggle Functionality', () => {
    it('should call setShowCompetitor when toggle is clicked', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
        />,
      );

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(mockSetShowCompetitor).toHaveBeenCalledTimes(1);
      expect(mockSetShowCompetitor).toHaveBeenCalledWith(true);
    });

    it('should toggle from true to false when clicked', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={true}
          setShowCompetitor={mockSetShowCompetitor}
        />,
      );

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(mockSetShowCompetitor).toHaveBeenCalledWith(false);
    });
  });

  describe('Disabled State', () => {
    it('should render as disabled when isDisabled is true', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
          isDisabled={true}
        />,
      );

      const toggle = screen.getByRole('switch');
      expect(toggle).toBeDisabled();
    });

    it('should not call setShowCompetitor when disabled and clicked', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
          isDisabled={true}
        />,
      );

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(mockSetShowCompetitor).not.toHaveBeenCalled();
    });

    it('should apply reduced opacity to paragraph when disabled', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
          isDisabled={true}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toHaveStyle({ opacity: 0.5 });
    });

    it('should apply full opacity to paragraph when not disabled', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
          isDisabled={false}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toHaveStyle({ opacity: 1 });
    });
  });

  describe('GA Event Handling', () => {
    it('should call handleGAEvent when toggle is clicked and handleGAEvent is provided', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
          handleGAEvent={mockHandleGAEvent}
        />,
      );

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(mockHandleGAEvent).toHaveBeenCalledTimes(1);
      expect(mockHandleGAEvent).toHaveBeenCalledWith('true');
    });

    it('should call handleGAEvent with false when toggling from true to false', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={true}
          setShowCompetitor={mockSetShowCompetitor}
          handleGAEvent={mockHandleGAEvent}
        />,
      );

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(mockHandleGAEvent).toHaveBeenCalledWith('false');
    });

    it('should not call handleGAEvent when it is not provided', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
        />,
      );

      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);

      expect(mockHandleGAEvent).not.toHaveBeenCalled();
    });
  });

  describe('Format Message', () => {
    it('should format message with correct ID', () => {
      render(
        <ShowCompetitorToggle
          showCompetitor={false}
          setShowCompetitor={mockSetShowCompetitor}
        />,
      );

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceBreakdown.showCompetitorToggle.title',
      });
    });
  });
});
