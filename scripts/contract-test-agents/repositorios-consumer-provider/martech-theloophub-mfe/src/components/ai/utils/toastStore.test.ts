import { dismiss, getSnapshot, subscribe, toast } from './toastStore';

afterEach(() => dismiss());

describe('toastStore', () => {
  it('should start with null', () => {
    expect(getSnapshot()).toBeNull();
  });

  it('should set current toast on toast()', () => {
    toast({ type: 'success', message: 'Done' });
    expect(getSnapshot()).toEqual({ type: 'success', message: 'Done' });
  });

  it('should clear current toast on dismiss()', () => {
    toast({ type: 'error', message: 'Failed' });
    dismiss();
    expect(getSnapshot()).toBeNull();
  });

  it('should notify listeners on toast()', () => {
    const listener = jest.fn();
    subscribe(listener);

    toast({ type: 'success', message: 'Hello' });

    expect(listener).toHaveBeenCalledWith({
      type: 'success',
      message: 'Hello',
    });
  });

  it('should notify listeners on dismiss()', () => {
    const listener = jest.fn();
    toast({ type: 'success', message: 'Hello' });

    subscribe(listener);
    dismiss();

    expect(listener).toHaveBeenCalledWith(null);
  });

  it('should unsubscribe when calling the returned function', () => {
    const listener = jest.fn();
    const unsubscribe = subscribe(listener);

    unsubscribe();
    toast({ type: 'success', message: 'Hello' });

    expect(listener).not.toHaveBeenCalled();
  });

  it('should replace previous toast with a new one', () => {
    toast({ type: 'success', message: 'First' });
    toast({ type: 'error', message: 'Second' });

    expect(getSnapshot()).toEqual({ type: 'error', message: 'Second' });
  });

  it('should notify multiple listeners', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    subscribe(listener1);
    subscribe(listener2);

    toast({ type: 'success', message: 'Both' });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });
});
