import { useOptionalUser } from '../utils/user.ts'
import { Logo } from './logo.tsx'
import { UserDropdown } from './user-dropdown.tsx'

export function Nav({ isOnSearchPage }: { isOnSearchPage: boolean }) {
	const user = useOptionalUser()
	const searchBar = isOnSearchPage ? null : null // <SearchBar status="idle" />

	return (
		<header className="container py-6">
			<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				<Logo />
				<div className="ml-auto hidden max-w-sm flex-1 sm:block">
					{searchBar}
				</div>
				<div className="flex items-center gap-10">
					{user ? <UserDropdown /> : null}
				</div>
				<div className="block w-full sm:hidden">{searchBar}</div>
			</nav>
		</header>
	)
}
