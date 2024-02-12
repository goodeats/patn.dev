import { type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, json } from '@remix-run/react'
import { requireUserWithAdminRole } from '#app/utils/permissions.server'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserWithAdminRole(request)
	return json({})
}

export default function PostRoute() {
	return <Outlet />
}
