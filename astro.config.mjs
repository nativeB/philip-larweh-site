import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import site from './src/data/site.json' with { type: 'json' };

// Canonical URL and sitemap are only produced once a real domain is set in site.json.
const domain = site.domain ? `https://${site.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : undefined;

export default defineConfig({
  site: domain,
  integrations: domain ? [sitemap()] : [],
  image: { layout: 'constrained' },
});
