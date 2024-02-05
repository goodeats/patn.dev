import { type LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/react'
import { ContentHeader } from '#app/components/layout'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'
import { NewForm, action } from './new-form'

export { action }
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserWithAdminRole(request)
	return json({})
}

export default function NewPageRoute() {
	return (
		<div>
			<ContentHeader>New Page</ContentHeader>
			<NewForm />
		</div>
	)
}
