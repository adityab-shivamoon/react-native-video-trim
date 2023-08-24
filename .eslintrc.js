module.exports = {
  extends: [
    'universe',
    'universe/shared/typescript-analysis',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  ],
  // disabling lint for now
  //  add  "eslint './src/**/*{js,ts,jsx,tsx}' --fix" in "lint-staged": {
  //   "**/*.{js,jsx,ts,tsx}": [
  //     "eslint './src/**/*{js,ts,jsx,tsx}' --fix",
  //     "prettier --write './src/**/*{js,ts,jsx,tsx}'"
  //   ]
  // }, after scripts
  ignorePatterns: ['*.ts', '*.tsx', '*.d.ts'],
  settings: {
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to ESLint
    }
  },
  /* for lint-staged */
  globals: {
    __dirname: true
  },
  rules: {
    'no-console': 'error'
  },
  plugins: ['jest', 'testing-library']
}
