import { Outfit } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '../lib/site';
import { GoogleAnalytics } from '@next/third-parties/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Illustrated Short Stories`,
    template: `%s – ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4478096228997822" crossOrigin="anonymous"></script>
        <script src="https://pl29665113.effectivecpmnetwork.com/c9/5c/dc/c95cdc9ae474504f7aff4e5a25d2d8a4.js"></script>
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
