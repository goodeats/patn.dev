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
	CardFooter,
	CardHeader,
	CardTitle,
} from '#app/components/ui'
import { requireAdminUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'
import { INTENT, deletePageAction } from './actions'
import { DeleteForm } from './delete-form'

export async function action({ request }: DataFunctionArgs) {
	await requireAdminUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')
	switch (intent) {
		case INTENT.deletePage: {
			return deletePageAction({ request, formData })
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

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
			posts: {
				select: {
					id: true,
					title: true,
					slug: true,
				},
				orderBy: {
					updatedAt: 'desc',
				},
			},
		},
	})

	invariantResponse(page, 'Not found', { status: 404 })

	const date = new Date(page.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return json({ page, timeAgo })
}

export default function PageDetailsRoute() {
	const data = useLoaderData<typeof loader>()
	const { page } = data
	const { name, description, published, posts } = page
	return (
		<ContentBody>
			<ContentHeader>{name}</ContentHeader>
			<ContentSection>
				<Badge variant={published ? 'secondary' : 'destructive'}>
					{published ? 'Published' : 'Not Published'}
				</Badge>
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
							<CardTitle>Posts</CardTitle>
						</CardHeader>
						<CardContent>{posts.length}</CardContent>
						<CardFooter>
							<Button asChild>
								<Link to="posts">View Posts</Link>
							</Button>
						</CardFooter>
					</Card>
				</ContentCardGrid>
			</ContentSection>
			<FooterContainer>
				<FooterIconIndicator icon="clock">
					{data.timeAgo} ago
				</FooterIconIndicator>
				<FooterActions>
					<FooterLinkButton to="edit" icon="pencil-1">
						Edit
					</FooterLinkButton>
					<DeleteForm id={page.id} />
				</FooterActions>
			</FooterContainer>
		</ContentBody>
	)
}
