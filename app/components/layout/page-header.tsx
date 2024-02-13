import { Link, NavLink } from '@remix-run/react'
import { useRootLoaderData } from '#app/root'
import { cn } from '#app/utils/misc'
import { useOptionalUser } from '#app/utils/user'
import { Logo, ThemeSwitch, UserDropdown } from '../templates'
import { Button } from '../ui'

const PageHeader = () => {
	const user = useOptionalUser()
	const { pages } = useRootLoaderData()

	return (
		<header className="container py-6">
			<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
				<Logo />

				<div className="flex items-center gap-10">
					{pages.map(page => (
						<Link key={page.slug} to={`/${page.slug}`}>
							{page.name}
						</Link>
					))}
					<ThemeSwitch />
					{user && <UserDropdown />}
				</div>
			</nav>
		</header>
	)
}

const PageHeaderDev = () => {
	const user = useOptionalUser()
	const { pages } = useRootLoaderData()

	const LoginButton = () => {
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
					{pages.map(page => (
						<PageHeaderNavLink key={page.slug} to={`/${page.slug}`}>
							{page.name}
						</PageHeaderNavLink>
					))}
					{user ? <UserDropdown /> : <LoginButton />}
				</div>
			</nav>
		</header>
	)
}

const PageHeaderNavLink = ({
	to,
	children,
}: {
	to: string
	children: React.ReactNode
}) => {
	return (
		<NavLink
			to={to}
			prefetch="intent"
			className={({ isActive }) =>
				cn(
					'relative block whitespace-nowrap border-b-2 border-background px-2 py-2 text-base transition-all duration-500 hover:border-primary focus:border-primary',
					{
						'border-primary': isActive,
					},
				)
			}
		>
			{children}
		</NavLink>
	)
}

export { PageHeader, PageHeaderDev }
