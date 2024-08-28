import { ThemeSwitch } from '../routes/resources+/theme-switch.tsx'
import { Logo } from './logo.tsx'

export function Footer() {
	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			<ThemeSwitch />
		</div>
	)
}
