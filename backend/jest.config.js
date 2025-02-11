// backend/jest.config.js
export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    },
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js']
  };