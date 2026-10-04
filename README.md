# Philip Larweh website

A single-page static site built with [Astro](https://astro.build) 5. It has no backend, database or UI framework.

## Run locally
Requires Node 20.3+ (Astro 5 is used because this machine has Node 20).

```sh
npm install
npm run dev        # http://localhost:4321, live reload
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

The first build takes about 6 minutes because it encodes AVIF/WebP images. Later builds reuse the cache and take a few seconds.

## Launch checklist
1. Fill in the items in `docs/MISSING_FACTS.md`.
2. Set `"launch": true` in `src/data/site.json`.
3. Run `npm run build:prod`. It runs `check:launch` first and refuses to build if placeholders, unconfirmed materials or photos without permission remain.

While `launch` is `false`, the page shows a yellow "Preview build" banner, is marked `noindex`, and `robots.txt` disallows crawling.

## Deploy
Any static host works. Build command `npm run build:prod`, output directory `dist`.
- **Netlify / Cloudflare Pages / Vercel**: connect the repo, set the build command and output directory above, and Node version 20.
- Set `domain` in `site.json` (e.g. `"philiplarweh.com"`) before the production build so the canonical URL, sitemap and Open Graph URLs are correct.

## Editing content
All content lives in `src/data/`:

| File | What it controls |
|---|---|
| `site.json` | Name, headline, WhatsApp/phone, base location, service area, Jiji link, hours, social links, domain, About text, default WhatsApp messages, analytics |
| `services.json` | The four service cards (text, bullet points, photo, pre-filled WhatsApp message) |
| `gallery.json` | "Our Work" photos: file, category (`steel` / `formwork` / `carpentry`), alt text, caption, `featured` (first 12 shown), `people` / `permissionConfirmed` |
| `materials.json` | Materials for hire: `forHire` (true once confirmed), photos with `confirmed` flags |

- **WhatsApp**: `whatsapp` must be the international number without `+` (`233244439582`). Links use `https://wa.me/<number>?text=<message>`.
- **Phone**: `phone` is used for `tel:` links; `phoneDisplay` is the readable version.
- **Jiji**: leave `jijiUrl` empty to hide the link.
- The `[location]`-style brackets in WhatsApp messages are intentional prompts for the customer to fill in.

## Service, material, area and guide pages
Each inner page is a Markdown file in `src/content/pages/`. The folder path becomes the URL (`services/steel-bending.md` → `/services/steel-bending/`).

- The front matter at the top sets the page `kind`, menu `label`, `metaTitle` (keep under ~60 characters, main keyword first), `description` (~150 characters), headline, hero photo, extra photos, FAQs, `related` page ids and the pre-filled WhatsApp `message`.
- The body below the front matter is ordinary Markdown.
- **To add a page**, copy a similar file, change the front matter and text, and push. The footer, hub pages, sitemap and structured data update automatically.
- Only write what Philip has confirmed: no prices, years of experience or claims about specific clients or locations.

- Originals stay untouched in the two `WhatsApp Unknown…` folders.
- `scripts/copy-photos.mjs` lists which originals are used and their web names. Edit it and run `npm run photos` to copy them into `src/assets/photos/`. `docs/PHOTO_MAP.md` records the mapping.
- To add a photo: copy it into `src/assets/photos/` with a descriptive name, then add an entry to `gallery.json` (or `materials.json`) with truthful alt text. Astro generates resized AVIF/WebP/JPEG versions automatically.
- `docs/IMAGE_INVENTORY.md` is the full review of all 110 supplied files. Regenerate it with `npm run inventory`.

## Analytics (optional)
Click tracking for WhatsApp, Call and Jiji is built in. It records only the link type and where on the page it was clicked, never message content. It stays off until you set `analytics` in `site.json`:

```json
"analytics": { "provider": "plausible", "domain": "philiplarweh.com" }
```
or
```json
"analytics": { "provider": "goatcounter", "code": "philiplarweh" }
```
