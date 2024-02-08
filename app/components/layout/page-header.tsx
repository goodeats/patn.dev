import { Link } from '@remix-run/react'
import { useRootLoaderData } from '#app/root'
import { useOptionalUser } from '#app/utils/user'
import { Logo, ThemeSwitch, UserDropdown } from '../templates'
import { Button } from '../ui'

const PageHeader = () => {
	const { ENV } = useRootLoaderData()
	const user = useOptionalUser()

	const Theme = () => {
		if (ENV.MODE === 'development') return null
		console.log(ENV.MODE)

		return <ThemeSwitch />
	}

	const LoginButton = () => {
		if (ENV.MODE === 'production') return null

		return (
			<Button asChild variant="default" size="lg">
				<Link to="/login">Log In</Link>
			</Button>
		)
	}

	return (
		<header className="container py-6">
			<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				<Logo />

				<div className="flex items-center gap-10">
					<Theme />
					{user ? <UserDropdown /> : <LoginButton />}
				</div>
			</nav>
		</header>
	)
}

export { PageHeader }
