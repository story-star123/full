'use client';

import { useEffect, useState } from 'react';

const SMARTLINK_URL =
  'https://www.effectivecpmnetwork.com/m9yx2k2y?key=e2b02fca771f71f52befc6297ce7f469';

const UNITS = {
  banner: { id: 'banner', width: 468, height: 60 },
  sidebarSmall: { id: 'sidebar-small', width: 160, height: 300 },
  sidebarTall: { id: 'sidebar-tall', width: 160, height: 600 },
  mobile: { id: 'mobile', width: 320, height: 50 },
  leaderboard: { id: 'leaderboard', width: 728, height: 90 },
  rectangle: { id: 'rectangle', width: 300, height: 250 },
};

const frameSandbox =
  'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation';

function useViewportWidth() {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return width;
}

function AdLabel() {
  return (
    <span className="mb-2 block text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted/70">
      Advertisement
    </span>
  );
}

function DisplayUnit({ unit, title, eager = false }) {
  return (
    <iframe
      title={title}
      src={`/ad-frame/${unit.id}`}
      width={unit.width}
      height={unit.height}
      loading={eager ? 'eager' : 'lazy'}
      scrolling="no"
      sandbox={frameSandbox}
      referrerPolicy="strict-origin-when-cross-origin"
      className="block max-w-full border-0"
    />
  );
}

function ResponsiveBanner({ className = '' }) {
  const viewportWidth = useViewportWidth();
  const unit =
    viewportWidth === null
      ? null
      : viewportWidth >= 900
        ? UNITS.leaderboard
        : viewportWidth >= 520
          ? UNITS.banner
          : UNITS.mobile;

  return (
    <aside
      className={`my-6 min-h-[76px] rounded-2xl border border-white/5 bg-card/10 px-2 py-3 sm:min-h-[86px] lg:min-h-[116px] ${className}`}
      aria-label="Advertisement"
    >
      <AdLabel />
      <div className="flex justify-center">
        {unit && <DisplayUnit unit={unit} title="Sponsored display advertisement" eager />}
      </div>
    </aside>
  );
}

function NativeBanner({ className = '' }) {
  return (
    <aside className={`${className}`} aria-label="Advertisement">
      <AdLabel />
      <iframe
        title="Sponsored recommendations"
        src="/ad-frame/native"
        width="100%"
        height="280"
        loading="lazy"
        scrolling="no"
        sandbox={frameSandbox}
        referrerPolicy="strict-origin-when-cross-origin"
        className="block w-full rounded-2xl border border-white/10 bg-card/20"
      />
    </aside>
  );
}

function RectangleBanner({ className = '' }) {
  return (
    <aside className={className} aria-label="Advertisement">
      <AdLabel />
      <div className="flex justify-center overflow-hidden rounded-2xl border border-white/10 bg-card/20 p-2">
        <DisplayUnit unit={UNITS.rectangle} title="Sponsored rectangle advertisement" />
      </div>
    </aside>
  );
}

function SponsoredLink({ compact = false, className = '' }) {
  return (
    <aside className={`${compact ? '' : 'my-8'} ${className}`} aria-label="Sponsored link">
      <a
        href={SMARTLINK_URL}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-card/40 px-5 py-4 text-left shadow-lg transition hover:border-brand-500/40 hover:bg-card/60 focus:outline-none focus:ring-2 focus:ring-brand-400"
      >
        <span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            Sponsored
          </span>
          <span className="mt-1 block font-semibold text-foreground">
            Discover something new
          </span>
        </span>
        <span
          aria-hidden="true"
          className="text-xl text-brand-400 transition-transform group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </a>
    </aside>
  );
}

export function AdTopBanner() {
  return <ResponsiveBanner />;
}

export function AdMiddleBanner() {
  return (
    <section className="my-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <NativeBanner />
      <RectangleBanner />
    </section>
  );
}

export function AdBottomBanner() {
  return <SponsoredLink />;
}

export function AdSidebar() {
  return (
    <aside className="hidden lg:block" aria-label="Sidebar advertisements">
      <div className="flex flex-col items-center gap-8 rounded-3xl border border-white/5 bg-card/10 px-4 py-5">
        <div>
          <AdLabel />
          <DisplayUnit unit={UNITS.sidebarTall} title="Sponsored tall advertisement" />
        </div>
        <div>
          <AdLabel />
          <DisplayUnit unit={UNITS.sidebarSmall} title="Sponsored sidebar advertisement" />
        </div>
        <SponsoredLink compact className="w-full" />
      </div>
    </aside>
  );
}

export function AdInline({ label = 'inline' }) {
  if (label === 'story-after-image-3') {
    return (
      <section className="my-10 grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_320px]">
        <NativeBanner />
        <RectangleBanner />
      </section>
    );
  }

  return (
    <div className="my-10">
      <ResponsiveBanner className="my-0" />
    </div>
  );
}
