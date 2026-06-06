import { getStories, getCategories } from '../lib/api';
import { SITE_URL } from '../lib/site';

// Dynamic sitemap: includes static routes, every story, and every category.
export default async function sitemap() {
  const now = new Date();
  const routes = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/stories`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  try {
    // Pull a large page to cover all stories for the sitemap.
    const [{ data: stories }, { data: categories }] = await Promise.all([
      getStories({ page: 1, limit: 50 }),
      getCategories(),
    ]);

    for (const s of stories) {
      routes.push({
        url: `${SITE_URL}/story/${s.slug}`,
        lastModified: s.uploadDate ? new Date(s.uploadDate) : now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
    for (const c of categories) {
      routes.push({
        url: `${SITE_URL}/category/${encodeURIComponent(c.name)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } catch {
    // If backend is unavailable, return static routes only.
  }

  return routes;
}
