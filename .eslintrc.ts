import { Linter } from 'eslint';

const config: Linter.Config = {
    plugins: ['import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        // Enforce a convention in the order of import statements
        'import/order': [
            'error',
            {
                groups: [
                    'builtin', // Node built-ins
                    'external', // External packages (e.g., react, next)
                    'internal', // Aliases or internal imports
                    'parent', // Parent imports (../)
                    'sibling', // Sibling imports (./)
                    'index', // Index imports
                    'object', // Imports of whole namespace
                    'type', // Type imports
                ],
                'newlines-between': 'always', // Add new lines between groups
                alphabetize: { order: 'asc', caseInsensitive: true }, // Alphabetical order
            },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};

export default config;
