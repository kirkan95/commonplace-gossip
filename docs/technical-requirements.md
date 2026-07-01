# Technical Requirements

## Hosting
- Frontend: GitHub Pages (static React app)
- Source repo: private GitHub repo
- URL: GitHub Pages default URL (`username.github.io/repo-name`) — intentionally non-custom

## Audio Storage & Protection
- Audio files stored in **Cloudflare R2** (free tier, 10GB limit)
- Files are NOT in the GitHub repo
- Access to audio is gated behind a **Cloudflare Worker** that validates auth before returning pre-signed URLs
- 4 MP3 files, estimated ~100MB total, durations ranging 10–30 min
- Files are clean/production-quality (no special handling needed)
- Files uploaded manually via R2 dashboard (no admin upload UI)

## Authentication
- Single shared password for all users
- On correct password, a token is issued and stored in **localStorage**
- Token expires after **30 days**
- No logout mechanism — session ends naturally or via browser clear
- Wrong password: inline error, no backend session created

## Stack
- React (static SPA)
- Cloudflare Workers (auth + pre-signed URL generation)
- Cloudflare R2 (audio storage)
- GitHub Pages (frontend hosting)
