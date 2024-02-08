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
import { EditForm, action } from './edit-form'

export { action }
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

	return json({ page })
}

export default function EditPageRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<ContentBody>
			<ContentHeader>Edit Page</ContentHeader>
			<ContentSection>
				<div className="ml-4 mr-auto">
					<Button asChild>
						<Link to=".." prefetch="intent">
							<Icon name="arrow-left">Cancel</Icon>
						</Link>
					</Button>
				</div>
			</ContentSection>
			<EditForm page={data.page} />
		</ContentBody>
	)
}
