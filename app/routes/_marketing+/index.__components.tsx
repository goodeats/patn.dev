import React from 'react'

export function Header() {
	return (
		<>
			<h1 className="mb-4 text-center text-h3 text-primary sm:mb-6 sm:text-h2 md:text-h1">
				Pat Needham
			</h1>
			<p className="mb-6 text-center text-body-md text-muted-foreground sm:mb-8 sm:text-body-lg md:text-body-xl">
				Full-stack web developer from New York City
			</p>
		</>
	)
}

export function AboutSection() {
	return (
		<section>
			<h2 className="mb-3 text-h5 text-secondary sm:mb-4 sm:text-h4 md:text-h3">
				About Me
			</h2>
			<p className="text-body-sm sm:text-body-md">
				I'm a passionate full-stack web developer based in Brooklyn. With
				expertise in both front-end and back-end technologies, I create robust
				and user-friendly web applications with a decade of experience.
			</p>
		</section>
	)
}

export function WorkSection() {
	return (
		<section>
			<h2 className="mb-3 text-h5 text-secondary sm:mb-4 sm:text-h4 md:text-h3">
				My Work
			</h2>
			<p className="mb-4 text-body-sm sm:text-body-md">
				Check out some of my recent projects:
			</p>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{['Project 1', 'Project 2', 'Project 3'].map((project, index) => (
					<div
						key={index}
						className="rounded-lg bg-card p-4 shadow-md transition-colors hover:bg-accent"
					>
						<h3 className="mb-2 text-h6">{project}</h3>
						<p className="text-body-2xs text-card-foreground sm:text-body-xs md:text-body-sm">
							Brief description of the project.
						</p>
					</div>
				))}
			</div>
		</section>
	)
}

export function ContactSection() {
	return (
		<section>
			<h2 className="mb-3 text-h5 text-secondary sm:mb-4 sm:text-h4 md:text-h3">
				Contact
			</h2>
			<p className="mb-4 text-body-sm sm:text-body-md">Get in touch with me:</p>
			<a
				href="mailto:pat@example.com"
				className="inline-block rounded-md bg-primary px-3 py-2 text-body-xs text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4 sm:py-2 sm:text-body-sm"
			>
				Email Me
			</a>
		</section>
	)
}
