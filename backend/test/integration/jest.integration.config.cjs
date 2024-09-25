module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '../',
    testMatch: ['<rootDir>integration/**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    setupFilesAfterEnv: ['<rootDir>/integration/setup.ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
      '^.+\\.js$': 'ts-jest',
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',  // Remove .js extensions for TypeScript imports
    },
    verbose: true,
  };
  