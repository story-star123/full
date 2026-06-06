# StoryHub – Folder-Based Story + Image Platform

A production-ready website for publishing illustrated short stories. Stories are
loaded automatically from a folder structure — **no database required**. Add a
folder with `metadata.json`, `story.md`, and 10 images, and the story publishes
itself.

Built entirely with free technologies and deployable on free tiers.

- **Frontend:** Next.js 14 (App Router) + React + Tailwind CSS — responsive, SEO-optimized, image-optimized.
- **Backend:** Node.js + Express — scans the `stories/` folder and serves a REST API. No database, no paid services.

## Project structure

```
new-website/
├── backend/                     # Express API (no database)
│   ├── src/
│   │   ├── server.js            # Express app, security, rate limiting
│   │   ├── config.js            # Env-based config
│   │   ├── storyLoader.js       # Scans stories/, parses md + metadata
│   │   ├── routes/stories.js    # API endpoints
│   │   └── utils/safePath.js    # Path-traversal protection + validation
│   ├── scripts/add-story.js     # `npm run add-story` CLI
│   ├── stories/                 # <-- your story folders live here
│   │   └── story-001/
│   │       ├── metadata.json
│   │       ├── story.md
│   │       └── image1..image10.svg
│   ├── package.json
│   └── .env.example
└── frontend/                    # Next.js app
    ├── app/                     # App Router pages + sitemap/robots
    ├── components/              # UI + ad components
    ├── lib/                     # API client + helpers
    ├── package.json
    └── .env.example
```

## API endpoints (backend)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/stories?page=&limit=&category=` | Paginated list |
| GET | `/api/stories/featured?limit=` | Featured (newest) stories |
| GET | `/api/stories/:slug` | Full story with sections + images |
| GET | `/api/stories/:slug/images/:filename` | Serve a story image |
| GET | `/api/categories` | Categories with counts |
| GET | `/api/search?q=` | Search title/description/category/author |

## Installation

Requires **Node.js 18+**.

```bash
# 1. Backend
cd backend
cp .env.example .env
npm install

# 2. Frontend (in a second terminal)
cd frontend
cp .env.example .env.local
npm install
```

## Local development

```bash
# Terminal 1 – backend on http://localhost:4000
cd backend
npm run dev

# Terminal 2 – frontend on http://localhost:3000
cd frontend
npm run dev
```

The frontend reads the backend URL from `NEXT_PUBLIC_API_BASE_URL` in
`frontend/.env.local`.

## Adding a new story

No coding required. Two options:

**Option A – use the script:**

```bash
cd backend
npm run add-story
```

It asks for the title/author/category/description, then creates
`stories/story-XXX/` with a `metadata.json` and `story.md` template. Then just
drop in your 10 images named `image1.jpg` .. `image10.jpg`.

**Option B – manual:**

1. Create `backend/stories/story-XYZ/`.
2. Add `metadata.json`:
   ```json
   {
     "title": "Story Title",
     "slug": "story-title",
     "description": "Short description",
     "author": "Admin",
     "category": "Adventure",
     "featuredImage": "image1.jpg"
   }
   ```
3. Add `story.md` (the full story text). **Blank lines separate sections** —
   one image is displayed after each section on the reading page.
4. Add 10 images: `image1.jpg` .. `image10.jpg` (`.jpg .jpeg .png .webp .gif .svg` all work).

The story is detected and published automatically (30s cache).

## Customizing categories

Categories are driven entirely by the `category` field in each story's
`metadata.json`. To add a category, just use a new value — it appears on the
home page, the categories page, and gets its own `/category/<name>` page
automatically. No code changes needed.

## Adding HilltopAds code

Ad slots are reusable components in `frontend/components/Ads.jsx`:
`AdTopBanner`, `AdMiddleBanner`, `AdBottomBanner`, `AdSidebar`, and `AdInline`.

Placements already wired up:

- Home page: top, middle, bottom banners.
- Story page: `AdInline` after image 3 and after image 7, plus `AdSidebar` on desktop.

To activate, open `frontend/components/Ads.jsx` and replace the placeholder
content inside the `AdSlot` component (look for the `HILLTOPADS:` comment) with
your HilltopAds script/snippet for the matching zone (each slot has a
`data-ad-zone` label). The reserved `minHeight` keeps the layout stable so ads
never cause layout shift.

## Deployment

The frontend and backend deploy separately.

### Backend on Render (free tier)

Render provides a completely free tier for web services. To make this 1-click, we've included a `render.yaml` file.

1. Push this code to a new GitHub repository.
2. Go to [Render](https://dashboard.render.com/) and sign up.
3. Click "New" -> "Blueprint".
4. Connect your GitHub repository. Since `render.yaml` is in the backend folder, you may need to specify the blueprint path as `backend/render.yaml` if Render doesn't detect it automatically.
5. Fill in the required environment variables in the Render dashboard:
   - `CORS_ORIGINS` – your deployed frontend URL (e.g., `https://your-site.vercel.app`).
   - `PUBLIC_BASE_URL` – the `.onrender.com` URL Render gives your backend.
6. Click "Apply". Your backend will deploy. Note the public URL.

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The first request after spinning down might take ~50 seconds.

> Story files live in the repo, so they ship with the deploy. To add stories in
> production, commit new folders and redeploy.

### Frontend on Vercel (free tier)

1. Import the repo into Vercel, set the **Root Directory** to `frontend/`.
2. Framework preset: **Next.js** (auto-detected).
3. Environment variables:
   - `NEXT_PUBLIC_API_BASE_URL` – your Render backend URL.
   - `NEXT_PUBLIC_SITE_URL` – your Vercel site URL.
   - `NEXT_PUBLIC_SITE_NAME` – e.g. `StoryHub`.
4. Deploy.

### Frontend on Cloudflare Pages (alternative, free tier)

1. Create a Pages project from this repo, root directory `frontend/`.
2. Build command: `npx @cloudflare/next-on-pages@1`.
3. Build output directory: `.vercel/output/static`.
4. Add the `nodejs_compat` compatibility flag (Settings → Functions).
5. Set the same `NEXT_PUBLIC_*` environment variables as above.
6. Deploy.

## Security

- Input validation on all route params and query strings.
- Path-traversal protection on all file reads (`utils/safePath.js`).
- `helmet` security headers, restricted CORS, and rate limiting (120 req/min/IP).
- Safe error handling — internal errors are never leaked to clients.

## Performance & SEO

- Next.js `<Image>` optimization, lazy loading, AVIF/WebP.
- Mobile-first responsive layout.
- Server-rendered pages with ISR caching.
- `sitemap.xml`, `robots.txt`, Open Graph, Twitter cards, canonical URLs, and
  Article JSON-LD on story pages.

## License

MIT.
