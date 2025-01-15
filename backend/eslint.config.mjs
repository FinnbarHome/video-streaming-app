import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js', '**/*.ts'],
    ignores: ['node_modules/**'],
    rules: {
      // Your rules here
    },
  },
];
