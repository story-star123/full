import Link from 'next/link';
import { getCategories } from '../../lib/api';
import { canonical } from '../../lib/site';

export const metadata = {
  title: 'Categories',
  description: 'Browse stories by category.',
  alternates: { canonical: canonical('/categories') },
};

export const revalidate = 60;

export default async function CategoriesPage() {
  let categories = [];
  try {
    const res = await getCategories();
    categories = res.data;
  } catch {
    // graceful empty state
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/category/${encodeURIComponent(c.name)}`}
              className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-brand-500 hover:shadow-md"
            >
              <span className="block text-lg font-semibold text-gray-900">{c.name}</span>
              <span className="mt-1 block text-sm text-gray-500">{c.count} stories</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
