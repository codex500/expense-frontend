import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';

// Basic MSW setup mock or global fetch mock
global.fetch = vi.fn();

beforeAll(() => {
  // setup MSW here if needed
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  // cleanup MSW here if needed
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
