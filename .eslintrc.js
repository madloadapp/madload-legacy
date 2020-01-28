module.exports = {
  env: {
    node: true,
    commonjs: true,
    browser: true,
    es6: true
  },
  extends: ['airbnb-base'],
  plugins: ['eslint-plugin-import'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script'
  },
  rules: {
    'prettier/prettier': 'error',
    strict: ['error', 'global'],
    // quotes: ['error', 'single'],
    semi: ['error', 'always'],
    eqeqeq: 'error',
    'no-var': 'error',
    camelcase: 'error',
    'spaced-comment': 'warn',
    'block-spacing': 'warn',
    'no-unused-vars': 'warn',
    'consistent-return': 'off',
    'prefer-destructuring': 'off',
    'prefer-const': 'off',
    'no-bitwise': 'off',
    'no-console': 'off',
    'func-names': 'off',
    'no-process-exit': 'off',
    'object-shorthand': 'off',
    'class-methods-use-this': 'off'
  }
};
