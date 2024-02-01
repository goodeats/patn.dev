import { Link, NavLink } from '@remix-run/react'
import { cn } from '#app/utils/misc'

const SideNavWrapper = ({ children }: { children: React.ReactNode }) => {
	return <div className="relative col-span-1">{children}</div>
}

const SideNavContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="absolute inset-0 flex flex-col">{children}</div>
}

const SideNavHeaderLink = ({
	children,
	to,
}: {
	children: React.ReactNode
	to: string
}) => {
	return (
		<Link
			to={to}
			className="flex items-center justify-center bg-muted pb-4 pt-4 lg:justify-start lg:gap-4"
		>
			{children}
		</Link>
	)
}

const SideNavHeaderTitle = ({ children }: { children: React.ReactNode }) => {
	return (
		<h1 className="text-center text-base font-bold md:text-lg lg:text-left lg:text-2xl">
			{children}
		</h1>
	)
}

const SideNavList = ({ children }: { children: React.ReactNode }) => {
	return <ul className="overflow-y-auto overflow-x-hidden pb-12">{children}</ul>
}

const SideNavListItem = ({ children }: { children: React.ReactNode }) => {
	return <li className="p-1 pr-0">{children}</li>
}

const SideNavLink = ({
	children,
	to,
	className,
}: {
	children: React.ReactNode
	to: string
	className?: string
}) => {
	return (
		<NavLink
			to={to}
			preventScrollReset
			prefetch="intent"
			className={({ isActive }) =>
				cn(
					'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl',
					isActive && 'bg-accent',
					className,
				)
			}
		>
			{children}
		</NavLink>
	)
}

export {
	SideNavWrapper,
	SideNavContainer,
	SideNavHeaderLink,
	SideNavHeaderTitle,
	SideNavList,
	SideNavListItem,
	SideNavLink,
}
