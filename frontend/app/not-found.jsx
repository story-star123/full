import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-900">404</h1>
      <p className="mt-3 text-gray-600">The page or story you’re looking for doesn’t exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Back home
      </Link>
    </div>
  );
}
