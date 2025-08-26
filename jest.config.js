module.exports = {
  silent:false,
  maxWorkers:1,
  testEnvironment:'./src/env.js',
  moduleNameMapper: {
      '\\.(gif|svg|png|css)$':'<rootDir>/mocks/fileMock.js'
  }
};