import { type LoaderFunctionArgs } from '@remix-run/node'
import { Link, json } from '@remix-run/react'
import {
	ContentBody,
	ContentHeader,
	ContentSection,
} from '#app/components/layout'
import { Button, Icon } from '#app/components/ui'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserWithAdminRole(request)
	return json({})
}

export default function PageRoute() {
	return (
		<ContentBody>
			<ContentHeader>Posts</ContentHeader>
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
