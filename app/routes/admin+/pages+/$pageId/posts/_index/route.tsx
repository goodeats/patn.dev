import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, json, useLoaderData } from '@remix-run/react'
import {
	ContentBody,
	ContentHeader,
	ContentSection,
} from '#app/components/layout'
import {
	Button,
	Icon,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui'
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
			publishedAt: true,
			updatedAt: true,
		},
		orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
	})

	return json({ page, posts })
}

export default function PageRoute() {
	const data = useLoaderData<typeof loader>()
	const { page, posts } = data

	return (
		<ContentBody>
			<ContentHeader>{page.name} Posts</ContentHeader>
			<ContentSection>
				<div className="ml-4 mr-auto flex w-full justify-between">
					<Button asChild>
						<Link to=".." prefetch="intent">
							<Icon name="arrow-left">Back</Icon>
						</Link>
					</Button>
					<Button asChild>
						<Link to="new" prefetch="intent">
							<Icon name="plus">Add Post</Icon>
						</Link>
					</Button>
				</div>
			</ContentSection>
			<Table>
				<TableCaption>
					A list of your pages in order of most recently published.
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Post</TableHead>
						<TableHead>Published</TableHead>
						<TableHead className="text-right">Date</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{posts.map(post => {
						const { id, slug, title, published, publishedAt, updatedAt } = post
						return (
							<TableRow key={id}>
								<TableCell>
									<Link to={slug}>{title}</Link>
								</TableCell>
								<TableCell>{published ? 'Yes' : 'No'}</TableCell>
								<TableCell className="text-right">
									{new Date(publishedAt || updatedAt).toLocaleDateString()}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</ContentBody>
	)
}
