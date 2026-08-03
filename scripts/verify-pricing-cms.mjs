/**
 * push 後の整合確認: microCMS と plan-pricing-payload.json を比較
 * 実行: node --env-file=.env scripts/verify-pricing-cms.mjs
 */
import { createClient } from 'microcms-js-sdk';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  console.error('MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が必要です');
  process.exit(1);
}

function norm(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).join('\n');
  }
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim();
}

const client = createClient({ serviceDomain, apiKey });
const payload = JSON.parse(readFileSync(join(root, 'scripts/plan-pricing-payload.json'), 'utf8'));
const mismatches = [];

for (const expected of payload.plans) {
  const raw = await client.get({ endpoint: 'plans', contentId: expected.id });
  const checks = [
    ['price', raw.price, expected.price],
    ['priceNote', raw.priceNote, expected.priceNote],
    ['shortDescription', raw.shortDescription, expected.shortDescription],
    ['description', raw.description, expected.description],
    ['recommendedFor', raw.recommendedFor, expected.recommendedFor],
    ['contents', raw.contents, expected.publishableContent],
    ['pageCount', raw.pageCount, expected.pageCount],
    ['requiredItems', raw.requiredItems, expected.clientProvides],
    ['included', raw.included, expected.included],
    ['notIncluded', raw.notIncluded, expected.notIncluded],
    ['deliveryFormat', raw.deliveryFormat, expected.deliveryFormat],
    ['deliveryTime', raw.deliveryTime, expected.productionPeriod],
    ['revisionCount', raw.revisionCount, expected.revisionCount],
    ['notes', raw.notes, expected.notes],
  ];

  for (const [field, actual, exp] of checks) {
    if (norm(actual) !== norm(exp)) {
      mismatches.push(`${expected.slug}.${field}`);
      console.log(`DIFF ${expected.slug}.${field}`);
    }
  }
  console.log(`OK ${expected.slug}: ${raw.price}`);
}

const settings = await client.get({ endpoint: 'site-settings' });
for (const key of ['planGeneralNotes', 'miniGeneralNotes']) {
  if (norm(settings[key]) !== norm(payload.siteSettings[key])) {
    mismatches.push(`site-settings.${key}`);
    console.log(`DIFF site-settings.${key}`);
  } else {
    console.log(`OK site-settings.${key}`);
  }
}

const contact = await client.get({ endpoint: 'contact-settings' });
if (norm(contact.budgetOptions) !== norm(payload.contactSettings.budgetOptions)) {
  mismatches.push('contact-settings.budgetOptions');
  console.log('DIFF contact-settings.budgetOptions');
} else {
  console.log('OK contact-settings.budgetOptions');
}

if (mismatches.length) {
  console.error(`\nMISMATCHES (${mismatches.length}):\n${mismatches.join('\n')}`);
  process.exit(1);
}

console.log('\nALL MATCH');
