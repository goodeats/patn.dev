import { Logo, ThemeSwitch } from '../templates'

const PageFooter = () => {
	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			<ThemeSwitch />
		</div>
	)
}

export { PageFooter }
