module.exports = {
  silent:false,
    testEnvironment:'./src/env.js',
    moduleNameMapper: {
        '\\.(gif|svg|png|css)$':'<rootDir>/mocks/fileMock.js'
    }
  };