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
		published: false,
	} satisfies Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'order'>
}

export const insertPage = async ({
	overrides,
}: {
	overrides?: Partial<Pick<Page, 'name' | 'description' | 'slug' | 'published'>>
}) => {
	return await prisma.page.create({
		data: { ...createPage(), ...overrides },
	})
}
