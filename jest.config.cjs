module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'cjs'],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
