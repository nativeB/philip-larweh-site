// Shared by the preview banner and `npm run check:launch`.
// Returns a list of human-readable problems that must be fixed before launch.
const EXPECTED_WA = '233244439582';
const EXPECTED_TEL = '+233244439582';
const PLACEHOLDER = /\b(TODO|TBC|PLACEHOLDER|XXX)\b|\[[a-z /]+\]/i;

export function launchIssues({ site, gallery, materials }) {
  const issues = [];
  if (site.whatsapp !== EXPECTED_WA) issues.push(`WhatsApp number is "${site.whatsapp}", expected ${EXPECTED_WA}`);
  if (site.phone !== EXPECTED_TEL) issues.push(`Phone number is "${site.phone}", expected ${EXPECTED_TEL}`);
  if (!site.jijiUrl) issues.push('Jiji profile/listing URL not added yet');
  else if (!/^https:\/\/(www\.)?jiji\.com\.gh\//.test(site.jijiUrl)) issues.push(`Jiji URL doesn't look like jiji.com.gh: ${site.jijiUrl}`);
  if (!site.domain) issues.push('Domain not set (needed for canonical URL, sitemap and absolute Open Graph image)');
  if (!site.about.confirmed) issues.push('About text not yet approved by Philip');
  for (const [k, v] of Object.entries(site)) {
    if (typeof v === 'string' && k !== 'whatsappMessages' && PLACEHOLDER.test(v)) issues.push(`site.${k} contains a placeholder`);
  }
  const unconfirmedPeople = gallery.filter((g) => g.people && !g.permissionConfirmed);
  if (unconfirmedPeople.length) issues.push(`Permission not confirmed for photos showing people: ${unconfirmedPeople.map((g) => g.file).join(', ')}`);
  for (const m of materials) {
    if (m.forHire !== true) issues.push(`Material "${m.name}": hire availability not confirmed`);
    const pending = m.photos.filter((p) => !p.confirmed);
    if (pending.length) issues.push(`Material "${m.name}": photos not confirmed as this item (${pending.map((p) => p.file).join(', ')})`);
  }
  return issues;
}
