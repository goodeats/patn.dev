import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import { ContentBody, ContentHeader } from '#app/components/layout'
import { prisma } from '#app/utils/db.server'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'
import { NewForm, action } from './new-form'

export { action }
export async function loader({ params, request }: LoaderFunctionArgs) {
	await requireUserWithAdminRole(request)

	const pageSlug = params.pageId

	const page = await prisma.page.findFirst({
		where: { slug: pageSlug },
		select: {
			id: true,
			name: true,
			slug: true,
		},
	})

	invariantResponse(page, 'Not found', { status: 404 })
	return json({ page })
}

export default function NewPostRoute() {
	const data = useLoaderData<typeof loader>()
	const { page } = data

	return (
		<ContentBody>
			<ContentHeader>New {page.name} Post</ContentHeader>
			<NewForm pageId={page.id} />
		</ContentBody>
	)
}
