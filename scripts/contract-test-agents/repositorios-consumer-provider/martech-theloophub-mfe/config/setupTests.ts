import '@testing-library/jest-dom';
import { matchers } from 'jest-json-schema';

global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
};

global.IntersectionObserver = class IntersectionObserver
  implements IntersectionObserver
{
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {}

  observe() {
    // Mock implementation
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};
Object.defineProperty(globalThis.window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(globalThis.window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock IndexedDB to avoid errors in test environment
const mockIndexedDB = {
  open: jest.fn(() => ({
    onsuccess: null,
    onerror: null,
    result: {
      objectStoreNames: [],
      createObjectStore: jest.fn(),
      transaction: jest.fn(),
    },
  })),
  deleteDatabase: jest.fn(),
  databases: jest.fn().mockResolvedValue([]),
};

Object.defineProperty(global, 'indexedDB', {
  writable: true,
  value: mockIndexedDB,
});

// Suppress console.error for IndexedDB errors
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const firstArg = args[0];
  if (
    firstArg &&
    typeof firstArg === 'object' &&
    'toString' in firstArg &&
    (firstArg.toString().includes('IndexedDB') ||
      firstArg.toString().includes('Cannot read properties of undefined'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

jest.mock('admin-portal-shared-services', () => ({
  ...jest.requireActual('admin-portal-shared-services'),
  usePreferredLanguageV2: jest.fn(() => ({
    preferredLanguage: 'pt-BR',
    defaultLanguage: 'en-US',
  })),
}));

expect.extend(matchers);
