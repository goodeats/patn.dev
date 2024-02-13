import { getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint } from '@conform-to/zod'
import { Form, useActionData } from '@remix-run/react'
import {
	DeleteDialog,
	ErrorList,
	StatusButton,
} from '#app/components/templates'
import { Icon } from '#app/components/ui'
import { useIsPending } from '#app/utils/misc.tsx'
import { DeletePostSchema } from '#app/utils/zod-schema'
import { INTENT } from './actions'
import { type action } from './route'

export function DeleteForm({ id }: { id: string }) {
	const DeleteConfirm = () => {
		// keep form data in sync with the action data inside confirm component
		// will display an error if attempting to locate form before it is rendered
		const actionData = useActionData<typeof action>()
		const isPending = useIsPending()

		const [form] = useForm({
			id: 'delete-post',
			constraint: getZodConstraint(DeletePostSchema),
			lastResult: actionData?.result,
		})

		return (
			<Form method="POST" {...getFormProps(form)}>
				<input type="hidden" name="id" value={id} />

				<StatusButton
					id={`${form.id}-submit`}
					form={form.id}
					type="submit"
					name="intent"
					value={INTENT.deletePost}
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
		)
	}

	return (
		<DeleteDialog
			title="Delete Post"
			description="Are you sure you want to delete this post?"
		>
			<DeleteConfirm />
		</DeleteDialog>
	)
}
