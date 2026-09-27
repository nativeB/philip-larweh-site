// Regenerates docs/IMAGE_INVENTORY.md from the review notes below plus file hashes (exact duplicates detected automatically).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PHOTOS } from './copy-photos.mjs';

const D1 = 'WhatsApp Unknown 2026-09-27 at 16.48.28', D2 = 'WhatsApp Unknown 2026-09-27 at 16.49.09';
// key = short id; [category, description, quality, role, notes/questions]
const R = {
  '16': ['Hire materials', 'Stack of dark film-faced plywood (Maisahplex branding) in a dim store', 'Fair (dark)', 'Rental (spare)', 'Confirm his stock'],
  '16 (1)': ['Hire materials', 'Weathered red/brown plywood sheets on the ground', 'Fair', 'Omit', 'Used boards; confirm stock'],
  '17': ['Formwork/decking', 'Roof-level beam boxes and joists on bamboo props, block house, water tank', 'Good', 'Service card (carpentry)', ''],
  '17 (1)': ['Formwork/decking', 'Same site as 17; worker on joists, feet cropped at top', 'Fair (awkward crop)', 'Omit', 'Same job as 17'],
  '17 (2)': ['Hire materials', 'Two men loading a stack of film-faced boards onto a truck', 'Good', 'Rental (if permitted)', 'Identifiable people incl. a young person; delivery confirmed'],
  '17 (3)': ['Carpentry/formwork', 'Man seated on joists over beam formwork, bamboo props', 'Good', 'Gallery / About candidate', 'Is this Philip? permission'],
  '17 (4)': ['Hire materials', 'Marineplex film-faced boards standing in a store room (audio equipment visible)', 'Fair', 'Rental', 'Confirm his stock'],
  '18': ['Hire materials', 'Neat stack of dark film-faced boards on concrete floor', 'Good', 'Rental / service card', 'Confirm his stock'],
  '18 (1)': ['Hire materials', 'Green "Royalplex" film-faced boards in a factory/warehouse', 'Good', 'Rental → `green-film-faced-plywood.jpg`', 'Confirmed: he can supply these (photo may be a supplier image)'],
  '18 (2)': ['Unclear', 'Round concrete column beside stacked plastic column moulds; finger blur top right', 'Fair', 'Rental (cropped) → `plastic-column-moulds.jpg`', 'Confirmed: for hire and sale'],
  '18 (3)': ['Carpentry', 'Worker fixing formwork timbers at building edge (tilted shot)', 'OK', 'Gallery (extra)', 'Identifiable person; is it Philip?'],
  '18 (4)': ['Formwork/decking', 'Multi-bay slab formwork on bamboo props, single storey, IBC tanks', 'Good', 'Gallery / About', ''],
  '18 (5)': ['Hire materials', 'Sawn hardwood boards stacked against a wall', 'Fair', 'Omit', 'Name / for hire?'],
  '19': ['Hire materials', 'Stack of wide rough-sawn boards against block wall', 'Good', 'Rental', 'Confirmed: wawa boards'],
  '19 (1)': ['Hire materials', 'Stack of used red and film-faced plywood', 'Fair', 'Omit', 'Worn; confirm stock'],
  '19 (2)': ['Hire materials', 'Stack of used rough-sawn boards', 'Fair', 'Omit', 'Similar to 19'],
  '19 (3)': ['Hire materials', 'Stack of used plywood, close view', 'Fair', 'Omit', 'Similar to 19 (1)'],
  '19 (4)': ['Hire materials', 'Pile of used timber battens/offcuts in shade', 'Fair', 'Omit', 'Wawa 2/4?'],
  '20': ['Hire materials', 'Pile of sawn timber battens against block wall', 'Good', 'Rental', 'Confirmed: wawa 2/4'],
  '20 (1)': ['Hire materials', 'Heap of bamboo poles on open ground', 'Good', 'Rental', 'Confirmed: for hire'],
  '20 (2)': ['Steel bending', 'Two men with column/beam cages on a rooftop, city view', 'OK', 'Gallery (extra)', 'Identifiable people; which is Philip?'],
  '20 (3)': ['Team/portrait', 'Close-up of the same two men tying a cage', 'OK (soft)', 'About candidate', 'Identifiable people; permission'],
  '20 (4)': ['Formwork + steel', 'Staircase formwork with tied reinforcement', 'Very good', 'Service card / gallery', ''],
  '20 (5)': ['Steel + decking', 'Slab mesh, beam over timber, green-roof house (low-res)', 'Fair', 'Omit', 'Near-dup of 29 (1)'],
  '21': ['Steel + decking', 'Slab mesh, tall tower in background (low-res)', 'Fair', 'Omit', 'Near-dup of 29 (4)'],
  '21 (1)': ['Steel + decking', 'Slab mesh over film-faced deck, strong sun', 'Good', 'Gallery', ''],
  '21 (2)': ['Steel + decking', 'Slab mesh, car park with buses below (low-res)', 'Fair', 'Omit', 'Near-dup of 29 (3)'],
  '21 (3)': ['Steel + decking', 'Slab mesh, blue-roof building (low-res)', 'Fair', 'Omit', 'Near-dup of 28 (3)'],
  '21 (4)': ['Steel + decking', 'Slab mesh with timber strip, cars below (low-res)', 'Fair', 'Omit', 'Near-dup of 26 (3); number plates'],
  '22': ['Steel + decking', 'Slab mesh, rooftops (low-res)', 'Fair', 'Omit', 'Near-dup of 29 (2)'],
  '22 (1)': ['Steel + decking', 'Large slab mesh and beam cages over branded film-faced deck', 'Good', 'Hero (desktop) / gallery', ''],
  '22 (2)': ['Steel + decking', 'Tower-view slab with beam cages (low-res)', 'Fair', 'Omit', 'Near-dup of 27 (3)'],
  '22 (3)': ['Steel + decking', 'Slab bars on plywood deck, photographer legs in frame (low-res)', 'Fair', 'Omit', 'Near-dup of 31 (1)'],
  '22 (4)': ['Formwork/decking', 'Upper-floor deck with polythene, beam cages, formwork beyond', 'Good', 'Gallery', ''],
  '23': ['Formwork/decking', 'Beam formwork on dense bamboo props with beam cages, town view', 'Very good', 'Hero (mobile) / gallery', ''],
  '23 (1)': ['Steel + decking', 'Slab mesh, colourful buildings (low-res)', 'Fair', 'Omit', 'Near-dup of 28 (2)'],
  '23 (2)': ['Steel + decking', 'Slab bars on plywood deck by a road (low-res)', 'Fair', 'Omit', 'Near-dup of 31'],
  '23 (3)': ['Unclear', 'Hi-vis workers tying a column cage on metal scaffold', 'Good', 'Omit', 'Appears to be an internet image, not his work'],
  '23 (4)': ['Unclear', 'Slab reinforcement, social-media compression', 'Fair', 'Omit', 'Probably an internet image'],
  '24': ['Unclear', 'Tall beam cage with metal props and hi-vis workers (very low-res)', 'Poor', 'Omit', 'Appears to be an internet image'],
  '24 (1)': ['Unclear', 'Staircase reinforcement over red formwork', 'Fair', 'Omit', 'Appears to be an internet image'],
  '24 (2)': ['Unclear', 'Staircase reinforcement, blue-edged formwork, brick wall', 'Good', 'Omit', 'Appears to be an internet image'],
  '24 (3)': ['Unclear', 'Footing pit with column starter cage', 'Good', 'Omit', 'Appears to be an internet image'],
  '24 (4)': ['Unclear', 'Waffle/rib slab with clay blocks', 'Good', 'Omit', 'Appears to be an internet image'],
  '24 (5)': ['Unclear', 'Staircase cages on red formwork', 'Good', 'Omit', 'Appears to be an internet image (AI-enhanced)'],
  '25': ['Unclear', 'Staircase reinforcement, brick wall', 'Good', 'Omit', 'Watermark "Discoveries Engineering"'],
  '25 (1)': ['Unclear', 'Strip footing reinforcement corner in trench', 'Good', 'Omit', 'Appears to be an internet image'],
  '25 (2)': ['Steel + decking', 'Slab beams over polythene, crane and buildings behind', 'Good', 'Spare', 'Which project?'],
  '25 (3)': ['Unclear', 'Yellow-coated column and footing cages in red soil', 'Good', 'Omit', 'Appears to be an internet image (AI-enhanced)'],
  '25 (4)': ['Unclear', 'Slab reinforcement (compressed)', 'Fair', 'Omit', 'Probably an internet image'],
  '26': ['Unclear', 'Close-up of beam reinforcement in formwork', 'Good', 'Omit', 'Appears to be an internet image'],
  '26 (1)': ['Unclear', 'Foreign site: column cages in footing, hi-vis crew, plant', 'Good', 'Omit', 'Stock/AI image, not his work'],
  '26 (2)': ['Steel + decking', 'Slab mesh over "Bestply" film-faced deck', 'OK', 'Spare', 'His job?'],
  '26 (3)': ['Steel + decking', 'Slab mesh with timber strip, cars below', 'Good', 'Omit', 'Number plates; same shot as 21 (4)'],
  '26 (4)': ['Steel + decking', 'Slab mesh with conduits, tower and telecom mast', 'Good', 'Gallery (extra)', ''],
  '27': ['Steel bending', 'Beam and slab reinforcement over lined deck, worker arm, props below', 'Good', 'Gallery (extra)', ''],
  '27 (1)': ['Steel + decking', 'Slab mesh overlooking fuel station and car park', 'Good', 'Omit', 'Business signage and number plates in view'],
  '27 (2)': ['Steel bending', 'Two workers tying a beam cage on a slab, column starters', 'Good', 'Gallery', 'Identifiable people; permission'],
  '27 (3)': ['Steel + decking', 'Tower-view slab with beam cages', 'Good', 'Omit (repetition)', 'Tower series'],
  '27 (4)': ['Steel + decking', 'Slab mesh with conduits, telecom mast', 'Good', 'Omit', 'Near-dup of 26 (4)'],
  '27 (5)': ['Steel + decking', 'Slab mesh, rooftops', 'Good', 'Omit (repetition)', 'Tower series'],
  '28': ['Team on site', 'Four men on slab rebar above beam formwork, tower behind', 'Good', 'Gallery', 'Identifiable people; which is Philip?'],
  '28 (1)': ['Team on site', 'Workers on slab rebar, beam formwork below', 'Good', 'Omit (similar to 28)', 'Identifiable people'],
  '28 (2)': ['Steel + decking', 'Slab mesh, colourful buildings', 'Good', 'Omit (repetition)', 'Tower series'],
  '28 (3)': ['Steel + decking', 'Slab mesh, blue-roof building, road', 'Good', 'Gallery (extra)', ''],
  '28 (4)': ['Steel + decking', 'Slab mesh with conduits, tower', 'Good', 'Omit', 'Near-dup of 26 (4)'],
  '29': ['Steel + decking', 'Slab mesh under cloudy sky, tilted', 'OK', 'Omit (repetition)', ''],
  '29 (1)': ['Steel + decking', 'Slab mesh, beam over timber, green-roof house', 'Good', 'Omit (repetition)', ''],
  '29 (2)': ['Steel + decking', 'Slab mesh, rooftops and palms', 'Good', 'Omit (repetition)', ''],
  '29 (3)': ['Steel + decking', 'Slab mesh, car park with buses below', 'Good', 'Omit (repetition)', 'Number plates distant'],
  '29 (4)': ['Steel + decking', 'Slab mesh, tall tower in background', 'Good', 'Gallery (extra)', 'Tower series pick'],
  '30': ['Formwork/decking', 'Same scene as 22 (4)', 'Good', 'Omit', 'Near-dup of 22 (4)'],
  '30 (1)': ['Steel + decking', 'Slab mesh, tower, distant worker', 'Good', 'Omit (repetition)', ''],
  '30 (2)': ['Steel bending', 'Reinforcement for sloping slab into block-walled pit', 'Good', 'Gallery', ''],
  '30 (3)': ['Steel + decking', 'Tower-view slab, bucket, cloudy, tilted', 'OK', 'Omit (repetition)', ''],
  '30 (4)': ['Formwork/decking', 'Same scene as 23', 'Very good', 'Omit', 'Near-dup of 23'],
  '30 (5)': ['Unclear', 'Deep beam cages over tube scaffolding', 'Good', 'Omit', 'Watermark "Discoveries Engineering"'],
  '31': ['Steel + decking', 'Slab bars and chairs on plywood deck by a busy road', 'Good', 'Gallery', ''],
  '31 (1)': ['Steel + decking', 'Slab bars on plywood deck, photographer legs in frame', 'Good', 'Omit', 'Similar to 31'],
  '31 (2)': ['Unclear', 'Curved foundation reinforcement in red-earth trench', 'Fair', 'Omit', 'Probably an internet image'],
  '31 (3)': ['Unclear', 'Strip footing reinforcement on gravel', 'Good', 'Omit', 'Appears to be an internet image (AI-enhanced)'],
  '31 (4)': ['Unclear', 'Footing pit with starter bars', 'Good', 'Omit', 'Watermark "Construction pointer"'],
  '32': ['Team on site', 'Workers on slab rebar (low-res)', 'Fair', 'Omit', 'Near-dup of 28 (1)'],
  '32 (1)': ['Unclear', 'Column and ground-beam cages at footing', 'Good', 'Omit', 'Appears to be an internet image'],
  '32 (2)': ['Steel + decking', 'Slab mesh with conduits (low-res)', 'Fair', 'Omit', 'Near-dup of 26 (4)'],
  '32 (3)': ['Unclear', 'Footing pit with column cage and mesh', 'Good', 'Omit', 'Appears to be an internet image (AI-enhanced)'],
  '32 (4)': ['Steel + decking', 'Slab mesh overlooking fuel station (low-res)', 'Fair', 'Omit', 'Near-dup of 27 (1)'],
  '33': ['Steel bending', 'Sloping slab reinforcement into pit (low-res)', 'Fair', 'Omit', 'Near-dup of 30 (2)'],
  '33 (1)': ['Steel + decking', 'Slab mesh with conduits (low-res)', 'Fair', 'Omit', 'Near-dup of 26 (4)'],
  '33 (2)': ['Steel + decking', 'Slab mesh, rooftops (low-res)', 'Fair', 'Omit', 'Near-dup of 27 (5)'],
  '33 (3)': ['Unclear', 'Stair formwork with reinforcement indoors, foreign setting', 'Good', 'Omit', 'Appears to be an internet image'],
  'F1 16.00.06 (1)': ['Hire materials', 'New stack of red-faced plywood boards', 'Good', 'Rental', 'Confirm his stock'],
  'F1 16.00.12': ['Hire materials', 'Rough timber board with painted red mark', 'OK', 'Omit', 'Is the mark an ownership mark?'],
};
const hash = (f) => createHash('md5').update(readFileSync(f)).digest('hex');
const byHash = {};
const rows = [];
for (const [dir, prefix, tag] of [[D2, 'WhatsApp Image 2026-09-06 at 05.53.', ''], [D1, 'WhatsApp Image 2026-09-27 at ', 'F1 ']]) {
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.jpeg')).sort()) {
    const path = `${dir}/${f}`, h = hash(path);
    const id = tag + f.replace(prefix, '').replace('.jpeg', '');
    if (byHash[h]) { rows.push([path, '—', `Exact duplicate of ${byHash[h]}`, '—', 'Omit (duplicate)', '']); continue; }
    byHash[h] = id;
    const r = R[id];
    if (!r) throw new Error(`No review note for ${id}`);
    const web = Object.entries(PHOTOS).find(([, src]) => src === path)?.[0];
    rows.push([path, r[0], r[1], r[2], r[3] + (web ? ` → \`${web}\`` : ''), r[4]]);
  }
}
const md = `# Image inventory

${rows.length} files reviewed (${Object.keys(byHash).length} unique). Short IDs in notes refer to the \`05.53.xx (n)\` suffix in folder 2, or "F1" + time for folder 1.
Philip took most of these photos on his own jobs; the multi-storey slab photos come from several projects. He does not appear in any photo. Images flagged as internet/watermarked are still excluded.

| Original file | Category | Description | Quality | Role → web file | Questions / flags |
|---|---|---|---|---|---|
${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}
`;
writeFileSync('docs/IMAGE_INVENTORY.md', md);
console.log(`Wrote ${rows.length} rows.`);
