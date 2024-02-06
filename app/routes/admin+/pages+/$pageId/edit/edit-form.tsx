import {
	FormProvider,
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type Page } from '@prisma/client'
import {
	json,
	redirect,
	type ActionFunctionArgs,
	type SerializeFrom,
} from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'
import {
	FormActionsContainer,
	FormContainer,
	FormFieldsContainer,
	GeneralErrorBoundary,
	formDefaultClassName,
} from '#app/components/layout'
import {
	ErrorList,
	Field,
	TextareaField,
	StatusButton,
	HiddenSubmitButton,
	CheckboxField,
} from '#app/components/templates'
import { Button } from '#app/components/ui'
import { prisma } from '#app/utils/db.server.ts'
import { stringToSlug, useIsPending } from '#app/utils/misc.tsx'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'

const titleMinLength = 1
const titleMaxLength = 16
const descriptionMinLength = 1
const descriptionMaxLength = 10000

const EditPageSchema = z.object({
	id: z.string(),
	name: z.string().min(titleMinLength).max(titleMaxLength),
	description: z.string().min(descriptionMinLength).max(descriptionMaxLength),
	published: z.boolean().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
	await requireUserWithAdminRole(request)

	const formData = await request.formData()

	const submission = await parseWithZod(formData, {
		schema: EditPageSchema.superRefine(async (data, ctx) => {
			const page = await prisma.page.findUnique({
				select: { id: true },
				where: { id: data.id },
			})
			if (!page) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Page not found',
				})
			}

			const pageWithName = await prisma.page.findFirst({
				select: { id: true },
				where: { name: data.name },
			})
			if (pageWithName && pageWithName.id !== data.id) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Page with that name already exists`,
				})
				return
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { id: pageId, name, description, published } = submission.value
	const slug = stringToSlug(name)

	const updatedPage = await prisma.page.update({
		where: { id: pageId },
		select: { slug: true },
		data: {
			name,
			description,
			slug,
			published,
		},
	})

	return redirect(`/admin/pages/${updatedPage.slug}`)
}

export function EditForm({
	page,
}: {
	page: SerializeFrom<Pick<Page, 'id' | 'name' | 'description' | 'published'>>
}) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'edit-page',
		constraint: getZodConstraint(EditPageSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: EditPageSchema })
		},
		defaultValue: {
			...page,
		},
	})

	return (
		<FormContainer>
			<FormProvider context={form.context}>
				<Form
					method="POST"
					className={formDefaultClassName}
					{...getFormProps(form)}
				>
					<HiddenSubmitButton />
					<input type="hidden" name="id" value={page.id} />
					<FormFieldsContainer>
						{/* Fields name */}
						<Field
							labelProps={{ children: 'Name' }}
							inputProps={{
								autoFocus: true,
								...getInputProps(fields.name, { type: 'text' }),
							}}
							errors={fields.name.errors}
						/>
						{/* Fields description */}
						<TextareaField
							labelProps={{ children: 'Description' }}
							textareaProps={{
								...getTextareaProps(fields.description, {
									ariaAttributes: true,
								}),
							}}
							errors={fields.description.errors}
						/>
						{/* Fields published */}
						<CheckboxField
							labelProps={{
								htmlFor: fields.published.id,
								children: 'Publish',
							}}
							buttonProps={getInputProps(fields.published, {
								type: 'checkbox',
							})}
							errors={fields.published.errors}
						/>
					</FormFieldsContainer>
					<ErrorList id={form.errorId} errors={form.errors} />
				</Form>
				{/* Form actions */}
				<FormActionsContainer>
					<Button form={form.id} variant="destructive" type="reset">
						Reset
					</Button>
					<StatusButton
						form={form.id}
						type="submit"
						disabled={isPending}
						status={isPending ? 'pending' : 'idle'}
					>
						Submit
					</StatusButton>
				</FormActionsContainer>
			</FormProvider>
		</FormContainer>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No layer with the id "{params.layerId}" exists</p>
				),
			}}
		/>
	)
}
