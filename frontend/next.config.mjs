/** @type {import('next').NextConfig} */
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
let remotePattern;
try {
  const u = new URL(apiBase);
  remotePattern = {
    protocol: u.protocol.replace(':', ''),
    hostname: u.hostname,
    port: u.port || '',
    pathname: '/api/stories/**',
  };
} catch {
  remotePattern = { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/api/stories/**' };
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [remotePattern],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
