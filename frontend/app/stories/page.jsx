import InfiniteStories from '../../components/InfiniteStories';
import { AdTopBanner } from '../../components/Ads';
import { getStories } from '../../lib/api';
import { canonical } from '../../lib/site';

export const metadata = {
  title: 'All Stories',
  description: 'Browse all illustrated short stories.',
  alternates: { canonical: canonical('/stories') },
};

export const revalidate = 60;

export default async function StoriesPage() {
  let data = [];
  let pagination = { page: 1, limit: 12, hasMore: false };
  try {
    const res = await getStories({ page: 1, limit: 12 });
    data = res.data;
    pagination = res.pagination;
  } catch {
    // graceful empty state
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">All stories</h1>
      <AdTopBanner />
      <InfiniteStories initial={data} pagination={pagination} />
    </div>
  );
}
