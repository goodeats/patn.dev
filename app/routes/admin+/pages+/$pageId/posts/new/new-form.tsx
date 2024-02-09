import {
	FormProvider,
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
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
const titleMaxLength = 30
const descriptionMinLength = 1
const descriptionMaxLength = 10000
const contentMinLength = 1
const contentMaxLength = 100000

const NewPostSchema = z.object({
	pageId: z.string(),
	title: z
		.string({
			required_error: 'Title Required',
		})
		.min(titleMinLength)
		.max(titleMaxLength),
	description: z
		.string({
			required_error: 'Description Required',
		})
		.min(descriptionMinLength)
		.max(descriptionMaxLength),
	content: z
		.string({
			required_error: 'Content Required',
		})
		.min(contentMinLength)
		.max(contentMaxLength),
	published: z.boolean().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
	await requireUserWithAdminRole(request)

	const formData = await request.formData()

	const submission = await parseWithZod(formData, {
		schema: NewPostSchema.superRefine(async (data, ctx) => {
			const page = await prisma.page.findUnique({
				select: { id: true },
				where: { id: data.pageId },
			})
			if (!page) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Page does not exist`,
				})
			}

			const pagePostWithTitle = await prisma.post.findFirst({
				select: { id: true },
				where: { title: data.title },
			})
			if (pagePostWithTitle) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Post with that title already exists`,
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

	const { pageId, title, description, content, published } = submission.value
	const slug = stringToSlug(title)

	const page = await prisma.page.findUnique({
		select: { id: true, slug: true },
		where: { id: pageId },
	})

	invariantResponse(page, 'Page does not exist')

	let publishedAt = null
	if (published) {
		publishedAt = new Date()
	}

	const createdPost = await prisma.post.create({
		select: { slug: true },
		data: {
			title,
			description,
			content,
			slug,
			published,
			publishedAt,
			pageId,
		},
	})

	return redirect(`/admin/pages/${page.slug}/posts/${createdPost.slug}`)
}

export function NewForm({ pageId }: { pageId: string }) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	// TODO: keep previous form data on backend error
	const [form, fields] = useForm({
		id: 'new-page-post',
		constraint: getZodConstraint(NewPostSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: NewPostSchema })
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
					<input type="hidden" name="pageId" value={pageId} />

					<FormFieldsContainer>
						{/* Fields title */}
						<Field
							labelProps={{ children: 'Title' }}
							inputProps={{
								autoFocus: true,
								...getInputProps(fields.title, { type: 'text' }),
							}}
							errors={fields.title.errors}
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
						{/* Fields content */}
						<TextareaField
							labelProps={{ children: 'Content' }}
							textareaProps={{
								...getTextareaProps(fields.content, {
									ariaAttributes: true,
								}),
							}}
							errors={fields.content.errors}
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
