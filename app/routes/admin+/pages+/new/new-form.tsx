import {
	FormProvider,
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
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
const titleMaxLength = 16
const descriptionMinLength = 1
const descriptionMaxLength = 10000

const NewPageSchema = z.object({
	name: z.string().min(titleMinLength).max(titleMaxLength),
	description: z.string().min(descriptionMinLength).max(descriptionMaxLength),
	published: z.boolean().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
	await requireUserWithAdminRole(request)

	const formData = await request.formData()

	const submission = await parseWithZod(formData, {
		schema: NewPageSchema.superRefine(async (data, ctx) => {
			const pageWithName = await prisma.page.findFirst({
				select: { id: true },
				where: { name: data.name },
			})
			if (pageWithName) {
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

	const { name, description, published } = submission.value
	const slug = stringToSlug(name)
	const orderInt = await prisma.page.count()

	const createdPage = await prisma.page.create({
		select: { slug: true },
		data: {
			name,
			description,
			slug,
			published,
			order: orderInt,
		},
	})

	return redirect(`/admin/pages/${createdPage.slug}`)
}

export function NewForm() {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	// TODO: keep previous form data on backend error
	const [form, fields] = useForm({
		id: 'new-page',
		constraint: getZodConstraint(NewPageSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: NewPageSchema })
		},
	})

	const FormName = () => {
		return (
			<Field
				labelProps={{ children: 'Name' }}
				inputProps={{
					autoFocus: true,
					...getInputProps(fields.name, { type: 'text' }),
				}}
				errors={fields.name.errors}
			/>
		)
	}

	const FormDescription = () => {
		return (
			<TextareaField
				labelProps={{ children: 'Description' }}
				textareaProps={{
					...getTextareaProps(fields.description, { ariaAttributes: true }),
				}}
				errors={fields.description.errors}
			/>
		)
	}

	const FormPublished = () => {
		return (
			<CheckboxField
				labelProps={{
					htmlFor: fields.published.id,
					children: 'Publish',
				}}
				buttonProps={getInputProps(fields.published, { type: 'checkbox' })}
				errors={fields.published.errors}
			/>
		)
	}

	const FormActions = () => {
		return (
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
		)
	}

	return (
		<FormContainer>
			<FormProvider context={form.context}>
				<Form
					method="POST"
					className={formDefaultClassName}
					{...getFormProps(form)}
				>
					<HiddenSubmitButton />
					<FormFieldsContainer>
						<FormName />
						<FormDescription />
						<FormPublished />
					</FormFieldsContainer>
					<ErrorList id={form.errorId} errors={form.errors} />
				</Form>
				<FormActions />
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
