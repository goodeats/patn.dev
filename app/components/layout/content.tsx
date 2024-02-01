import { cn } from '#app/utils/misc'

const MainContent = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'relative col-span-3 flex flex-col bg-accent md:rounded-r-3xl',
				className,
			)}
		>
			{children}
		</div>
	)
}

const ContentHeader = ({
	children,
	title,
	className,
}: {
	children: React.ReactNode
	title?: string | React.ReactNode
	className?: string
}) => {
	const ContentHeaderTitle = () => {
		if (typeof title === 'string') {
			return <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
		}

		return title
	}

	return (
		<div
			className={cn(
				'container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16',
				className,
			)}
		>
			{title && <ContentHeaderTitle />}
			{children}
		</div>
	)
}

export { MainContent, ContentHeader }
