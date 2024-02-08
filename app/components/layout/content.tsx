import { cn } from '#app/utils/misc'

const MainContentWrapper = ({
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

const MainContentContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="absolute inset-0 flex flex-col px-10">{children}</div>
}

const ContentBody = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="overflow-x-hidden' overflow-y-auto pb-28">{children}</div>
	)
}

const ContentHeader = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<h2 className={cn('mb-2 pt-4 text-h2 lg:mb-6', className)}>{children}</h2>
	)
}

const ContentSection = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="mb-4 flex items-center justify-between">{children}</div>
	)
}

const ContentCardGrid = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn('grid gap-4 lg:grid-flow-col lg:grid-cols-2', className)}
		>
			{children}
		</div>
	)
}

export {
	MainContentWrapper,
	MainContentContainer,
	ContentBody,
	ContentHeader,
	ContentSection,
	ContentCardGrid,
}
