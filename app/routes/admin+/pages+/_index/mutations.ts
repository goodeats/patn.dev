import { prisma } from '#app/utils/db.server'

// this assumes you have already validated:
// can't move first up
// can't move last down
export const updatePageOrder = async (
	pageId: string,
	direction: 'up' | 'down',
) => {
	// start a transaction
	return await prisma.$transaction(async prisma => {
		// get page
		const page = await prisma.page.findUnique({
			select: { id: true, name: true, order: true },
			where: { id: pageId },
		})
		if (!page) {
			throw new Error('Page not found')
		}

		// get other page
		const otherPage = await prisma.page.findFirst({
			select: { id: true, name: true, order: true },
			where: {
				order: direction === 'up' ? page.order - 1 : page.order + 1,
			},
		})
		if (!otherPage) {
			throw new Error('Other page not found')
		}

		// update page order
		await prisma.page.update({
			where: { id: pageId },
			data: { order: otherPage.order },
		})

		// update other page order
		await prisma.page.update({
			where: { id: otherPage.id },
			data: { order: page.order },
		})

		return { page, otherPage }
	})
}
