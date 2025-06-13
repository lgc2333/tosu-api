import antfu from '@antfu/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { globalIgnores } from 'eslint/config'

export default antfu(
  { toml: false },
  {
    rules: {
      ...eslintConfigPrettier.rules,
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'ts/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
      'ts/no-empty-object-type': 'off',
      'antfu/if-newline': 'off',
    },
  },
  globalIgnores(['packages/tosu-types/src', 'packages/tosu-types/src/tosu']),
)
