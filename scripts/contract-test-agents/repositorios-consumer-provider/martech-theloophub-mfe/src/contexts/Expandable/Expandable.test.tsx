import React from 'react';
import { act } from 'react-dom/test-utils';

import { fireEvent, render, screen } from '@testing-library/react';

import { ExpandableProvider, useExpandable } from './Expandable';

jest.mock('hooks', () => ({
  useGoogleAnalytics: () => jest.fn(),
}));

const TestComponent = ({ testId }: { testId: string }) => {
  const { expandedId, toggleExpansion } = useExpandable()!;
  return (
    <div data-testid={testId}>
      <button
        data-testid={`toggle-${testId}`}
        onClick={() => toggleExpansion(testId, true, 'test')}
      >
        Toggle
      </button>
      <div data-testid="status">{expandedId}</div>
    </div>
  );
};

describe('ExpandableProvider', () => {
  it('should provide context to children', () => {
    render(
      <ExpandableProvider>
        <TestComponent testId="test1" />
      </ExpandableProvider>,
    );

    expect(screen.getByTestId('status').textContent).toBe('');
  });

  it('should toggle expansion state correctly', async () => {
    render(
      <ExpandableProvider>
        <TestComponent testId="test1" />
        <TestComponent testId="test2" />
      </ExpandableProvider>,
    );

    const toggle1 = screen.getByTestId('toggle-test1');
    const toggle2 = screen.getByTestId('toggle-test2');
    const status = screen.getAllByTestId('status');

    await act(() => {
      fireEvent.click(toggle1);
    });
    expect(status[0].textContent).toBe('test1');

    await act(() => {
      fireEvent.click(toggle1);
    });
    expect(status[0].textContent).toBe('');

    await act(() => {
      fireEvent.click(toggle2);
    });
    expect(status[1].textContent).toBe('test2');
  });
});
