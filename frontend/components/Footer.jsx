import Link from 'next/link';
import { SITE_NAME } from '../lib/site';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-secondary/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        <nav className="flex gap-6">
          <Link href="/" className="transition-colors hover:text-brand-400">Home</Link>
          <Link href="/stories" className="transition-colors hover:text-brand-400">Stories</Link>
          <Link href="/categories" className="transition-colors hover:text-brand-400">Categories</Link>
        </nav>
      </div>
    </footer>
  );
}
