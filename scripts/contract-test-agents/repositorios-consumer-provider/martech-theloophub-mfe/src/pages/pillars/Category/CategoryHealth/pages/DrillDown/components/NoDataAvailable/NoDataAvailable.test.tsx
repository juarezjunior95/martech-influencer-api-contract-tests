import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { NoDataAvailable } from './NoDataAvailable';

const mockNoDataYet = jest.fn();

jest.mock('components/NoDataYet/NoDataYet', () => {
  const MockNoDataYet = (props: any) => {
    mockNoDataYet(props);
    return <div data-testid={props.dataTestId}>No data yet</div>;
  };
  MockNoDataYet.displayName = 'NoDataYet';
  return MockNoDataYet;
});

jest.mock('./NoDataAvailable.styles', () => ({
  NoDataAvailableContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
}));

describe('NoDataAvailable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the empty state content', () => {
    render(<NoDataAvailable />);

    expect(screen.getByText('No data yet')).toBeInTheDocument();
  });

  describe('data-testid implementation', () => {
    it('should apply derived test ids when dataTestId is provided', () => {
      render(<NoDataAvailable dataTestId="test" />);

      expect(screen.getByTestId('test-no-data-available')).toBeInTheDocument();
      expect(
        screen.getByTestId('test-no-data-available-content'),
      ).toBeInTheDocument();
      expect(mockNoDataYet).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'test-no-data-available-content',
        }),
      );
    });

    it('should not apply custom test ids when dataTestId is omitted', () => {
      const { container } = render(<NoDataAvailable />);

      expect(container.querySelector('[data-testid]')).toBeNull();
      expect(mockNoDataYet).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: undefined,
        }),
      );
    });
  });
});
