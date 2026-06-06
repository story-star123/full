import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { config } from './config.js';
import { isSafeSlug, isSafeFilename, safeResolve } from './utils/safePath.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const STORIES_DIR = path.resolve(__dirname, '..', 'stories');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const CACHE_TTL_MS = 30_000;

let cache = { data: null, expires: 0 };

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function listImages(folderPath) {
  let entries = [];
  try {
    entries = fs.readdirSync(folderPath, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && IMAGE_EXTENSIONS.includes(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .filter((name) => isSafeFilename(name))
    .sort(naturalCompare);
}

function readMetadata(folderPath) {
  const metaPath = path.join(folderPath, 'metadata.json');
  try {
    const raw = fs.readFileSync(metaPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readStoryMarkdown(folderPath) {
  const mdPath = path.join(folderPath, 'story.md');
  try {
    const raw = fs.readFileSync(mdPath, 'utf8');
    const parsed = matter(raw);
    return { content: parsed.content, frontmatter: parsed.data };
  } catch {
    return { content: '', frontmatter: {} };
  }
}

// Split markdown into logical sections so the frontend can place one image
// after each section. We split on blank lines into paragraph blocks.
function splitSections(markdown) {
  return markdown
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((block) => ({ markdown: block, html: marked.parse(block) }));
}

function imageUrl(slug, filename) {
  return `${config.publicBaseUrl}/api/stories/${encodeURIComponent(slug)}/images/${encodeURIComponent(filename)}`;
}

function buildStory(folderName, { withContent }) {
  const folderPath = safeResolve(STORIES_DIR, folderName);
  const metadata = readMetadata(folderPath);
  if (!metadata || !metadata.title) return null;

  const slug = isSafeSlug(metadata.slug) ? metadata.slug : folderName;
  if (!isSafeSlug(slug)) return null;

  const images = listImages(folderPath);
  let uploadDate = metadata.uploadDate;
  if (!uploadDate) {
    try {
      uploadDate = fs.statSync(folderPath).mtime.toISOString();
    } catch {
      uploadDate = new Date().toISOString();
    }
  }

  const featured = metadata.featuredImage && images.includes(metadata.featuredImage)
    ? metadata.featuredImage
    : images[0] || null;

  const base = {
    slug,
    title: String(metadata.title),
    description: String(metadata.description || ''),
    author: String(metadata.author || 'Admin'),
    category: String(metadata.category || 'Uncategorized'),
    uploadDate,
    featuredImage: featured ? imageUrl(slug, featured) : null,
    images: images.map((name) => imageUrl(slug, name)),
    imageCount: images.length,
  };

  if (withContent) {
    const { content } = readStoryMarkdown(folderPath);
    base.contentHtml = marked.parse(content);
    base.sections = splitSections(content);
  }

  return base;
}

function loadAll() {
  let folders = [];
  try {
    folders = fs
      .readdirSync(STORIES_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .filter((name) => isSafeSlug(name));
  } catch {
    return [];
  }

  const stories = folders
    .map((folder) => buildStory(folder, { withContent: false }))
    .filter(Boolean)
    .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

  return stories;
}

export function getAllStories() {
  const now = Date.now();
  if (cache.data && cache.expires > now) return cache.data;
  const data = loadAll();
  cache = { data, expires: now + CACHE_TTL_MS };
  return data;
}

export function getStoryBySlug(slug) {
  if (!isSafeSlug(slug)) return null;
  const summary = getAllStories().find((s) => s.slug === slug);
  if (!summary) return null;
  // Find the folder that maps to this slug and build full content.
  let folders = [];
  try {
    folders = fs.readdirSync(STORIES_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return null;
  }
  for (const folder of folders) {
    const full = buildStory(folder, { withContent: true });
    if (full && full.slug === slug) return full;
  }
  return null;
}

export function getCategories() {
  const counts = new Map();
  for (const s of getAllStories()) {
    counts.set(s.category, (counts.get(s.category) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => naturalCompare(a.name, b.name));
}

// Safely resolve an image file path on disk for a given slug + filename.
export async function resolveImagePath(slug, filename) {
  if (!isSafeSlug(slug) || !isSafeFilename(filename)) return null;
  if (!IMAGE_EXTENSIONS.includes(path.extname(filename).toLowerCase())) return null;

  let folders = [];
  try {
    folders = (await fsp.readdir(STORIES_DIR, { withFileTypes: true }))
      .filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return null;
  }
  for (const folder of folders) {
    const meta = readMetadata(safeResolve(STORIES_DIR, folder));
    const folderSlug = meta && isSafeSlug(meta.slug) ? meta.slug : folder;
    if (folderSlug !== slug) continue;
    const filePath = safeResolve(STORIES_DIR, folder, filename);
    try {
      const stat = await fsp.stat(filePath);
      if (stat.isFile()) return filePath;
    } catch {
      return null;
    }
  }
  return null;
}
