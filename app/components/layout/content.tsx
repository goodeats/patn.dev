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

export { MainContentWrapper, MainContentContainer, ContentHeader }
