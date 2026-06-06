import StoryCard from '../../components/StoryCard';
import SearchBar from '../../components/SearchBar';
import { searchStories } from '../../lib/api';
import { canonical } from '../../lib/site';

export const metadata = {
  title: 'Search',
  description: 'Search stories by title, description, or category.',
  alternates: { canonical: canonical('/search') },
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  let results = [];
  if (q.trim()) {
    try {
      const res = await searchStories(q.trim());
      results = res.data;
    } catch {
      results = [];
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Search</h1>
      <div className="mb-8">
        <SearchBar initial={q} autoFocus />
      </div>
      {q.trim() ? (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {results.length} result{results.length === 1 ? '' : 's'} for “{q}”
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
          {results.length === 0 && (
            <p className="py-8 text-center text-gray-500">No stories matched your search.</p>
          )}
        </>
      ) : (
        <p className="text-gray-500">Type a query above to search stories.</p>
      )}
    </div>
  );
}
