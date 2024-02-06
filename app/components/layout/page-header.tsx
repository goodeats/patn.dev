import { useOptionalUser } from '#app/utils/user'
import { Logo, UserDropdown } from '../templates'

const PageHeader = () => {
	const user = useOptionalUser()
	return (
		<header className="container py-6">
			<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				<Logo />

				<div className="flex items-center gap-10">
					{user && <UserDropdown />}
				</div>
			</nav>
		</header>
	)
}

export { PageHeader }
