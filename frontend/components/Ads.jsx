const SMARTLINK_URL =
  'https://www.effectivecpmnetwork.com/m9yx2k2y?key=e2b02fca771f71f52befc6297ce7f469';

const DISPLAY_KEY = '2583f5f13d714ffc8be10c310970b8ea';
const NATIVE_ID = '6d633b2313420b687c769f65b39be21b';

const displayAdDocument = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html, body { margin: 0; width: 468px; height: 60px; overflow: hidden; background: transparent; }
    </style>
  </head>
  <body>
    <script>
      atOptions = {
        key: '${DISPLAY_KEY}',
        format: 'iframe',
        height: 60,
        width: 468,
        params: {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/${DISPLAY_KEY}/invoke.js"></script>
  </body>
</html>`;

const nativeAdDocument = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html, body { margin: 0; min-height: 100%; overflow: hidden; background: transparent; }
      #container-${NATIVE_ID} { width: 100%; }
    </style>
  </head>
  <body>
    <script async data-cfasync="false" src="https://pl29665117.effectivecpmnetwork.com/${NATIVE_ID}/invoke.js"></script>
    <div id="container-${NATIVE_ID}"></div>
  </body>
</html>`;

const frameSandbox =
  'allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation';

function AdLabel() {
  return (
    <span className="mb-2 block text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted/70">
      Advertisement
    </span>
  );
}

function DisplayBanner({ className = '' }) {
  return (
    <aside className={`my-6 ${className}`} aria-label="Advertisement">
      <div className="hidden sm:block">
        <AdLabel />
        <iframe
          title="Sponsored display advertisement"
          srcDoc={displayAdDocument}
          width="468"
          height="60"
          loading="lazy"
          scrolling="no"
          sandbox={frameSandbox}
          referrerPolicy="strict-origin-when-cross-origin"
          className="mx-auto block max-w-full border-0"
        />
      </div>
      <div className="sm:hidden">
        <SponsoredLink compact />
      </div>
    </aside>
  );
}

function NativeBanner({ className = '' }) {
  return (
    <aside className={`my-8 ${className}`} aria-label="Advertisement">
      <AdLabel />
      <iframe
        title="Sponsored recommendations"
        srcDoc={nativeAdDocument}
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
  return <DisplayBanner />;
}

export function AdMiddleBanner() {
  return <NativeBanner />;
}

export function AdBottomBanner() {
  return <SponsoredLink />;
}

export function AdSidebar() {
  return <SponsoredLink className="sticky top-24" />;
}

export function AdInline({ label = 'inline' }) {
  return label === 'story-after-image-3' ? <NativeBanner /> : <SponsoredLink />;
}
