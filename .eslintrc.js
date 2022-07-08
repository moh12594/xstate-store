module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'rules': {
      'quotes': [2, 'single', 'avoid-escape'],
      semi: ['error', 'never'],
    },
    'ignorePatterns': ['.eslintrc.js', 'spack.config.js', 'lib/**']
}
