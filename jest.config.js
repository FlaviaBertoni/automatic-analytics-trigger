// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js', 'html'],
  transform: {
    '^.+\\.js?$': 'babel-jest',
    '^.+\\.html?$': 'html-loader-jest',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/node_modules/**'],
};
