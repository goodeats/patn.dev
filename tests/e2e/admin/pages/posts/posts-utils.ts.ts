import { faker } from '@faker-js/faker'
import { type Post } from '@prisma/client'
import { prisma } from '#app/utils/db.server'
import { stringToSlug } from '#app/utils/misc'

export const createPost = ({ pageId }: { pageId: string }) => {
	const title = faker.lorem.words(3)
	return {
		title,
		description: faker.lorem.paragraphs(1),
		content: faker.lorem.paragraphs(3),
		slug: stringToSlug(title),
		published: false as boolean,
		publishedAt: new Date(),
		pageId,
	} satisfies Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
}

export const insertPost = async ({
	pageId,
	overrides,
}: {
	pageId: string
	overrides?: Partial<
		Pick<Post, 'title' | 'description' | 'content' | 'slug' | 'published'>
	>
}) => {
	return await prisma.post.create({
		data: { ...createPost({ pageId }), ...overrides },
	})
}
