// Copies selected original WhatsApp photos into src/assets/photos with descriptive names.
// Originals are never modified. Re-run with `npm run photos` after changing the list.
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const F1 = 'WhatsApp Unknown 2026-09-27 at 16.48.28/WhatsApp Image 2026-09-27 at ';
const F2 = 'WhatsApp Unknown 2026-09-27 at 16.49.09/WhatsApp Image 2026-09-06 at 05.53.';

export const PHOTOS = {
  // Work
  'slab-rebar-film-faced-deck.jpg': F2 + '22 (1).jpeg',
  'beam-formwork-bamboo-props.jpg': F2 + '23.jpeg',
  'staircase-formwork-rebar.jpg': F2 + '20 (4).jpeg',
  'beam-slab-rebar-worker.jpg': F2 + '27.jpeg',
  'tying-beam-cage.jpg': F2 + '27 (2).jpeg',
  'slab-mesh-film-faced-deck.jpg': F2 + '21 (1).jpeg',
  'multistorey-slab-mesh.jpg': F2 + '29 (4).jpeg',
  'team-on-slab-rebar.jpg': F2 + '28.jpeg',
  'upper-floor-slab-deck.jpg': F2 + '22 (4).jpeg',
  'slab-rebar-plywood-deck.jpg': F2 + '31.jpeg',
  'ramp-rebar-block-pit.jpg': F2 + '30 (2).jpeg',
  'single-storey-slab-formwork.jpg': F2 + '18 (4).jpeg',
  'roof-level-beam-formwork.jpg': F2 + '17.jpeg',
  'worker-on-beam-formwork.jpg': F2 + '17 (3).jpeg',
  'fixing-formwork-timbers.jpg': F2 + '18 (3).jpeg',
  'column-cage-rooftop.jpg': F2 + '20 (2).jpeg',
  // Materials
  'film-faced-plywood-stack.jpg': F2 + '18.jpeg',
  'film-faced-plywood-marineplex.jpg': F2 + '17 (4).jpeg',
  'film-faced-plywood-maisahplex.jpg': F2 + '16.jpeg',
  'red-plywood-stack.jpg': F1 + '16.00.06 (1).jpeg',
  'timber-battens.jpg': F2 + '20.jpeg',
  'rough-sawn-boards.jpg': F2 + '19.jpeg',
  'bamboo-poles.jpg': F2 + '20 (1).jpeg',
  'loading-boards-truck.jpg': F2 + '17 (2).jpeg',
  'green-film-faced-plywood.jpg': F2 + '18 (1).jpeg',
  'plastic-column-moulds.jpg': F2 + '18 (2).jpeg',
  // More multi-storey jobs (confirmed as separate projects of his own)
  'slab-mesh-conduits-upper-floor.jpg': F2 + '26 (4).jpeg',
  'slab-mesh-beam-cages-rooftops.jpg': F2 + '28 (3).jpeg',
};

// Crops applied when copying (pixels of the original). Removes a finger blur from the column-mould photo.
const CROPS = {
  'plastic-column-moulds.jpg': { left: 0, top: 300, width: 720, height: 980 },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) await copyAll();

async function copyAll() {
const out = 'src/assets/photos';
mkdirSync(out, { recursive: true });
const lines = ['| Web file | Original |', '|---|---|'];
for (const [name, src] of Object.entries(PHOTOS)) {
  const crop = CROPS[name];
  if (crop) await sharp(src).extract(crop).jpeg({ quality: 92 }).toFile(join(out, name));
  else copyFileSync(src, join(out, name));
  lines.push(`| ${name} | ${src}${crop ? ' (cropped)' : ''} |`);
}
writeFileSync('docs/PHOTO_MAP.md', '# Web photo → original file\n\n' + lines.join('\n') + '\n');
console.log(`Copied ${Object.keys(PHOTOS).length} photos.`);
}
