import { manageLocalStorage } from './storage';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('storage', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('manageLocalStorage', () => {
    it('should return initial value when storage is empty', () => {
      const [getData] = manageLocalStorage('testKey', 'initialValue');
      const result = getData();
      expect(result).toBe('initialValue');
    });

    it('should store and retrieve data', () => {
      const [getData, setData] = manageLocalStorage('testKey', 'initial');

      setData('newValue');
      const result = getData();

      expect(result).toBe('newValue');
    });

    it('should prefix key with reports:', () => {
      const [, setData] = manageLocalStorage('myKey', 'value');

      setData('test');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'reports:myKey',
        expect.any(String),
      );
    });

    it('should return initial value when data is expired', () => {
      const TEN_MINUTES = 10 * 60 * 1000;
      const expiredTimestamp = Date.now() - TEN_MINUTES - 1000;

      mockLocalStorage.getItem.mockReturnValueOnce(
        JSON.stringify({
          data: 'expiredData',
          timestamp: expiredTimestamp,
        }),
      );

      const [getData] = manageLocalStorage('expiredKey', 'initialValue');
      const result = getData();

      expect(result).toBe('initialValue');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'reports:expiredKey',
      );
    });

    it('should return stored data when not expired', () => {
      const validTimestamp = Date.now() - 1000;

      mockLocalStorage.getItem.mockReturnValueOnce(
        JSON.stringify({
          data: 'validData',
          timestamp: validTimestamp,
        }),
      );

      const [getData] = manageLocalStorage('validKey', 'initial');
      const result = getData();

      expect(result).toBe('validData');
    });

    it('should not expire data when expires is false', () => {
      mockLocalStorage.getItem.mockReturnValueOnce(
        JSON.stringify({
          data: 'noExpireData',
        }),
      );

      const [getData] = manageLocalStorage('noExpireKey', 'initial', false);
      const result = getData();

      expect(result).toBe('noExpireData');
    });

    it('should return initial value when stored data has no timestamp and expires is true', () => {
      mockLocalStorage.getItem.mockReturnValueOnce(
        JSON.stringify({
          data: 'dataWithoutTimestamp',
        }),
      );

      const [getData] = manageLocalStorage('noTimestampKey', 'initial', true);
      const result = getData();

      expect(result).toBe('initial');
    });

    it('should work with object values', () => {
      const initialValue = { name: 'test', count: 0 };
      const [getData, setData] = manageLocalStorage('objectKey', initialValue);

      const newValue = { name: 'updated', count: 5 };
      setData(newValue);

      const result = getData();
      expect(result).toEqual(newValue);
    });

    it('should work with array values', () => {
      const initialValue = [1, 2, 3];
      const [getData, setData] = manageLocalStorage('arrayKey', initialValue);

      const newValue = [4, 5, 6];
      setData(newValue);

      const result = getData();
      expect(result).toEqual(newValue);
    });

    it('should preserve existing timestamp when updating data', () => {
      const existingTimestamp = Date.now() - 5000;

      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === 'reports:preserveTimestamp') {
          return JSON.stringify({
            data: 'existing',
            timestamp: existingTimestamp,
          });
        }
        return null;
      });

      const [, setData] = manageLocalStorage('preserveTimestamp', 'initial');
      setData('updated');

      const setItemCall = mockLocalStorage.setItem.mock.calls[0];
      const storedData = JSON.parse(setItemCall[1]);

      expect(storedData.timestamp).toBe(existingTimestamp);
    });
  });
});
