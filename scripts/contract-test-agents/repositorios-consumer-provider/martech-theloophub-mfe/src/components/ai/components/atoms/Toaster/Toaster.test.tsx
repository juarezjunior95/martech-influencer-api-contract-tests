import { act, render } from '@testing-library/react';

import * as toastStore from '../../../utils/toastStore';
import { Toaster } from './Toaster';

afterEach(() => {
  act(() => toastStore.dismiss());
});

describe('Toaster', () => {
  it('should render nothing when there is no toast', () => {
    const { container } = render(<Toaster />);
    expect(container.firstChild).toBeNull();
  });

  it('should render Toast when store has data', () => {
    act(() => toastStore.toast({ type: 'success', message: 'Saved' }));

    const { getByText } = render(<Toaster />);
    expect(getByText('Saved')).toBeInTheDocument();
  });

  it('should update when store changes', () => {
    const { getByText, queryByText } = render(<Toaster />);

    expect(queryByText('Hello')).not.toBeInTheDocument();

    act(() => toastStore.toast({ type: 'error', message: 'Hello' }));

    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('should hide when store is dismissed', () => {
    act(() => toastStore.toast({ type: 'success', message: 'Bye' }));

    const { getByText, queryByText } = render(<Toaster />);
    expect(getByText('Bye')).toBeInTheDocument();

    act(() => toastStore.dismiss());

    expect(queryByText('Bye')).not.toBeInTheDocument();
  });
});
