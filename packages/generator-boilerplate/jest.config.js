export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/__tests__/**/*.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
