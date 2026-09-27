import { readFileSync } from 'node:fs';
import { launchIssues } from '../src/lib/launch-status.mjs';

const load = (f) => JSON.parse(readFileSync(new URL(`../src/data/${f}`, import.meta.url), 'utf8'));
const issues = launchIssues({ site: load('site.json'), gallery: load('gallery.json'), materials: load('materials.json') });

if (issues.length) {
  console.error(`\n✗ Not ready to launch — ${issues.length} item(s) to resolve:\n`);
  for (const i of issues) console.error(`  • ${i}`);
  console.error('\nEdit the files in src/data/ (see README), then run again.\n');
  process.exit(1);
}
console.log('✓ Launch checks passed.');
