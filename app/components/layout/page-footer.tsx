import { Logo, ThemeSwitch } from '../templates'
import { Icon } from '../ui'

const PageFooter = () => {
	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			<a
				href="https://github.com/goodeats"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Icon name="github-logo" size="lg">
					<span className="sr-only">Github</span>
				</Icon>
			</a>
		</div>
	)
}

const PageFooterDev = () => {
	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			<ThemeSwitch />
		</div>
	)
}

export { PageFooter, PageFooterDev }
