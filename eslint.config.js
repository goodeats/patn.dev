import { default as defaultConfig } from '@epic-web/config/eslint'

const ERROR = 'error'

/** @type {import("eslint").Linter.Config} */
export default [
	...defaultConfig,
	// add custom config objects here:
	// https://github.com/epicweb-dev/config/blob/main/docs/decisions/008-new-ts-eslint-rules.md
	// I agree with not needing a lint rule to yell at you about using `any` in a type
	{
		plugins: {
			'@typescript-eslint': (await import('typescript-eslint')).plugin,
		},
		rules: {
			// I prefer error over warn from the default config
			'@typescript-eslint/no-unused-vars': [
				ERROR,
				{
					args: 'after-used',
					argsIgnorePattern: '^_',
					ignoreRestSiblings: true,
					varsIgnorePattern: '^ignored',
				},
			],
		},
	},
]
