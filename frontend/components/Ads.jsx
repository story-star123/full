// HilltopAds placeholder components.
// To activate: replace the placeholder <div> contents with the HilltopAds
// script/snippet for each zone. The wrapper sizes are reserved so ads never
// break layout (they collapse gracefully if no ad loads).

function AdSlot({ label, className = '', minHeight = 90 }) {
  return (
    <div
      className={`w-full overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center text-xs uppercase tracking-wide text-gray-400 flex items-center justify-center ${className}`}
      style={{ minHeight }}
      aria-hidden="true"
      data-ad-zone={label}
    >
      {/* HILLTOPADS: paste the script for "{label}" here */}
      Ad space: {label}
    </div>
  );
}

export function AdTopBanner() {
  return <AdSlot label="top-banner" minHeight={90} className="my-4" />;
}

export function AdMiddleBanner() {
  return <AdSlot label="middle-banner" minHeight={250} className="my-6" />;
}

export function AdBottomBanner() {
  return <AdSlot label="bottom-banner" minHeight={90} className="my-4" />;
}

export function AdSidebar() {
  return (
    <aside className="hidden lg:block w-full">
      <AdSlot label="sidebar" minHeight={600} className="sticky top-20" />
    </aside>
  );
}

export function AdInline({ label = 'inline' }) {
  return <AdSlot label={label} minHeight={250} className="my-6" />;
}
