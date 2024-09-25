module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '../',
    testMatch: ['<rootDir>integration/**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/integration/setup.ts'],
  };
  