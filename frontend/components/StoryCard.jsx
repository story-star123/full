'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';
import { formatDate } from '../lib/site';

export default function StoryCard({ story }) {
  return (
    <motion.article 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col overflow-hidden rounded-2xl glass transition-all hover:border-brand-500/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]"
    >
      <Link href={`/story/${story.slug}`} className="relative block aspect-[3/2] overflow-hidden bg-secondary">
        {story.featuredImage ? (
          <Image
            src={story.featuredImage}
            alt={story.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">No image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
        <span className="absolute left-4 top-4 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-medium text-brand-300 backdrop-blur-md border border-brand-500/30">
          {story.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">
          <Link href={`/story/${story.slug}`} className="hover:text-brand-400 transition-colors">
            {story.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm text-foreground/70 line-clamp-3">{story.description}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5"><User size={14} /> {story.author}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDate(story.uploadDate)}</span>
        </div>
        <Link
          href={`/story/${story.slug}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 hover:border-brand-500"
        >
          Read story
        </Link>
      </div>
    </motion.article>
  );
}
