import { prisma } from '#app/utils/db.server'

export const deletePage = async (pageId: string) => {
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

		// get total page count
		const pageCount = await prisma.page.count()

		// delete page
		await prisma.page.delete({
			where: { id: pageId },
		})

		// if last page, return
		if (page.order === pageCount - 1) {
			return { page }
		}

		// get other pages with higher order
		const pages = await prisma.page.findMany({
			select: { id: true, name: true, order: true },
			where: {
				order: { gt: page.order },
			},
		})

		// update order for other pages
		for (const otherPage of pages) {
			await prisma.page.update({
				where: { id: otherPage.id },
				data: { order: otherPage.order - 1 },
			})
		}

		return { page }
	})
}
