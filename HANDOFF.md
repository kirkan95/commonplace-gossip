# Handoff — Commonplace Gossip

## Goal
Birthday gift website for user's wife, a Normal Gossip podcast fan. A private, password-protected site that plays 4 MP3 episodes (gossip stories submitted by her friends). Styled after Normal Gossip's branding. Hosted free on GitHub Pages. Audio protected behind a Cloudflare Worker + R2 backend.

## Stack
- **Frontend**: React (Vite) → `app/`
- **Backend**: Cloudflare Worker → `worker/`
- **Audio storage**: Cloudflare R2 (bucket name: `commonplace-gossip-audio`)
- **Hosting**: GitHub Pages (private repo)
- **Font**: Nunito (Google Fonts, loaded in `app/src/index.css`)

## Auth Flow
1. User enters shared password → POST to `{WORKER_URL}/auth` → returns HMAC-signed token
2. Token stored in `localStorage` key `cg_token`, expires after 30 days
3. On main page load → POST to `{WORKER_URL}/audio-urls` with `Authorization: Bearer {token}` → returns pre-signed R2 URLs (1hr expiry) for all 4 files
4. If 401 → token cleared → redirect to welcome screen

## Current State
**UI/UX: complete.** See `ux-plans/` for HTML mockups and decision docs.
**React app: complete and builds clean.** `npm run build` passes in `app/`.
**Cloudflare Worker: written but NOT deployed.**
**R2 bucket: NOT created yet.**
**Episodes: placeholder content only.**
**GitHub repo: NOT created yet.**

## Key Files

| File | Purpose |
|---|---|
| `app/src/content/episodes.js` | **Edit this to add real episode data** (title, description, duration, emoji, audioFile filename) |
| `app/src/lib/auth.js` | Login + token storage + audio URL fetching |
| `app/src/App.jsx` | Auth gate — renders WelcomeScreen or MainPage based on localStorage token |
| `app/src/components/WelcomeScreen.jsx` | Password entry screen |
| `app/src/components/MainPage.jsx` | Fetches audio URLs on mount, renders episode cards |
| `app/src/components/EpisodeCard.jsx` | Inline audio player per episode; `THEMES` object at line 4 maps theme names to colors |
| `app/.env.example` | Copy to `.env.local`, fill in `VITE_WORKER_URL` |
| `worker/src/index.js` | Cloudflare Worker — `/auth` and `/audio-urls` endpoints |
| `worker/wrangler.toml` | Worker config + R2 binding (`R2_BUCKET` → bucket `commonplace-gossip-audio`) |
| `docs/technical-requirements.md` | Full tech decisions |
| `docs/app-flow.md` | Full app flow decisions |

## Unused Boilerplate (safe to delete)
- `app/src/App.css` — not imported anywhere
- `app/src/assets/` — react.svg, vite.svg, hero.png not used

## Next Steps (in order)

### 1. Deploy Cloudflare Worker + R2
```bash
cd worker
npm install -g wrangler
wrangler login
# Create the R2 bucket:
wrangler r2 bucket create commonplace-gossip-audio
# Deploy the worker:
wrangler deploy
# Set secrets (Cloudflare will prompt for values):
wrangler secret put PASSWORD        # the shared password for the site
wrangler secret put TOKEN_SECRET    # any long random string, e.g. openssl rand -hex 32
wrangler secret put ALLOWED_ORIGIN  # GitHub Pages URL once known, e.g. https://username.github.io
```

### 2. Wire up the React app
```bash
cp app/.env.example app/.env.local
# Edit .env.local — set VITE_WORKER_URL to the deployed worker URL
# (shown after `wrangler deploy`, format: https://commonplace-gossip.{subdomain}.workers.dev)
```

### 3. Upload audio files to R2
- Go to Cloudflare dashboard → R2 → `commonplace-gossip-audio` bucket
- Upload the 4 MP3 files
- Filenames must exactly match `audioFile` in `app/src/content/episodes.js`

### 4. Fill in episode content
Edit `app/src/content/episodes.js` — replace all placeholder values with real titles, descriptions, durations, and audio filenames.

### 5. Create GitHub repo + deploy
```bash
cd app
# Create a new private repo on GitHub (e.g. "cg-[hername]")
git init && git add . && git commit -m "init"
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```
Set `VITE_BASE_PATH=/repo-name/` in the GitHub Actions environment (or in `.env.production`), then set up GitHub Pages to deploy from the `dist/` output via GitHub Actions:
```yaml
# .github/workflows/deploy.yml — standard Vite + GitHub Pages action
# build command: npm run build
# publish dir: app/dist
```

### 6. Episode artwork (deferred)
Once stories are finalized, generate artwork per episode using an image generation tool (DALL·E, Midjourney, etc.) based on each story summary. Upload to R2 or bundle in the app, then swap the `emoji` field in `episodes.js` for an `imageUrl`.

## Design Tokens (from `ux-plans/moodboard.md`)
| Name | Hex | Usage |
|---|---|---|
| Electric Blue | #1A5FFF | Primary, play buttons, header bg |
| Gossip Green | #00A870 | Secondary, progress bars |
| Periwinkle | #6B5AFF | Tertiary, episode 03 accent |
| Honey Gold | #F5B800 | Episode 04 accent |
| Sky Tint | #C8DFFF | Welcome screen bg, episode 01 art |
| Mint Tint | #B8F0DC | Episode 02 art |
| Lavender Tint | #E0DBFF | Episode 03 art |
| Midnight | #0A1628 | Body text, page bg behind phone |
| Page bg | #F0F7FF | Main page background |
