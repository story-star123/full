'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import StoryCard from './StoryCard';
import { API_BASE } from '../lib/api';

// Client-side infinite scroll list. Receives the first page from the server
// and loads more as the sentinel enters the viewport.
export default function InfiniteStories({ initial, pagination, category }) {
  const [stories, setStories] = useState(initial);
  const [page, setPage] = useState(pagination.page);
  const [hasMore, setHasMore] = useState(pagination.hasMore);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const next = page + 1;
      const params = new URLSearchParams({ page: String(next), limit: String(pagination.limit) });
      if (category) params.set('category', category);
      const res = await fetch(`${API_BASE}/api/stories?${params.toString()}`);
      const json = await res.json();
      setStories((prev) => [...prev, ...json.data]);
      setPage(next);
      setHasMore(json.pagination.hasMore);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pagination.limit, category]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: '400px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s) => (
          <StoryCard key={s.slug} story={s} />
        ))}
      </div>
      {stories.length === 0 && (
        <p className="py-12 text-center text-gray-500">No stories found.</p>
      )}
      <div ref={sentinel} className="h-10" />
      {loading && <p className="py-6 text-center text-gray-500">Loading more...</p>}
      {!hasMore && stories.length > 0 && (
        <p className="py-6 text-center text-sm text-gray-400">You've reached the end.</p>
      )}
    </div>
  );
}
