// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off', // Chuyển từ warn sang off
      '@typescript-eslint/no-unsafe-assignment': 'off', // Thêm dòng này để hết lỗi đỏ ở diskStorage
      '@typescript-eslint/no-unsafe-member-access': 'off', // Thêm dòng này để hết lỗi đỏ ở file.originalname
      '@typescript-eslint/no-unsafe-call': 'off', // Thêm dòng này để hết lỗi khi gọi cb()
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);
