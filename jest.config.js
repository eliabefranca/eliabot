module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  coverageProvider: 'babel',
  coverageDirectory: 'coverage',
  testEnvironment: 'node',

  testPathIgnorePatterns: ['.js$'],
  transform: {
    '.+\\.ts': ['ts-jest', 'babel-jest'],
  },
};
