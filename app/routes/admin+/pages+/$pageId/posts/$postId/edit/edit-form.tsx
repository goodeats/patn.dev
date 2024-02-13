import {
	FormProvider,
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { type Post } from '@prisma/client'
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
import { EditPostSchema } from '#app/utils/zod-schema'

export async function action({ request }: ActionFunctionArgs) {
	await requireUserWithAdminRole(request)

	const formData = await request.formData()

	const submission = await parseWithZod(formData, {
		schema: EditPostSchema.superRefine(async (data, ctx) => {
			const post = await prisma.post.findUnique({
				select: { id: true },
				where: { id: data.id },
			})
			if (!post) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Post not found',
				})
				return
			}

			const postWithTitle = await prisma.post.findFirst({
				select: { id: true },
				where: { title: data.title },
			})
			if (postWithTitle && postWithTitle.id !== data.id) {
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

	const {
		id: postId,
		pageId,
		title,
		description,
		content,
		published,
	} = submission.value
	const slug = stringToSlug(title)

	const page = await prisma.page.findUnique({
		select: { id: true, slug: true },
		where: { id: pageId },
	})

	invariantResponse(page, 'Page does not exist')

	const post = await prisma.post.findUnique({
		select: { publishedAt: true },
		where: { id: postId },
	})

	invariantResponse(post, 'Post does not exist')

	const publishedAt = post.publishedAt
		? published
			? post.publishedAt // was published, still is
			: null // was published, now is not
		: published
			? new Date() // was not published, now is
			: null // was not published, still is not

	const updatedPost = await prisma.post.update({
		where: { id: postId },
		select: { slug: true },
		data: {
			title,
			description,
			content,
			slug,
			published: !!published, // if unchecked, published will not be in submission
			publishedAt,
		},
	})

	return redirect(`/admin/pages/${page.slug}/posts/${updatedPost.slug}`)
}

export function EditForm({
	post,
}: {
	post: SerializeFrom<
		Pick<
			Post,
			'id' | 'title' | 'description' | 'content' | 'published' | 'pageId'
		>
	>
}) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'edit-post',
		constraint: getZodConstraint(EditPostSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: EditPostSchema })
		},
		defaultValue: {
			...post,
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
					<input type="hidden" name="id" value={post.id} />
					<input type="hidden" name="pageId" value={post.pageId} />
					<FormFieldsContainer>
						{/* Fields name */}
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
					<p>No post with the id "{params.postId}" exists</p>
				),
			}}
		/>
	)
}
