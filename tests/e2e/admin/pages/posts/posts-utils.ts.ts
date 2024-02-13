import { faker } from '@faker-js/faker'
import { type Page } from '@playwright/test'
import { type Post } from '@prisma/client'
import { prisma } from '#app/utils/db.server'
import { stringToSlug } from '#app/utils/misc'
import {
	expectHeading,
	expectNoUniqueText,
	expectUniqueText,
} from '#tests/page-utils'

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

export const expectPageContentForPost = async (
	page: Page,
	post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>,
	published: boolean,
) => {
	await expectHeading(page, post.title)
	await expectUniqueText(page, post.description)
	await expectUniqueText(page, post.content)

	// all post tests were updated just a minute ago
	// modify if you want to test for a different time
	await expectUniqueText(page, 'Updated: less than a minute ago')

	if (published) {
		await expectUniqueText(page, 'Published')
		await expectUniqueText(page, 'Published: less than a minute ago')
	} else {
		await expectUniqueText(page, 'Not Published')
		await expectNoUniqueText(page, 'Published: less than a minute ago')
	}
}
