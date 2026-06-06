import Link from 'next/link';
import { Sparkles, TrendingUp } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import SearchBar from '../components/SearchBar';
import { AdTopBanner, AdMiddleBanner, AdBottomBanner } from '../components/Ads';
import { getFeaturedStories, getStories, getCategories } from '../lib/api';
import { canonical } from '../lib/site';

export const metadata = {
  alternates: { canonical: canonical('/') },
};

export const revalidate = 60;

export default async function HomePage() {
  let featured = [];
  let latest = [];
  let categories = [];
  try {
    const [f, l, c] = await Promise.all([
      getFeaturedStories(3),
      getStories({ page: 1, limit: 6 }),
      getCategories(),
    ]);
    featured = f.data;
    latest = l.data;
    categories = c.data;
  } catch {
    // Backend unavailable: render empty states gracefully.
  }

  return (
    <div className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-16 text-center animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-brand-900/20" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl opacity-50 animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        
        <div className="relative z-10 flex flex-col items-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-300 border border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <Sparkles size={14} /> Premium Short Stories
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            A new world after <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-teal-300">
              every paragraph
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 sm:text-xl">
            Immerse yourself in illustrated adventures, mysteries, and fantasy. Discover the magic of storytelling.
          </p>
          <div className="mt-8 flex w-full justify-center px-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      <AdTopBanner />

      {featured.length > 0 && (
        <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="text-brand-400" />
            <h2 className="text-3xl font-bold text-white tracking-tight">Featured stories</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        </section>
      )}

      <AdMiddleBanner />

      <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">Latest stories</h2>
          <Link href="/stories" className="group flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300">
            View all <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
        {latest.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl glass-panel py-16 text-center">
            <p className="text-lg text-muted">No stories yet. They're still being written.</p>
          </div>
        )}
      </section>

      {categories.length > 0 && (
        <section className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="mb-6 text-2xl font-bold text-white tracking-tight">Browse by category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/category/${encodeURIComponent(c.name)}`}
                className="group flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-brand-500/50 hover:bg-white/5 hover:text-white"
              >
                {c.name} <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-muted transition-colors group-hover:bg-brand-500/20 group-hover:text-brand-300">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <AdBottomBanner />
    </div>
  );
}
