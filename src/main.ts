// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, log } from 'crawlee'

import { router } from './routes.js'

const startUrls = [
	'https://www.magicbricks.com/flats-in-hyderabad-for-sale-pppfs',
]

const crawler = new PuppeteerCrawler({
	// proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
	requestHandler: router,
	// Comment this option to scrape the full website.
	maxRequestsPerCrawl: 20,
	// headless: false,
})

await crawler.run(startUrls)
