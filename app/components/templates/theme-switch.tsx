import { getFormProps, useForm } from '@conform-to/react'
import { useFetcher } from '@remix-run/react'
import { useRootLoaderData, type action } from '#app/root'
import { useOptimisticThemeMode } from '#app/utils/theme'
import { Icon } from '../ui'

export const ThemeSwitch = () => {
	const { requestInfo } = useRootLoaderData()
	const userPreference = requestInfo.userPrefs.theme

	const fetcher = useFetcher<typeof action>()
	console.log('fetcher', fetcher)

	const [form] = useForm({
		id: 'theme-switch',
		lastResult: fetcher.data?.result,
	})

	const optimisticMode = useOptimisticThemeMode()
	console.log('optimisticMode', optimisticMode)
	console.log('userPreference', userPreference)
	const mode = optimisticMode ?? userPreference ?? 'system'
	const nextMode =
		mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'
	console.log('mode', mode)
	console.log('nextMode', nextMode)
	// const modeLabel = {
	// 	light: (
	// 		<Icon name="sun">
	// 			<span className="sr-only">Light</span>
	// 		</Icon>
	// 	),
	// 	dark: (
	// 		<Icon name="moon">
	// 			<span className="sr-only">Dark</span>
	// 		</Icon>
	// 	),
	// 	system: (
	// 		<Icon name="laptop">
	// 			<span className="sr-only">System</span>
	// 		</Icon>
	// 	),
	// }

	return (
		<fetcher.Form method="POST" {...getFormProps(form)}>
			<input type="hidden" name="theme" value={nextMode} />
			<div className="flex gap-2">
				<button
					type="submit"
					className="flex h-8 w-8 cursor-pointer items-center justify-center"
				>
					{/* {modeLabel[mode]} */}
					{mode === 'light' && (
						<Icon name="sun">
							<span className="sr-only">Light</span>
						</Icon>
					)}
					{mode === 'dark' && (
						<Icon name="moon">
							<span className="sr-only">Dark</span>
						</Icon>
					)}
					{mode === 'system' && (
						<Icon name="laptop">
							<span className="sr-only">System</span>
						</Icon>
					)}
				</button>
			</div>
		</fetcher.Form>
	)
}
