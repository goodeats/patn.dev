import { useRootLoaderData } from '#app/root'
import { Logo, ThemeSwitch } from '../templates'
import { Icon } from '../ui'

const PageFooter = () => {
	const { ENV } = useRootLoaderData()
	const isProduction = ENV.MODE === 'production'

	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			{isProduction ? (
				<a
					href="https://github.com/goodeats"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Icon name="github-logo" size="lg">
						<span className="sr-only">Github</span>
					</Icon>
				</a>
			) : (
				<ThemeSwitch />
			)}
		</div>
	)
}

export { PageFooter }
