import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Icon,
} from '#app/components/ui'

export const DeleteDialog = ({
	title,
	description,
	children,
}: {
	title: string
	description: string
	children: React.ReactNode
}) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive">
					<Icon name="trash" className="scale-125 max-md:scale-150">
						<span className="max-md:hidden">Delete...</span>
					</Icon>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>{children}</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
