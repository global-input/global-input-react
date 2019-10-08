module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      error,
      {
        devDependencies: [
          '.storybook/**',
          'stories/**' 
        ]
      }
    ],
    "no-trailing-spaces": "error",
    "comma-spacing": ["error", { "before": false, "after": true }],
    "no-spaced-func": "error",
    "no-whitespace-before-property": "error",
    "space-before-function-paren": ["error", "never"],
    "space-infix-ops": "error",
  }
};
