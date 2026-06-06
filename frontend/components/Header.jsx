'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { SITE_NAME } from '../lib/site';
import SearchBar from './SearchBar';

export default function Header() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Stories', href: '/stories' },
    { name: 'Categories', href: '/categories' },
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b-0 border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 transition-colors">
              <BookOpen size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              {SITE_NAME}
            </span>
          </Link>
          <nav className="flex gap-4 text-sm font-medium text-foreground/80 sm:hidden">
            <Link href="/stories">Stories</Link>
            <Link href="/categories">Categories</Link>
          </nav>
        </div>
        <nav className="hidden sm:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-white/5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  isActive ? 'text-white' : 'text-muted hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="header-active-tab"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sm:w-72">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
