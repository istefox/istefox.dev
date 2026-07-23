// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://istefox.dev',
	integrations: [
		mdx(),
		sitemap({
			// The parked landing preview and the noindex pages (download, both Polar beta pages)
			// must not leak into the sitemap. '/agentwake/beta' also matches '/agentwake/beta/success'.
			filter: (page) =>
				!page.includes('/agentwake/preview') &&
				!page.includes('/agentwake/download') &&
				!page.includes('/agentwake/beta'),
		}),
	],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
