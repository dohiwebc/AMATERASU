/**
 * mock 由来の料金・プラン内容を microCMS に反映する
 * 実行: node --env-file=.env scripts/push-pricing-to-cms.mjs
 *
 * 環境変数:
 * - MICROCMS_SERVICE_DOMAIN（必須）
 * - MICROCMS_WRITE_API_KEY（推奨・書き込み権限）
 * - MICROCMS_API_KEY（WRITE 未設定時のフォールバック。書き込み権限が必要）
 *
 * 注意: PATCH（更新）のみ行います。DELETE は使いません。
 */
import { createClient } from 'microcms-js-sdk';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_WRITE_API_KEY || process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  console.error(
    'MICROCMS_SERVICE_DOMAIN と、MICROCMS_WRITE_API_KEY または MICROCMS_API_KEY を .env に設定してください。',
  );
  process.exit(1);
}

if (!process.env.MICROCMS_WRITE_API_KEY && process.env.MICROCMS_API_KEY) {
  console.warn(
    '[warn] MICROCMS_WRITE_API_KEY 未設定のため MICROCMS_API_KEY を使用します（書き込み権限が必要）。',
  );
}

function toMultiline(value) {
  if (!value) return '';
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean).join('\n');
  return String(value);
}

async function main() {
  const client = createClient({ serviceDomain, apiKey });
  const payload = JSON.parse(readFileSync(join(root, 'scripts/plan-pricing-payload.json'), 'utf8'));

  for (const plan of payload.plans) {
    // microCMS 側の実フィールド名に合わせる（update = PATCH のみ）
    const body = {
      price: plan.price,
      priceNote: plan.priceNote ?? '',
      shortDescription: plan.shortDescription ?? '',
      description: plan.description ?? '',
      recommendedFor: toMultiline(plan.recommendedFor),
      contents: toMultiline(plan.publishableContent),
      pageCount: plan.pageCount ?? '',
      requiredItems: toMultiline(plan.clientProvides),
      included: toMultiline(plan.included),
      notIncluded: toMultiline(plan.notIncluded),
      deliveryFormat: plan.deliveryFormat ?? '',
      deliveryTime: plan.productionPeriod ?? '',
      revisionCount: plan.revisionCount ?? '',
      notes: toMultiline(plan.notes),
    };

    process.stdout.write(`PATCH plans/${plan.id} (${plan.slug}) ... `);
    await client.update({
      endpoint: 'plans',
      contentId: plan.id,
      content: body,
    });
    console.log('ok');
  }

  if (payload.siteSettings) {
    process.stdout.write('PATCH site-settings ... ');
    await client.update({
      endpoint: 'site-settings',
      content: payload.siteSettings,
    });
    console.log('ok');
  }

  if (payload.contactSettings) {
    process.stdout.write('PATCH contact-settings ... ');
    await client.update({
      endpoint: 'contact-settings',
      content: payload.contactSettings,
    });
    console.log('ok');
  }

  console.log('完了: microCMS への料金・プラン内容の反映が終わりました。');
  console.log('Cloudflare Pages の再デプロイ後、本番に反映されます（オプションはコード側のためデプロイ必須）。');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
