const TEN_MINUTES = 10 * 60 * 1000;

interface StorageData<T> {
  data: T;
  timestamp?: number;
}

function createStorageManager<T>(
  storage: Storage,
  key: string,
  initialValue: T,
  expirationTime: number,
  expires = true,
) {
  const finalKey = 'reports:' + key;
  const getStoredData = (): T => {
    const storedData = storage.getItem(finalKey);
    if (!storedData) return initialValue;

    const parsedData: StorageData<T> = JSON.parse(storedData);

    if (!expires) {
      return parsedData.data;
    }

    if (!parsedData.timestamp) {
      return initialValue;
    }

    const now = Date.now();
    const isExpired = now - parsedData.timestamp > expirationTime;

    if (isExpired) {
      storage.removeItem(finalKey);
      return initialValue;
    }

    return parsedData.data;
  };

  const setStoredData = (newData: T) => {
    const dataToStore: StorageData<T> = {
      data: newData,
      timestamp: expires ? Date.now() : undefined,
    };

    const storedItem = storage.getItem(finalKey);
    if (storedItem) dataToStore.timestamp = JSON.parse(storedItem).timestamp;

    storage.setItem(finalKey, JSON.stringify(dataToStore));
  };

  return [getStoredData, setStoredData] as const;
}

export function manageLocalStorage<T>(
  key: string,
  initialValue: T,
  expires = true,
) {
  return createStorageManager(
    localStorage,
    key,
    initialValue,
    TEN_MINUTES,
    expires,
  );
}
