const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const INPUT_FILE = './badges.html';
const OUTPUT_FILE = './badges.ts';
const DEFAULT_COLOR = '#9147ff';

function extractBadgeIdFromHref(href) {
  const match = href.match(/\/twitch\/global-badges\/(.+)$/);
  return match ? match[1] : null;
}

function extractImageId(src) {
  const match = src.match(/\/badges\/v1\/(.+\/\d)/);
  return match ? match[1] : null;
}

function generateOutput(badges) {
  const timestamp = new Date().toISOString();
  const header = `// Twitch badge CDN configuration
// Badge images: https://static-cdn.jtvnw.net/badges/v1/{badge_id}/{version}
// Auto-generated from badges.html - ${timestamp}

export interface BadgeInfo {
  id: string
  displayName: string
  color: string
  // Image ID for CDN (some badges have different IDs on CDN)
  imageId?: string
}

export const BADGE_CONFIG: Record<string, BadgeInfo> = {\n`;

  const entries = badges.map(badge => {
    return `  "${badge.id}": {
    id: '${badge.id}',
    displayName: '${badge.displayName.replace(/'/g, "\\'")}',
    color: '${badge.color}',
    imageId: '${badge.imageId}'
  }`;
  }).join(',\n');

  return `${header}${entries}\n}`;
}

function parseBadges(html) {
  const $ = cheerio.load(html);
  const badges = [];

  $('a[href^="/twitch/global-badges/"]').each((_, el) => {
    const href = $(el).attr('href');
    const id = extractBadgeIdFromHref(href);
    const displayName = $(el).find('p').first().text().trim();
    const img = $(el).find('img');
    const src = img.attr('src');
    const imageId = extractImageId(src);

    if (id && displayName && imageId) {
      badges.push({
        id,
        displayName,
        color: DEFAULT_COLOR,
        imageId
      });
    }
  });

  return badges;
}

function main() {
  const html = fs.readFileSync(INPUT_FILE, 'utf8');
  const badges = parseBadges(html);
  const output = generateOutput(badges);
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
  console.log(`✅ Generated ${OUTPUT_FILE} with ${badges.length} badges.`);
}

main();