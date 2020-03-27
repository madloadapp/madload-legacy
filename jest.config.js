module.exports = {
  roots: ['tests'],
  testMatch: ['**/*.(test|spec).+(ts|js)'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
