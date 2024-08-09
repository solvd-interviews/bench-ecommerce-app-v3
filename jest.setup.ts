import '@testing-library/jest-dom'

Object.defineProperty(window, 'location', {
  writable: true,
  value: { reload: jest.fn() }
});

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    query: {},
    asPath: '',
  }),
}));