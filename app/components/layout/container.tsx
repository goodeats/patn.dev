import { cn } from '#app/utils/misc'

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
			{children}
		</main>
	)
}

const MainContainer = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'grid w-full grid-cols-4 bg-muted pl-2 md:container md:rounded-3xl md:pr-0',
				className,
			)}
		>
			{children}
		</div>
	)
}

export { MainWrapper, MainContainer }
