module.exports = {
    env: {
        "es6": true,
        "node": true
    },
    extends: [
        'airbnb-base',
        "plugin:@typescript-eslint/recommended"
    ],
    globals: {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "ecmaVersion": 2020,
        "sourceType": "module"
    },
    rules: {
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                ts: 'never',
            }
        ]
    },
    settings: {
        "import/resolver": {
            node: {
                paths: ['src'],
                extensions: [".js", ".jsx", ".ts", ".tsx"]
          }
        }
      },
}