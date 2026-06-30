// Single source of truth for the projects shown on the home page (featured subset)
// and the /projects page (full list). Keep `url` null for projects without a public link.

export interface Project {
	name: string;
	description: string;
	url: string | null;
	featured: boolean;
}

export const projects: Project[] = [
	{
		name: 'vibiso',
		description:
			'Motore di calcolo deterministico per il dimensionamento di isolatori antivibranti (1/3/6 gradi di libertà, trasmissibilità, transitori).',
		url: null,
		featured: true,
	},
	{
		name: 'MCP Connector',
		description:
			'Plugin Obsidian: integrazioni come ricerca semantica e prompt Templater per Claude e client MCP.',
		url: 'https://github.com/istefox/obsidian-mcp-connector',
		featured: true,
	},
	{
		name: 'CleanKey',
		description: 'Piccola app desktop per macOS (Swift).',
		url: 'https://github.com/istefox/CleanKey',
		featured: true,
	},
	{
		name: 'Ondum',
		description:
			'App di self-support per chi convive con il DOC (disturbo ossessivo-compulsivo).',
		url: 'https://ondum.app',
		featured: true,
	},
	{
		name: 'Bookmarker',
		description:
			'Plugin Obsidian: salva URL come bookmark Markdown nel vault, con preview og:image e tag/cartella proposti via AI.',
		url: 'https://github.com/istefox/obsidian-bookmarker',
		featured: false,
	},
	{
		name: 'Postbox',
		description: 'Plugin menu bar per creare e appendere note Markdown in Obsidian.',
		url: 'https://github.com/istefox/Postbox',
		featured: false,
	},
	{
		name: 'istefox.dev',
		description:
			'Questo sito. Astro e Cloudflare Pages: blog e portfolio in un posto solo.',
		url: 'https://istefox.dev',
		featured: false,
	},
];

export const featuredProjects: Project[] = projects.filter((p) => p.featured);
