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
	},
	{
		name: 'Projects',
		description: 'A list of projects I have worked on.',
		slug: 'projects',
		published: true,
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
	},
	{
		name: 'Contact',
		description: 'Get in touch with me.',
		slug: 'contact',
		published: true,
	},
]
