import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary, HomeWrapper } from '#app/components/layout'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Icon,
	Separator,
} from '#app/components/ui'
import { prisma } from '#app/utils/db.server'
import { getUserImgSrc } from '#app/utils/misc'

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await prisma.user.findFirst({
		select: { id: true, image: { select: { id: true } } },
	})

	const page = await prisma.page.findFirst({
		where: { slug: 'contact', published: true },
		select: {
			id: true,
			name: true,
			slug: true,
			posts: {
				where: { published: true },
				select: {
					id: true,
					title: true,
					slug: true,
					published: true,
					publishedAt: true,
					updatedAt: true,
				},
				orderBy: [{ publishedAt: 'desc' }],
			},
		},
	})
	return json({ user, page })
}

export default function AboutRoute() {
	const data = useLoaderData<typeof loader>()
	const { user } = data

	const Logo = () => {
		if (!user) {
			return (
				<svg
					className="size-20 text-foreground xl:-mt-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 65 65"
				>
					<path
						fill="currentColor"
						d="M39.445 25.555 37 17.163 65 0 47.821 28l-8.376-2.445Zm-13.89 0L28 17.163 0 0l17.179 28 8.376-2.445Zm13.89 13.89L37 47.837 65 65 47.821 37l-8.376 2.445Zm-13.89 0L28 47.837 0 65l17.179-28 8.376 2.445Z"
					></path>
				</svg>
			)
		}

		return (
			<img
				className="h-52 w-52 rounded-full object-cover"
				alt="Pat Needham"
				src={getUserImgSrc(user.image?.id)}
			/>
		)
	}

	const Heading = () => {
		return (
			<h1
				data-heading
				className="mt-8 animate-slide-top text-4xl font-medium text-foreground [animation-delay:0.3s] [animation-fill-mode:backwards] md:text-5xl xl:mt-4 xl:animate-slide-left xl:text-6xl xl:[animation-delay:0.8s] xl:[animation-fill-mode:backwards]"
			>
				Contact
			</h1>
		)
	}

	const CallToAction = () => {
		return (
			<p
				data-paragraph
				className="mt-6 animate-slide-top text-xl/7 text-muted-foreground [animation-fill-mode:backwards] [animation-delay:0.8s] xl:mt-8 xl:animate-slide-left xl:text-xl/6 xl:leading-10 xl:[animation-fill-mode:backwards] xl:[animation-delay:1s]"
			>
				Here are some ways to get in touch with me.
			</p>
		)
	}

	const ContactCard = () => {
		return (
			<Card className="mt-16 xl:mt-0">
				<CardHeader>
					<CardTitle>Social links</CardTitle>
					<CardDescription>I'll be adding more soon</CardDescription>
				</CardHeader>
				<CardContent>
					<Separator className="mb-4" />
					<div className="space-y-4">
						<div className="grid gap-6">
							{/* email */}
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									<Icon name="envelope-closed" size="lg" />
									<div>
										<p className="text-sm font-medium leading-none">Email</p>
										<p className="text-sm text-muted-foreground">
											patrick.h.needham@gmail.com
										</p>
									</div>
								</div>
							</div>
							{/* github */}
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									<Icon name="github-logo" size="lg" />
									<div>
										<p className="text-sm font-medium leading-none">GitHub</p>
										<p className="text-sm text-muted-foreground">goodeats</p>
									</div>
								</div>
								<a
									href="https://github.com/goodeats"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon name="external-link" size="lg" />
								</a>
							</div>
							{/* linkedin */}
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									<Icon name="linkedin-logo" size="lg" />
									<div>
										<p className="text-sm font-medium leading-none">LinkedIn</p>
										<p className="text-sm text-muted-foreground">
											/in/patrickneedham
										</p>
									</div>
								</div>
								<a
									href="https://www.linkedin.com/in/patrickneedham/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon name="external-link" size="lg" />
								</a>
							</div>
							{/* twitter */}
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									<Icon name="twitter-logo" size="lg" />
									<div>
										<p className="text-sm font-medium leading-none">Twitter</p>
										<p className="text-sm text-muted-foreground">
											@patneedham_
										</p>
									</div>
								</div>
								<a
									href="https://twitter.com/patneedham_"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon name="external-link" size="lg" />
								</a>
							</div>
							{/* instagram */}
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									<Icon name="instagram-logo" size="lg" />
									<div>
										<p className="text-sm font-medium leading-none">
											Instagram
										</p>
										<p className="text-sm text-muted-foreground">
											@patneedham_
										</p>
									</div>
								</div>
								<a
									href="https://www.instagram.com/patneedham_"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon name="external-link" size="lg" />
								</a>
							</div>
							{/* instagram */}
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									<Icon name="instagram-logo" size="lg" />
									<div>
										<p className="text-sm font-medium leading-none">
											Instagram (Code Art)
										</p>
										<p className="text-sm text-muted-foreground">
											@pppaaattt.xyz
										</p>
									</div>
								</div>
								<a
									href="https://www.instagram.com/pppaaattt.xyz"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon name="external-link" size="lg" />
								</a>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<HomeWrapper>
			<div className="grid place-items-center px-4 py-16 xl:grid-cols-2 xl:gap-24">
				<div className="flex max-w-md flex-col items-center text-center xl:order-2 xl:items-start xl:text-left">
					<a
						href="https://github.com/goodeats/patn.dev"
						className="animate-slide-top [animation-fill-mode:backwards] xl:animate-slide-left xl:[animation-fill-mode:backwards] xl:[animation-delay:0.5s]"
					>
						<Logo />
					</a>
					<Heading />
					<CallToAction />
				</div>
				<ContactCard />
			</div>
		</HomeWrapper>
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
