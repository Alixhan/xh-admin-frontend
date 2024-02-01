require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier/skip-formatting'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    globals: {
        require: 'readonly',
        module: 'readonly'
    },
    rules: {
        'vue/multi-word-component-names': 'off',
            'quotes': ['error', 'single', {'allowTemplateLiterals': true}]
    }
}
