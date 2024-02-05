import { FormProvider, getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type Page } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { useActionData, useFetcher } from '@remix-run/react'
import { ErrorList, StatusButton } from '#app/components/templates'
import {
	Icon,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui'
import { useIsPending } from '#app/utils/misc.tsx'
import { EditPageOrderSchema, INTENT } from './actions'
import { type action } from './route'

export function EditOrderForm({
	page,
	direction,
	pageCount,
}: {
	page: SerializeFrom<Pick<Page, 'id' | 'name' | 'order'>>
	direction: 'up' | 'down'
	pageCount: number
}) {
	const fetcher = useFetcher()

	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const pageAtTop = page.order === 0 && direction === 'up'
	const pageAtBottom = page.order === pageCount - 1 && direction === 'down'

	const [form] = useForm({
		id: `edit-page-order-${page.id}-${direction}`,
		constraint: getZodConstraint(EditPageOrderSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			const submission = parseWithZod(formData, { schema: EditPageOrderSchema })
			return submission
		},
	})

	return (
		<FormProvider context={form.context}>
			<fetcher.Form method="POST" {...getFormProps(form)}>
				<input type="hidden" name="id" value={page.id} />
				<input type="hidden" name="direction" value={direction} />
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<StatusButton
								id={`${form.id}-submit`}
								form={form.id}
								type="submit"
								name="intent"
								value={INTENT.updatePageOrder}
								disabled={isPending || pageAtTop || pageAtBottom}
								status={isPending ? 'pending' : 'idle'}
								className="flex h-8 w-8 items-center justify-center"
							>
								<div className="flex flex-1 items-center justify-center ">
									<Icon name={`chevron-${direction}`}>
										<span className="sr-only">Move {direction}</span>
									</Icon>
								</div>
							</StatusButton>
						</TooltipTrigger>
						<TooltipContent>
							{direction === 'up' ? 'Move Up' : 'Move Down'}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<ErrorList id={form.errorId} errors={form.errors} />
			</fetcher.Form>
		</FormProvider>
	)
}
