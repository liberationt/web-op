module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    // 'plugin:vue/recommended',
    // 'prettier',
    // 'eslint: recommended',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  // plugins: ['prettier'],
  rules: {
    // 'prettier/prettier': 'error'
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': [
      'error',
      { prefixWithI: 'always' }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'comma'
        },
        singleline: {
          delimiter: 'comma'
        }
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': ['error', 'never'],
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': 'error',
    'vue/camelcase': 'error',
    'vue/comma-dangle': 'error',
    'vue/component-name-in-template-casing': 'error',
    'vue/eqeqeq': 'error',
    'vue/key-spacing': 'error',
    'vue/match-component-file-name': 'error',
    'vue/object-curly-spacing': 'error',
    eqeqeq: ['off'],
    'no-irregular-whitespace': 'off', //这禁止掉 空格报错检查
    'no-mixed-operators': 'off',
    'no-mixed-spaces-and-tabs': 'off', //不允许tab和空格混合缩进代码
    indent: 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
