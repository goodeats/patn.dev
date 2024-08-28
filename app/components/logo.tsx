import { Link } from '@remix-run/react'

export function Logo() {
	return (
		<Link
			to="/"
			className="group grid leading-snug"
			prefetch="intent"
			unstable_viewTransition
		>
			<span className="font-light transition group-hover:-translate-x-1">
				patn
			</span>
			<span className="font-bold transition group-hover:translate-x-1">
				dev
			</span>
		</Link>
	)
}
