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
