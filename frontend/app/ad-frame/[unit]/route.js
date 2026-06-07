const DISPLAY_UNITS = {
  banner: { key: '2583f5f13d714ffc8be10c310970b8ea', width: 468, height: 60 },
  'sidebar-small': { key: 'cc736032401f2d96a106a326c1f23852', width: 160, height: 300 },
  'sidebar-tall': { key: 'a36cd7ed43758679758c2d7da42541cd', width: 160, height: 600 },
  mobile: { key: '798b75fbe3c193a57d91fabce071123c', width: 320, height: 50 },
  leaderboard: { key: '0cbec3572fe545d32dfe00f0aee19673', width: 728, height: 90 },
  rectangle: { key: '803ae6bfa9c0cea6f6eeeeec68041dd5', width: 300, height: 250 },
};

const NATIVE_ID = '6d633b2313420b687c769f65b39be21b';

function displayDocument({ key, width, height }) {
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; background: transparent; }
    </style>
  </head>
  <body>
    <script>
      atOptions = {
        key: '${key}',
        format: 'iframe',
        height: ${height},
        width: ${width},
        params: {}
      };
    </script>
    <script src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
  </body>
</html>`;
}

function nativeDocument() {
  return `<!doctype html>
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
}

export function GET(_request, { params }) {
  const html =
    params.unit === 'native'
      ? nativeDocument()
      : DISPLAY_UNITS[params.unit]
        ? displayDocument(DISPLAY_UNITS[params.unit])
        : null;

  if (!html) {
    return new Response('Unknown ad unit', { status: 404 });
  }

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
