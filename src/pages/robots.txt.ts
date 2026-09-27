import type { APIRoute } from 'astro';
import site from '../data/site.json';

export const GET: APIRoute = ({ site: base }) => {
  const lines = site.launch ? ['User-agent: *', 'Allow: /'] : ['User-agent: *', 'Disallow: /'];
  if (site.launch && base) lines.push('', `Sitemap: ${new URL('sitemap-index.xml', base).href}`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain' } });
};
