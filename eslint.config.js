import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// 该插件是用于将 Prettier 规则集成到 ESLint 中
import prettierPlugin from 'eslint-plugin-prettier'
// 该插件是用于关闭 ESLint 中与 Prettier 冲突的规则
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,

  {
    plugins: {
      // prettier 是用于将 Prettier 规则集成到 ESLint 中的插件
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'warn', // 使用 prettier 规则
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
        }
      ],
      'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验
      // 💡 添加未定义变量错误提示，create-vue@3.6.3 关闭，这里加上是为了支持下一个章节演示。
      'no-unused-vars': 'error'
      // 'on-undef': 'off'
    }
  },
  eslintConfigPrettier
])
