import { type MetaFunction } from '@remix-run/node'
import {
	Header,
	AboutSection,
	WorkSection,
	ContactSection,
} from './index.__components'

export const meta: MetaFunction = () => [{ title: 'Pat Needham' }]

export default function Index() {
	return (
		<main className="font-poppins min-h-screen bg-background text-foreground">
			<div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24">
				<div className="mx-auto max-w-3xl">
					<Header />
					<div className="space-y-8 md:space-y-12">
						<AboutSection />
						<WorkSection />
						<ContactSection />
					</div>
				</div>
			</div>
		</main>
	)
}
