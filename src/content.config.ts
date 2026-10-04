import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per page in src/content/pages. The path becomes the URL:
// src/content/pages/services/steel-bending.md → /services/steel-bending/
const photo = z.object({ file: z.string(), alt: z.string(), caption: z.string().optional() });

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    kind: z.enum(['service', 'material', 'materials-hub', 'area', 'areas-hub', 'guide']),
    /** Short name used in menus, footer and breadcrumbs. */
    label: z.string(),
    /** <title> tag: keep under ~60 characters, main keyword first. */
    metaTitle: z.string(),
    /** Meta description: ~150 characters, says what and where. */
    description: z.string(),
    eyebrow: z.string(),
    h1: z.string(),
    lede: z.string(),
    hero: photo,
    photos: z.array(photo).default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    /** Page ids to link to, e.g. "materials/plywood". */
    related: z.array(z.string()).default([]),
    /** Pre-filled WhatsApp message for this page. */
    message: z.string(),
    /** For area pages: the place name used in structured data. */
    place: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { pages };
