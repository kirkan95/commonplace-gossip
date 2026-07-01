# Main Page

## Layout
- Mobile-first, 390px wide
- Sticky header at top, episode list scrolls below
- No logout button, no navigation

## Header
- Background: Electric Blue (#1A5FFF) with decorative blobs (Gossip Green, Periwinkle) at low opacity
- Eyebrow: "A Defector Defection" in Mint (#B8F0DC)
- Title: "Commonplace Gossip" in white, bold 900 weight
- Subtitle: "A Very Special Birthday Edition" in Sky Tint (#C8DFFF)

## Episode Cards
- White card, 20px border radius
- Each card has a color theme (blue, green, purple, gold) applied to: art background, episode number, play button
- Card order reflects episode order (1–4)

### Card anatomy (top to bottom):
1. **Art + info row**: 72×72px colored square (emoji placeholder, generative art TBD), episode number, title, duration + position meta
2. **Description**: Short italic teaser line, 1–2 sentences
3. **Divider**
4. **Player**: Progress bar (colored per theme) → controls row (« 15s · play/pause · 15s » · timestamp)

## Episode Artwork
- Placeholder: themed emoji per card
- Final: AI-generated per story — to be done after implementation once story summaries are available

## Player
- Inline per card, no modal or full-screen takeover
- Progress bar: 4px tall, colored per card theme, green default
- Play/pause button: 44px circle (meets mobile touch target minimum)
- Skip buttons: ±15 seconds
- Timestamp: monospace, current / total

## Color Themes per Episode
| Episode | Art bg | Accent | Play btn |
|---|---|---|---|
| 01 | Sky #D0EAFF | Electric Blue | #1A5FFF |
| 02 | Mint #B8F0DC | Gossip Green | #00A870 |
| 03 | Lavender #E0DBFF | Periwinkle | #6B5AFF |
| 04 | Gold #FFF3C0 | Honey Gold | #F5B800 |
