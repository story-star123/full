'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ initial = '', autoFocus = false }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  function onSubmit(e) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} role="search" className="relative flex w-full max-w-xl items-center">
      <div className="absolute left-3 text-muted">
        <Search size={18} />
      </div>
      <input
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search stories, categories, authors..."
        aria-label="Search stories"
        maxLength={100}
        className="w-full rounded-full border border-white/10 bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-muted backdrop-blur-sm transition-all focus:border-brand-500 focus:bg-secondary/80 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <button
        type="submit"
        className="absolute right-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-brand-500 hover:shadow-[0_0_15px_rgba(20,184,166,0.4)]"
      >
        Search
      </button>
    </form>
  );
}
