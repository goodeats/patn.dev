import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { GeneralErrorBoundary } from '#app/components/layout'
import { Spacer } from '#app/components/templates'
import { requireUserWithAdminRole } from '#app/utils/permissions.server.ts'

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserWithAdminRole(request)

	return json({})
}

export default function CacheAdminRoute() {
	return (
		<div className="container">
			<h1 className="text-h1">Admin</h1>
			<Spacer size="2xs" />
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: ({ error }) => (
					<p>You are not allowed to do that: {error?.data.message}</p>
				),
			}}
		/>
	)
}
