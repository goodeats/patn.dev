import { getFormProps, useForm } from '@conform-to/react'
import { Form, useActionData } from '@remix-run/react'
import { ErrorList, StatusButton } from '#app/components/templates'
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
import { useIsPending } from '#app/utils/misc.tsx'
import { INTENT } from './actions'
import { type action } from './route'

export function DeleteForm({ id }: { id: string }) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form] = useForm({
		id: 'delete-page',
		lastResult: actionData?.result,
	})

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
					<DialogTitle>Delete Page</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this page?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Form method="POST" {...getFormProps(form)}>
						<input type="hidden" name="id" value={id} />

						<StatusButton
							id={`${form.id}-submit`}
							form={form.id}
							type="submit"
							name="intent"
							value={INTENT.deletePage}
							variant="destructive"
							disabled={isPending}
							status={isPending ? 'pending' : form.status ?? 'idle'}
						>
							<Icon name="trash" className="scale-125 max-md:scale-150">
								<span className="max-md:hidden">Confirm Delete</span>
							</Icon>
						</StatusButton>
						<ErrorList id={form.errorId} errors={form.errors} />
					</Form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
