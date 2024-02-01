import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { ContentHeader } from '#app/components/layout'
import { prisma } from '#app/utils/db.server'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'

export async function loader({ params, request }: LoaderFunctionArgs) {
	await requireUserWithAdminRole(request)
	const page = await prisma.page.findFirst({
		where: { slug: params.pageId },
		select: {
			id: true,
			name: true,
			description: true,
			slug: true,
			published: true,
			updatedAt: true,
		},
	})

	invariantResponse(page, 'Not found', { status: 404 })

	const date = new Date(page.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return json({ page, timeAgo })
}

export default function PageRoute() {
	const data = useLoaderData<typeof loader>()
	const { page } = data
	const { name, description, published } = page
	return (
		<div>
			<ContentHeader>{name}</ContentHeader>
			<p>{description}</p>
			<p>{published ? 'Published' : 'Not Published'}</p>
		</div>
	)
}
