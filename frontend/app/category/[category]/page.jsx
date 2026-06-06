import InfiniteStories from '../../../components/InfiniteStories';
import { getStories } from '../../../lib/api';
import { canonical } from '../../../lib/site';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const category = decodeURIComponent(params.category);
  return {
    title: `${category} stories`,
    description: `Browse ${category} stories.`,
    alternates: { canonical: canonical(`/category/${encodeURIComponent(category)}`) },
  };
}

export default async function CategoryPage({ params }) {
  const category = decodeURIComponent(params.category);
  let data = [];
  let pagination = { page: 1, limit: 12, hasMore: false };
  try {
    const res = await getStories({ page: 1, limit: 12, category });
    data = res.data;
    pagination = res.pagination;
  } catch {
    // graceful empty state
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Category: <span className="text-brand-600">{category}</span>
      </h1>
      <InfiniteStories initial={data} pagination={pagination} category={category} />
    </div>
  );
}
