import { z } from 'zod'

const PostSchema = {
	pageId: z.string(),
	title: z
		.string({
			required_error: 'Title Required',
		})
		.min(1)
		.max(50)
		.transform(val => val.trim()),
	description: z
		.string({
			required_error: 'Description Required',
		})
		.min(1)
		.max(10000)
		.transform(val => val.trim()),
	content: z
		.string({
			required_error: 'Content Required',
		})
		.min(1)
		.max(100000)
		.transform(val => val.trim()),
	published: z.boolean().optional(),
}

export const NewPostSchema = z.object(PostSchema)

export const EditPostSchema = z.object({
	id: z.string(),
	...PostSchema,
})

export const DeletePostSchema = z.object({
	id: z.string(),
})
