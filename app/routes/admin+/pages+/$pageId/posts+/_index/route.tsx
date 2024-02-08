import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, json, useLoaderData } from '@remix-run/react'
import {
	ContentBody,
	ContentHeader,
	ContentSection,
} from '#app/components/layout'
import { Button, Icon } from '#app/components/ui'
import { prisma } from '#app/utils/db.server'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'

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

	const posts = await prisma.post.findMany({
		where: { pageId: page.id },
		select: {
			id: true,
			title: true,
			slug: true,
			published: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: 'desc',
		},
	})

	return json({ page, posts })
}

export default function PageRoute() {
	const data = useLoaderData<typeof loader>()
	const { page } = data

	return (
		<ContentBody>
			<ContentHeader>{page.name} Posts</ContentHeader>
			<ContentSection>
				<div className="ml-4 mr-auto">
					<Button asChild>
						<Link to=".." prefetch="intent">
							<Icon name="arrow-left">Back</Icon>
						</Link>
					</Button>
				</div>
			</ContentSection>
		</ContentBody>
	)
}
