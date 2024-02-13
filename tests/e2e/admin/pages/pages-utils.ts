import { faker } from '@faker-js/faker'
import { type Page } from '@prisma/client'
import { prisma } from '#app/utils/db.server'
import { stringToSlug } from '#app/utils/misc'

export const createPage = () => {
	const name = faker.lorem.words(1)
	return {
		name,
		description: faker.lorem.paragraphs(3),
		slug: stringToSlug(name),
		published: false as boolean,
	} satisfies Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'order'>
}

export const insertPage = async ({
	overrides,
}: {
	overrides?: Partial<
		Pick<Page, 'name' | 'description' | 'slug' | 'published' | 'order'>
	>
}) => {
	return await prisma.page.create({
		data: { ...createPage(), ...overrides },
	})
}

export const insertPages = async (count: number) => {
	const insertedPages = []
	for (let i = 0; i < count; i++) {
		insertedPages.push(
			await insertPage({ overrides: { published: true, order: i } }),
		)
	}
	return insertedPages
}

export const createPages = [
	{
		name: 'Home',
		description: 'Landing page for the website.',
		slug: 'home',
		published: true,
		posts: {
			create: [
				{
					title: 'Welcome to my website!',
					slug: 'welcome-to-my-website',
					description: 'This is the first post on my website.',
					content: 'This is the first post on my website.',
				},
			],
		},
	},
	{
		name: 'Projects',
		description: 'A list of projects I have worked on.',
		slug: 'projects',
		published: true,
		posts: {
			create: [
				{
					title: 'Project XYZ',
					slug: 'project-xyz',
					description: 'This is the first project.',
					content: 'This is the first project.',
				},
			],
		},
	},
	{
		name: 'Blog',
		description: 'A collection of my thoughts and experiences.',
		slug: 'blog',
		published: true,
	},
	{
		name: 'About',
		description: 'A little bit about me.',
		slug: 'about',
		published: true,
		posts: {
			create: [
				{
					title: 'About Me',
					slug: 'about-me',
					description: 'This is the first post about me.',
					content: 'This is the first post about me.',
					published: true,
					publishedAt: new Date(),
				},
			],
		},
	},
	{
		name: 'Contact',
		description: 'Get in touch with me.',
		slug: 'contact',
		published: true,
		posts: {
			create: [
				{
					title: 'Contact Me',
					slug: 'contact-me',
					description: 'This is the first post about contacting me.',
					content: 'This is the first post about contacting me.',
					published: true,
					publishedAt: new Date(),
				},
			],
		},
	},
]
