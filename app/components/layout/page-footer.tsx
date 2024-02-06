import { useRootLoaderData } from '#app/root'
import { Logo, ThemeSwitch } from '../templates'

const PageFooter = () => {
	const { requestInfo } = useRootLoaderData()

	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			<ThemeSwitch userPreference={requestInfo.userPrefs.theme} />
		</div>
	)
}

export { PageFooter }
