import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui'
import { cn } from '#app/utils/misc.tsx'

type Logo = {
	src: string
	alt: string
	href: string
	column: number
	row: number
}

export const LogoGrid = ({ logos }: { logos: Logo[] }) => {
	// Tailwind Grid cell classes lookup
	const columnClasses: Record<(typeof logos)[number]['column'], string> = {
		1: 'xl:col-start-1',
		2: 'xl:col-start-2',
		3: 'xl:col-start-3',
		4: 'xl:col-start-4',
		5: 'xl:col-start-5',
	}
	const rowClasses: Record<(typeof logos)[number]['row'], string> = {
		1: 'xl:row-start-1',
		2: 'xl:row-start-2',
		3: 'xl:row-start-3',
		4: 'xl:row-start-4',
		5: 'xl:row-start-5',
		6: 'xl:row-start-6',
	}

	return (
		<ul className="mt-16 flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-4 xl:mt-0 xl:grid xl:grid-flow-col xl:grid-cols-5 xl:grid-rows-6">
			<TooltipProvider>
				{logos.map((logo, i) => (
					<li
						key={logo.href}
						className={cn(
							columnClasses[logo.column],
							rowClasses[logo.row],
							'animate-roll-reveal [animation-fill-mode:backwards]',
						)}
						style={{ animationDelay: `${i * 0.07}s` }}
					>
						<Tooltip>
							<TooltipTrigger asChild>
								<a
									href={logo.href}
									className="grid size-20 place-items-center rounded-2xl bg-violet-600/10 p-4 transition hover:-rotate-6 hover:bg-violet-600/15 dark:bg-violet-200 dark:hover:bg-violet-100 sm:size-24"
								>
									<img src={logo.src} alt="" />
								</a>
							</TooltipTrigger>
							<TooltipContent>{logo.alt}</TooltipContent>
						</Tooltip>
					</li>
				))}
			</TooltipProvider>
		</ul>
	)
}
