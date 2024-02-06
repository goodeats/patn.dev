import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { LogoGrid } from '#app/components/templates'
import { prisma } from '#app/utils/db.server.ts'
import { getUserImgSrc } from '#app/utils/misc.tsx'
import { logos } from './logos/logos.ts'

export const meta: MetaFunction = () => [{ title: 'Pat Needham' }]

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await prisma.user.findFirst({
		select: { id: true, image: { select: { id: true } } },
	})
	return json({ user })
}

export default function Index() {
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
				<a href="https://github.com/goodeats/patn.dev">Pat Needham</a>
			</h1>
		)
	}

	const CallToAction = () => {
		return (
			<p
				data-paragraph
				className="mt-6 animate-slide-top text-xl/7 text-muted-foreground [animation-fill-mode:backwards] [animation-delay:0.8s] xl:mt-8 xl:animate-slide-left xl:text-xl/6 xl:leading-10 xl:[animation-fill-mode:backwards] xl:[animation-delay:1s]"
			>
				Check out the{' '}
				<a
					className="underline hover:no-underline"
					href="https://github.com/goodeats/patn.dev"
				>
					GitHub Repo
				</a>{' '}
				for my portfolio site while it is under construction! 🚧
			</p>
		)
	}

	return (
		<main className="font-poppins grid h-full place-items-center">
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
				<LogoGrid logos={logos} />
			</div>
		</main>
	)
}
