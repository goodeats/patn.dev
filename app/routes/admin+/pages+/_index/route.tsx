import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, json, useLoaderData } from '@remix-run/react'
import { ContentHeader, ContentSection } from '#app/components/layout'
import { Button, Icon } from '#app/components/ui'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui/table'
import { prisma } from '#app/utils/db.server'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserWithAdminRole(request)
	const pages = await prisma.page.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			slug: true,
			published: true,
			updatedAt: true,
		},
		orderBy: {
			order: 'asc',
		},
	})

	return json({ pages })
}

export default function PagesIndexRoute() {
	const data = useLoaderData<typeof loader>()
	const { pages } = data

	return (
		<div>
			<ContentHeader>Pages</ContentHeader>
			<ContentSection>
				<div className="ml-auto mr-4">
					<Button asChild>
						<Link to="new" prefetch="intent">
							<Icon name="plus">Add Page</Icon>
						</Link>
					</Button>
				</div>
			</ContentSection>
			<Table>
				<TableCaption>A list of your pages.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Page</TableHead>
						<TableHead>Published</TableHead>
						<TableHead>Date</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{pages.map(page => {
						return (
							<TableRow key={page.id}>
								<TableCell className="font-medium">{page.name}</TableCell>
								<TableCell className="text-right">
									{new Date(page.updatedAt).toLocaleDateString()}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}
