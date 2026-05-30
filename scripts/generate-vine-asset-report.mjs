import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { getVineAssetStatus } from './vine-asset-tools.mjs';

const args = process.argv.slice(2);
const formatArg = args.find((arg) => arg.startsWith('--format='));
const outputArg = args.find((arg) => arg.startsWith('--output='));
const format = formatArg ? formatArg.split('=')[1] : 'markdown';
const outputPath = outputArg ? resolve(process.cwd(), outputArg.split('=')[1]) : null;

if (!['json', 'markdown'].includes(format)) {
  console.error(`Unsupported format: ${format}`);
  process.exit(1);
}

const status = getVineAssetStatus();

const toJsonReport = () =>
  JSON.stringify(
    {
      generatedAt: status.generatedAt,
      summary: status.summary,
      assets: status.assets.map(({ absolutePath, ...asset }) => asset),
    },
    null,
    2,
  );

const formatAssetLine = (asset) => {
  const labels = [asset.group, asset.slot];
  if (asset.category) labels.push(asset.category);
  return `- [${asset.exists ? 'x' : ' '}] ${asset.plannedSrc} — ${asset.title} (${labels.join(' / ')})`;
};

const toMarkdownReport = () => {
  const lines = [
    '# Vine asset handoff report',
    '',
    `Generated: ${status.generatedAt}`,
    '',
    '## Summary',
    `- Total assets: ${status.summary.total}`,
    `- Ready: ${status.summary.found}`,
    `- Missing: ${status.summary.missing}`,
    `- Completion: ${(status.summary.completionRatio * 100).toFixed(1)}%`,
    '',
    '## Missing assets',
  ];

  if (status.missing.length) {
    lines.push(...status.missing.map(formatAssetLine));
  } else {
    lines.push('- None');
  }

  lines.push('', '## Ready assets');

  if (status.found.length) {
    lines.push(...status.found.map(formatAssetLine));
  } else {
    lines.push('- None');
  }

  lines.push('', '## Full manifest');
  lines.push(...status.assets.map(formatAssetLine));

  return `${lines.join('\n')}\n`;
};

const report = format === 'json' ? toJsonReport() : toMarkdownReport();

if (outputPath) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, report);
  console.error(`Wrote ${format} report to ${outputPath}`);
}

process.stdout.write(report);
