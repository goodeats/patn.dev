import { cn } from '#app/utils/misc'

const HomeWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="font-poppins grid h-full place-items-center">
			{children}
		</main>
	)
}

const HomeContainer = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'flex max-w-md flex-col items-center text-center xl:order-2 xl:items-start xl:text-left',
				className,
			)}
		>
			{children}
		</div>
	)
}

export { HomeWrapper, HomeContainer }
