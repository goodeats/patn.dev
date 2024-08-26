import { ThemeSwitch } from '../routes/resources+/theme-switch.tsx'
import { type Theme } from '../utils/theme.server.ts'
import { Logo } from './logo.tsx'

export function Footer({ userPreference }: { userPreference: Theme | null }) {
	return (
		<div className="container flex justify-between pb-5">
			<Logo />
			<ThemeSwitch userPreference={userPreference} />
		</div>
	)
}
