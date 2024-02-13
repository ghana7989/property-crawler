import { createPuppeteerRouter } from 'crawlee'
import fs from 'fs'
import { json2csv } from 'json-2-csv'

export const router = createPuppeteerRouter()

router.addDefaultHandler(async ({ parseWithCheerio, pushData, request }) => {
	const $ = await parseWithCheerio()
	const properties: {
		title: string
		description: string
		price: string
		pricePerSqFeet: string
		summary: {
			area: string
			status: string
			floor: string
			transaction: string
			furnishing: string
			facing: string
		}
	}[] = []
	const cards = $('.mb-srp__card')

	cards.each((index, card) => {
		const title = $(card).find('.mb-srp__card--title').text().trim()
		const price = $(card).find('.mb-srp__card__price--amount').text().trim()
		const description = $(card).find('.mb-srp__card--desc--text').text().trim()
		const pricePerSqFeet = $(card)
			.find('.mb-srp__card__price--size')
			.text()
			.trim()
		const summary = {
			area: $(card).find('.mb-srp__card__summary--value').eq(0).text().trim(),
			status: $(card).find('.mb-srp__card__summary--value').eq(1).text().trim(),
			floor: $(card).find('.mb-srp__card__summary--value').eq(2).text().trim(),
			transaction: $(card)
				.find('.mb-srp__card__summary--value')
				.eq(3)
				.text()
				.trim(),
			furnishing: $(card)
				.find('.mb-srp__card__summary--value')
				.eq(4)
				.text()
				.trim(),
			facing: $(card).find('.mb-srp__card__summary--value').eq(5).text().trim(),
		}
		properties.push({
			description,
			title,
			price,
			pricePerSqFeet,
			summary,
		})
	})
	const csv = json2csv(properties, {
		emptyFieldValue: '',
		checkSchemaDifferences: false,
	})
	fs.writeFileSync('output.csv', csv)
	await pushData({
		url: request.loadedUrl,
		properties,
	})
})
