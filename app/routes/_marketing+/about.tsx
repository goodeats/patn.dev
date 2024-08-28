import { type MetaFunction } from '@remix-run/node'
import {
	PageLayout,
	Container,
	Content,
	PageTitle,
	Paragraph,
} from '#app/components/layouts/page'

export const meta: MetaFunction = () => [{ title: 'About Pat Needham' }]

export default function AboutRoute() {
	return (
		<PageLayout>
			<Container>
				<Content>
					<PageTitle>About Me</PageTitle>
					<Paragraph>
						I'm a passionate full-stack web developer based in Brooklyn.
					</Paragraph>
					<Paragraph>
						With expertise in both front-end and back-end technologies, I create
						robust and user-friendly web applications with a decade of
						experience. My goal is to build efficient, scalable, and
						maintainable solutions that solve real-world problems and provide
						excellent user experiences.
					</Paragraph>
				</Content>
			</Container>
		</PageLayout>
	)
}
