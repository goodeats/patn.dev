import { invariantResponse } from '@epic-web/invariant'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import {
	MainContainer,
	GeneralErrorBoundary,
	MainWrapper,
	MainContent,
	SideNavWrapper,
	SideNavContainer,
	SideNavHeaderLink,
	SideNavHeaderTitle,
	SideNavList,
	SideNavListItem,
	SideNavLink,
} from '#app/components/layout'
import { prisma } from '#app/utils/db.server'
import { requireUserWithAdminRole } from '#app/utils/permissions.server.ts'

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

export async function loader({ request }: LoaderFunctionArgs) {
	const adminId = await requireUserWithAdminRole(request)
	const admin = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
		},
		where: { id: adminId },
	})

	invariantResponse(admin, 'Owner not found', { status: 404 })

	return json({})
}

export default function AdminRoute() {
	return (
		<MainWrapper>
			<MainContainer>
				<SideNavWrapper>
					<SideNavContainer>
						<SideNavHeaderLink to="admin">
							<SideNavHeaderTitle>Admin</SideNavHeaderTitle>
						</SideNavHeaderLink>
						<SideNavList>
							<SideNavListItem>
								<SideNavLink to="/settings/profile">Profile</SideNavLink>
							</SideNavListItem>
						</SideNavList>
					</SideNavContainer>
				</SideNavWrapper>
				<MainContent>
					<Outlet />
				</MainContent>
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
