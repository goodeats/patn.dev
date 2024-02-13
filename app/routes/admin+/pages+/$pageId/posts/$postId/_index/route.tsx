import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, json, useLoaderData } from '@remix-run/react'
import { type DataFunctionArgs } from '@sentry/remix/types/utils/vendor/types'
import { formatDistanceToNow } from 'date-fns'
import {
	ContentBody,
	ContentCardGrid,
	ContentHeader,
	ContentSection,
	FooterActions,
	FooterContainer,
	FooterIconIndicator,
	FooterLinkButton,
} from '#app/components/layout'
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Icon,
} from '#app/components/ui'
import { requireAdminUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'
import { INTENT, deletePostAction } from './actions'
import { DeleteForm } from './delete-form'

export async function action({ request }: DataFunctionArgs) {
	await requireAdminUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')
	switch (intent) {
		case INTENT.deletePost: {
			return deletePostAction({ request, formData })
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

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
		},
	})

	invariantResponse(post, 'Not found', { status: 404 })

	const updatedAtDate = new Date(post.updatedAt)
	const updatedtimeAgo = formatDistanceToNow(updatedAtDate)

	return json({ page, post, updatedtimeAgo })
}

export default function PostDetailsRoute() {
	const data = useLoaderData<typeof loader>()
	const { page, post } = data
	const { title, description, content, published, publishedAt } = post
	const publishedAtDate =
		published && publishedAt ? formatDistanceToNow(new Date(publishedAt)) : null

	return (
		<ContentBody>
			<ContentHeader>{title}</ContentHeader>
			<ContentSection>
				<Badge variant={published ? 'secondary' : 'destructive'}>
					{published ? 'Published' : 'Not Published'}
				</Badge>
			</ContentSection>
			<ContentSection>
				<div className="ml-4 mr-auto flex gap-4">
					<Button asChild>
						<Link to="../.." prefetch="intent">
							<Icon name="arrow-left">{page.name}</Icon>
						</Link>
					</Button>
					<Button asChild>
						<Link to=".." prefetch="intent">
							<Icon name="arrow-left">Posts</Icon>
						</Link>
					</Button>
				</div>
			</ContentSection>
			<ContentSection>
				<ContentCardGrid>
					<Card>
						<CardHeader>
							<CardTitle>Description</CardTitle>
						</CardHeader>
						<CardContent>{description}</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Content</CardTitle>
						</CardHeader>
						<CardContent>{content}</CardContent>
					</Card>
				</ContentCardGrid>
			</ContentSection>
			<FooterContainer>
				<FooterIconIndicator icon="clock">
					<span className="sr-only">Updated: </span>
					{data.updatedtimeAgo} ago
				</FooterIconIndicator>
				{publishedAtDate && (
					<FooterIconIndicator icon="rocket">
						<span className="sr-only">Published: </span>
						{publishedAtDate} ago
					</FooterIconIndicator>
				)}
				<FooterActions>
					<FooterLinkButton to="edit" icon="pencil-1">
						Edit
					</FooterLinkButton>
					<DeleteForm id={post.id} />
				</FooterActions>
			</FooterContainer>
		</ContentBody>
	)
}
