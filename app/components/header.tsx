import { ThemeSwitch } from '#app/routes/resources+/theme-switch.js'
import { useOptionalUser } from '../utils/user.ts'
import { Logo } from './logo.tsx'
import { UserDropdown } from './user-dropdown.tsx'

export function Header() {
	const user = useOptionalUser()

	return (
		<header className="container py-6">
			<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				<Logo />
				<div className="flex items-center gap-4">
					<ThemeSwitch />
					<div className="flex items-center gap-10">
						{user ? <UserDropdown /> : null}
					</div>
				</div>
			</nav>
		</header>
	)
}
