import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { flattenVineAssets, getVineAssetStatus } from './vine-asset-tools.mjs';

const args = process.argv.slice(2);
const formatArg = args.find((arg) => arg.startsWith('--format='));
const outputArg = args.find((arg) => arg.startsWith('--output='));
const format = formatArg ? formatArg.split('=')[1] : 'csv';
const outputPath = outputArg ? resolve(process.cwd(), outputArg.split('=')[1]) : null;

if (!['csv', 'markdown'].includes(format)) {
  console.error(`Unsupported format: ${format}`);
  process.exit(1);
}

const sourceHints = {
  logoPrimary: '기존 홈페이지 theme/TYPE08/img/logo.png',
  heroPrimary: '인스타그램 침대 대표컷 후보: https://www.instagram.com/p/C62940502/',
  heroSecondary: '인스타그램 소파 대표컷 후보: https://www.instagram.com/p/C656623823/',
  storeView: '기존 홈페이지 img4 또는 인스타 매장 전경 후보: https://www.instagram.com/p/C662940502/',
  galleryBed01: '기존 홈페이지 img1.png',
  gallerySofa01: '기존 홈페이지 img2.png',
  galleryTable01: '기존 홈페이지 img3.png',
  galleryStore01: '기존 홈페이지 img4.png',
  galleryStorage01: '기존 홈페이지 img5.png',
  galleryInstagramBed01: '인스타그램 침대 대표컷 재활용 가능',
  galleryInstagramSofa01: '인스타그램 소파 대표컷 재활용 가능',
  galleryStoreInterior01: '매장 전경 대표컷 재활용 가능',
};

const usageHints = {
  logoPrimary: '전 페이지 헤더/푸터',
  heroPrimary: '메인 히어로 대표컷',
  heroSecondary: '문의 페이지 보조 이미지 / 보조 히어로',
  storeView: '메인·브랜드·오시는 길 대표 매장컷',
  galleryBed01: '메인·갤러리 대표 침대컷',
  gallerySofa01: '메인·갤러리 대표 소파컷',
  galleryTable01: '메인·갤러리 대표 식탁컷',
  galleryStore01: '갤러리 매장 분위기컷',
  galleryStorage01: '갤러리 수납가구컷',
  galleryInstagramBed01: '갤러리 침실 스타일링컷',
  galleryInstagramSofa01: '갤러리 거실 스타일링컷',
  galleryStoreInterior01: '갤러리 매장 전경컷',
};

const priorityMap = {
  heroPrimary: 'P1',
  storeView: 'P1',
  logoPrimary: 'P1',
  galleryBed01: 'P2',
  gallerySofa01: 'P2',
  galleryTable01: 'P2',
  heroSecondary: 'P3',
  galleryStore01: 'P3',
  galleryStorage01: 'P3',
  galleryInstagramBed01: 'P3',
  galleryInstagramSofa01: 'P3',
  galleryStoreInterior01: 'P3',
};

const status = getVineAssetStatus();
const statusByKey = new Map(status.assets.map((asset) => [asset.key, asset]));

const rows = flattenVineAssets().map((asset) => {
  const live = statusByKey.get(asset.key);
  return {
    priority: priorityMap[asset.key] ?? 'P3',
    key: asset.key,
    title: asset.title,
    group: asset.group,
    slot: asset.slot,
    category: asset.category ?? '',
    target_path: asset.plannedSrc,
    current_status: live?.exists ? 'READY' : 'MISSING',
    current_active_src: live?.activeSrc ?? asset.src,
    intended_usage: usageHints[asset.key] ?? '',
    candidate_source: sourceHints[asset.key] ?? asset.source,
    recommended_format: asset.key === 'logoPrimary' ? 'png (투명 배경 권장)' : 'jpg 또는 webp',
    notes: live?.exists
      ? '이미 실자산 연결됨'
      : '파일명만 target_path에 맞춰 넣으면 자동 연결됨',
  };
});

const escapeCsv = (value) => {
  const stringValue = String(value ?? '');
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
};

const toCsv = () => {
  const headers = [
    'priority',
    'key',
    'title',
    'group',
    'slot',
    'category',
    'target_path',
    'current_status',
    'current_active_src',
    'intended_usage',
    'candidate_source',
    'recommended_format',
    'notes',
  ];

  const lines = [headers.join(',')];

  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row[header])).join(','));
  }

  return `${lines.join('\n')}\n`;
};

const toMarkdown = () => {
  const lines = [
    '# Vine asset intake sheet',
    '',
    `Generated: ${status.generatedAt}`,
    '',
    '실제 자산 전달/정리용 표입니다. `target_path` 기준으로 파일명을 맞춰 넣으면 자동 연결됩니다.',
    '',
    '## Summary',
    `- Total assets: ${status.summary.total}`,
    `- Ready: ${status.summary.found}`,
    `- Missing: ${status.summary.missing}`,
    '',
    '| Priority | Key | Title | Target path | Usage | Candidate source | Status |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.priority} | ${row.key} | ${row.title} | \`${row.target_path}\` | ${row.intended_usage} | ${row.candidate_source} | ${row.current_status} |`,
    );
  }

  lines.push('', '## Drop-in rule', '- 파일을 `public/` 기준 `target_path`에 맞춰 저장', '- 저장 후 `npm run assets:check`, `npm run build`, `npm run preview:check` 순으로 검증');

  return `${lines.join('\n')}\n`;
};

const report = format === 'csv' ? toCsv() : toMarkdown();

if (outputPath) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, report);
  console.error(`Wrote ${format} intake sheet to ${outputPath}`);
}

process.stdout.write(report);
