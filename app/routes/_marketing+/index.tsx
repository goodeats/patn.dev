import { type MetaFunction } from '@remix-run/node'
import { NavLink } from '@remix-run/react'
import {
	PageLayout,
	Container,
	Content,
	PageTitle,
	PageSubtitle,
	NavList,
	navLinkDefaultClassName,
} from '#app/components/layouts/page'

export const meta: MetaFunction = () => [{ title: 'Pat Needham' }]

export default function Index() {
	const links = [
		{ to: '/about', label: 'About Me' },
		{ to: '/work', label: 'My Work' },
		{ to: '/contact', label: 'Contact' },
	] as const

	return (
		<PageLayout>
			<Container>
				<Content>
					<PageTitle>Pat Needham</PageTitle>
					<PageSubtitle>
						Full-stack web developer from New York City
					</PageSubtitle>
					<nav>
						<NavList>
							{links.map(({ to, label }) => (
								<li key={to}>
									<NavLink
										className={navLinkDefaultClassName}
										to={to}
										prefetch="intent"
										unstable_viewTransition
									>
										{label}
									</NavLink>
								</li>
							))}
						</NavList>
					</nav>
				</Content>
			</Container>
		</PageLayout>
	)
}
