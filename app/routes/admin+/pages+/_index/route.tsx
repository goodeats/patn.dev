import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, json, useLoaderData } from '@remix-run/react'
import { type DataFunctionArgs } from '@sentry/remix/types/utils/vendor/types'
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
import { requireAdminUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'
import { INTENT, updatePageOrderAction } from './actions'
import { EditOrderForm } from './edit-order-form'

export async function action({ request }: DataFunctionArgs) {
	await requireAdminUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')
	switch (intent) {
		case INTENT.updatePageOrder: {
			return updatePageOrderAction({ request, formData })
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserWithAdminRole(request)
	const pages = await prisma.page.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			slug: true,
			published: true,
			order: true,
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
				<TableCaption>
					A list of your pages in order as they will appear.
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Order</TableHead>
						<TableHead>Page</TableHead>
						<TableHead>Published</TableHead>
						<TableHead className="text-right">Date</TableHead>
						<TableHead className="sr-only w-[40px]">Change Order</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{pages.map(page => {
						return (
							<TableRow key={page.id}>
								<TableCell>{page.order}</TableCell>
								<TableCell>
									<Link to={page.slug}>{page.name}</Link>
								</TableCell>
								<TableCell>{page.published ? 'Yes' : 'No'}</TableCell>
								<TableCell className="text-right">
									{new Date(page.updatedAt).toLocaleDateString()}
								</TableCell>
								<TableCell className="w-[40px] text-right">
									<div id={`page-${page.id}-actions`} className="flex gap-2">
										<EditOrderForm
											page={page}
											direction="up"
											pageCount={pages.length}
										/>
										<EditOrderForm
											page={page}
											direction="down"
											pageCount={pages.length}
										/>
									</div>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}
