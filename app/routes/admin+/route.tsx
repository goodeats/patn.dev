import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import {
	MainContainer,
	GeneralErrorBoundary,
	MainWrapper,
	MainContentWrapper,
	SideNavWrapper,
	SideNavContainer,
	SideNavHeaderLink,
	SideNavHeaderTitle,
	SideNavList,
	SideNavListItem,
	SideNavLink,
} from '#app/components/layout'
import { requireUserWithAdminRole } from '#app/utils/permissions.server.ts'

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserWithAdminRole(request)
	return json({})
}

export default function AdminRoute() {
	return (
		<MainWrapper>
			<MainContainer>
				<SideNavWrapper>
					<SideNavContainer>
						<SideNavHeaderLink to="/admin">
							<SideNavHeaderTitle>Admin</SideNavHeaderTitle>
						</SideNavHeaderLink>
						<SideNavList>
							<SideNavListItem>
								<SideNavLink to="/settings/profile">Profile</SideNavLink>
							</SideNavListItem>
							<SideNavListItem>
								<SideNavLink to="pages">Pages</SideNavLink>
							</SideNavListItem>
						</SideNavList>
					</SideNavContainer>
				</SideNavWrapper>
				<MainContentWrapper>
					<Outlet />
				</MainContentWrapper>
			</MainContainer>
		</MainWrapper>
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
