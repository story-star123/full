import express from 'express';
import {
  getAllStories,
  getStoryBySlug,
  getCategories,
  resolveImagePath,
} from '../storyLoader.js';
import { isSafeSlug } from '../utils/safePath.js';

const router = express.Router();

function paginate(items, query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const rawLimit = parseInt(query.limit, 10) || 12;
  const limit = Math.min(Math.max(1, rawLimit), 50);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, pagination: { page, limit, total, totalPages, hasMore: page < totalPages } };
}

// GET /api/stories?page=&limit=&category=&featured=
router.get('/stories', (req, res) => {
  let stories = getAllStories();

  if (req.query.category && typeof req.query.category === 'string') {
    const cat = req.query.category.toLowerCase();
    stories = stories.filter((s) => s.category.toLowerCase() === cat);
  }

  const result = paginate(stories, req.query);
  res.json(result);
});

// GET /api/stories/featured  -> newest stories flagged as featured (first N)
router.get('/stories/featured', (req, res) => {
  const limit = Math.min(Math.max(1, parseInt(req.query.limit, 10) || 5), 20);
  res.json({ data: getAllStories().slice(0, limit) });
});

// GET /api/categories
router.get('/categories', (_req, res) => {
  res.json({ data: getCategories() });
});

// GET /api/search?q=
router.get('/search', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  if (!q) return res.json({ data: [], query: '' });
  if (q.length > 100) return res.status(400).json({ error: 'Query too long' });

  const matches = getAllStories().filter((s) =>
    s.title.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.author.toLowerCase().includes(q)
  );
  res.json({ data: matches, query: q });
});

// GET /api/stories/:slug/images/:filename  (must be before /stories/:slug)
router.get('/stories/:slug/images/:filename', async (req, res) => {
  const { slug, filename } = req.params;
  const filePath = await resolveImagePath(slug, filename);
  if (!filePath) return res.status(404).json({ error: 'Image not found' });
  res.set('Cache-Control', 'public, max-age=86400');
  res.sendFile(filePath);
});

// GET /api/stories/:slug
router.get('/stories/:slug', (req, res) => {
  const { slug } = req.params;
  if (!isSafeSlug(slug)) return res.status(400).json({ error: 'Invalid slug' });
  const story = getStoryBySlug(slug);
  if (!story) return res.status(404).json({ error: 'Story not found' });
  res.json({ data: story });
});

export default router;
