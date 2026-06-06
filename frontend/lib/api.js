// API client for the Express backend. Uses fetch with Next.js caching.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

async function api(path, { revalidate = 60 } = {}) {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`API error ${res.status} for ${path}`);
  }
  return res.json();
}

export async function getStories({ page = 1, limit = 12, category } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) params.set('category', category);
  return api(`/api/stories?${params.toString()}`);
}

export async function getFeaturedStories(limit = 5) {
  return api(`/api/stories/featured?limit=${limit}`);
}

export async function getStory(slug) {
  return api(`/api/stories/${encodeURIComponent(slug)}`);
}

export async function getCategories() {
  return api('/api/categories');
}

export async function searchStories(q) {
  return api(`/api/search?q=${encodeURIComponent(q)}`, { revalidate: 0 });
}

export { API_BASE };
