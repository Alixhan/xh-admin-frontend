require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-prettier',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    semi: [2, 'never'], // 禁止尾部使用分号“ ; ”
    'no-var': 'error', // 禁止使用 var
    // indent: ['error', 2], // 缩进2格
    'no-mixed-spaces-and-tabs': 'error', // 不能空格与tab混用
    quotes: [2, 'single'], // 使用单引号
    'vue/html-closing-bracket-newline': 'off', // 不强制换行
    'vue/singleline-html-element-content-newline': 'off', // 不强制换行
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 8 },
      multiline: { max: 8 }
    }], // vue template模板元素第一行最多5个属性
    'comma-dangle': [0, 'never'], // 对象字面量项尾可以有逗号
    'no-unused-vars': [
      'error',
      // we are only using this rule to check for unused arguments since TS
      // catches unused variables but not args.
      { varsIgnorePattern: '.*', args: 'none' }
    ],
    'vue/multi-word-component-names': [0, {
      ignores: ['index']// 需要忽略的组件名
    }],
    'prefer-promise-reject-errors': 0,
    'vue/require-default-prop': 0
  }
}
