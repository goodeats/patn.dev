import { faker } from '@faker-js/faker'
import { type Page } from '@prisma/client'
import { stringToSlug } from '#app/utils/misc'

export const createPage = () => {
	const name = faker.lorem.words(1)
	return {
		name,
		description: faker.lorem.paragraphs(3),
		slug: stringToSlug(name),
		published: true,
	} satisfies Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'order'>
}
