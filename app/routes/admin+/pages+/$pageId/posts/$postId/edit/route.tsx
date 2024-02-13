import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, json, useLoaderData } from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import {
	ContentBody,
	ContentHeader,
	ContentSection,
} from '#app/components/layout'
import { Button, Icon } from '#app/components/ui'
import { prisma } from '#app/utils/db.server'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'
import { EditForm, action } from './edit-form'

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

	const post = await prisma.post.findFirst({
		where: { slug: params.postId },
		select: {
			id: true,
			title: true,
			description: true,
			content: true,
			slug: true,
			published: true,
			publishedAt: true,
			updatedAt: true,
			pageId: true,
		},
	})

	invariantResponse(post, 'Not found', { status: 404 })

	const updatedAtDate = new Date(post.updatedAt)
	const updatedtimeAgo = formatDistanceToNow(updatedAtDate)

	return json({ page, post, updatedtimeAgo })
}

export default function EditPostRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<ContentBody>
			<ContentHeader>Edit Post</ContentHeader>
			<ContentSection>
				<div className="ml-4 mr-auto">
					<Button asChild>
						<Link to=".." prefetch="intent">
							<Icon name="arrow-left">Cancel</Icon>
						</Link>
					</Button>
				</div>
			</ContentSection>
			<EditForm post={data.post} />
		</ContentBody>
	)
}
