# App Flow

## First Visit
1. User opens the URL
2. **Welcome screen** is shown — a thematic landing page (content TBD in UI/UX phase)
3. User is prompted to enter the shared password
4. **Wrong password:** inline error message + shake animation, stays on same screen
5. **Correct password:** token written to localStorage (30-day expiry), redirect to main page

## Main Page
- Displays header, intro text, and the 4 audio episodes in a podcast-style UI
- Audio streams from Cloudflare R2 via pre-signed URLs (fetched through Cloudflare Worker with valid token)

## Returning Visit (within 30 days)
- Token found in localStorage → skip welcome screen entirely
- User lands directly on the main page

## Returning Visit (after 30 days / token expired or missing)
- Token missing or expired → show welcome screen and password prompt again

## Session End
- No logout button
- Session ends when token expires (30 days) or user manually clears browser storage
