import { getCollection, type CollectionEntry } from 'astro:content';

export type Page = CollectionEntry<'pages'>;
export const pageUrl = (id: string) => `/${id.replace(/\/index$/, '')}/`.replace(/\/+/g, '/');

export async function pagesByKind(kind: Page['data']['kind']) {
  return (await getCollection('pages', (p) => p.data.kind === kind)).sort((a, b) => a.data.order - b.data.order);
}
