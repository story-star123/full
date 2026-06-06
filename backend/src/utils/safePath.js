import path from 'node:path';

// A safe slug/filename only contains letters, numbers, dashes and underscores
// (filenames may also include a single dot for the extension).
const SLUG_RE = /^[a-zA-Z0-9_-]+$/;
const FILE_RE = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;

export function isSafeSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 && slug.length <= 200 && SLUG_RE.test(slug);
}

export function isSafeFilename(name) {
  return typeof name === 'string' && name.length > 0 && name.length <= 200 && FILE_RE.test(name);
}

// Resolve a child path and guarantee it stays inside the base directory.
// Throws if the resolved path escapes the base (path traversal protection).
export function safeResolve(baseDir, ...segments) {
  const resolvedBase = path.resolve(baseDir);
  const target = path.resolve(resolvedBase, ...segments);
  if (target !== resolvedBase && !target.startsWith(resolvedBase + path.sep)) {
    throw new Error('Path traversal attempt detected');
  }
  return target;
}
