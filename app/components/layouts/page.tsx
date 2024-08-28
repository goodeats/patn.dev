import { createLayoutComponent } from './utils'

export const PageLayout = createLayoutComponent({
	displayName: 'PageLayout',
	defaultClassName: 'font-poppins min-h-screen bg-background text-foreground',
})

export const Container = createLayoutComponent({
	displayName: 'Container',
	defaultClassName: 'container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24',
})

export const Content = createLayoutComponent({
	displayName: 'Content',
	defaultClassName: 'mx-auto max-w-3xl',
})

export const PageTitle = createLayoutComponent({
	displayName: 'PageTitle',
	defaultClassName: 'mb-6 text-h3 text-primary sm:text-h2 md:text-h1',
	defaultTagName: 'h1',
})

export const PageSubtitle = createLayoutComponent({
	displayName: 'PageSubtitle',
	defaultClassName:
		'mb-8 text-center text-body-md text-muted-foreground sm:text-body-lg md:text-body-xl',
})

export const Paragraph = createLayoutComponent({
	displayName: 'Paragraph',
	defaultClassName: 'mb-6 text-body-md sm:text-body-lg',
})

export const NavList = createLayoutComponent({
	displayName: 'NavList',
	defaultClassName: 'space-y-4',
	defaultTagName: 'ul',
})

export const navLinkDefaultClassName =
	'block w-full rounded-md bg-secondary p-4 text-center text-h5 text-secondary-foreground transition-colors hover:bg-secondary/90 sm:text-h4'
