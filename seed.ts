import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer';
import { createClient } from '@supabase/supabase-js';
import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';
import 'dotenv/config';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
);

const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 512,
	chunkOverlap: 100,
});

/**
 * Fetch XML and parse URLs
 */
const fetchXML = async (url: string): Promise<string> => {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch ${url}`);
	return await res.text();
};

/**
 * Extract URLs from sitemap XML
 */
const extractUrlsFromSitemap = (xml: string): string[] => {
	const urls: string[] = [];
	const matches = xml.match(/<loc>(.*?)<\/loc>/g);

	if (!matches) return urls;

	for (const match of matches) {
		const url = match.replace('<loc>', '').replace('</loc>', '').trim();
		urls.push(url);
	}

	return urls;
};

/**
 * Recursively resolve sitemap (handles sitemap index)
 */
const getAllUrlsFromSitemap = async (sitemapUrl: string): Promise<string[]> => {
	const xml = await fetchXML(sitemapUrl);
	const urls = extractUrlsFromSitemap(xml);

	const allUrls: string[] = [];

	for (const url of urls) {
		if (url.endsWith('.xml')) {
			// Nested sitemap
			const nestedUrls = await getAllUrlsFromSitemap(url);
			allUrls.push(...nestedUrls);
		} else {
			allUrls.push(url);
		}
	}

	return allUrls;
};

/**
 * Optional: filter only HTML pages
 */
const filterValidPages = (urls: string[]) => {
	return urls.filter((url) => {
		return (
			url.startsWith('https://www.prosek.com') &&
			!url.match(/\.(pdf|jpg|jpeg|png|gif|svg|webp|zip)$/i)
		);
	});
};

/**
 * Scrape page
 */
const scrapePage = async (url: string): Promise<string> => {
	const loader = new PuppeteerWebBaseLoader(url, {
		launchOptions: {
			headless: true,
		},
		gotoOptions: {
			waitUntil: 'domcontentloaded',
		},
		evaluate: async (page, browser) => {
			const result = await page.evaluate(() => document.body.innerText);
			await browser.close();
			return result;
		},
	});

	return await loader.scrape();
};

/**
 * Main ingestion
 */
const loadData = async (webpages: string[]) => {
	for await (const url of webpages) {
		try {
			console.log(`Scraping: ${url}`);

			const content = await scrapePage(url);
			const chunks = await splitter.splitText(content);

			for await (const chunk of chunks) {
				const { embedding } = await embed({
					model: openai.embedding('text-embedding-3-small'),
					value: chunk,
				});

				const { error } = await supabase.from('chunks').insert({
					content: chunk,
					vector: embedding,
					url: url,
				});

				if (error) {
					console.error('Insert error:', error);
				}
			}
		} catch (err) {
			console.error(`Failed on ${url}`, err);
		}
	}
};

/**
 * Run everything
 */
const run = async () => {
	const sitemapUrls = [
		'https://www.prosek.com/page-sitemap.xml',
		'https://www.prosek.com/case-studies-sitemap.xml',
		'https://www.prosek.com/career-sitemap.xml',
		'https://www.prosek.com/prophecy-work-sitemap.xml',
		'https://www.prosek.com/our-people-sitemap.xml',
		'https://www.prosek.com/todays-prophecy-sitemap.xml',
		'https://www.prosek.com/next_up-sitemap.xml',
		'https://www.prosek.com/post-sitemap.xml',
		// add more if needed
	];

	console.log('Fetching sitemaps...');

	let urls = [];

	for (const sitemapUrl of sitemapUrls) {
		const extracted = await getAllUrlsFromSitemap(sitemapUrl);
		urls.push(...extracted);
	}

	// Remove duplicates
	urls = [...new Set(urls)];

	// Filter unwanted files
	urls = filterValidPages(urls);

	console.log(`Total pages to scrape: ${urls.length}`);

	await loadData(urls);
};

run();
