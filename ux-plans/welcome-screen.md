# Welcome Screen

## Copy
- **Eyebrow**: "A Defector Defection" (nod to Defector Media without using their branding)
- **Headline**: "Commonplace Gossip" ("Commonplace" as a synonym for "Normal" — in-joke for podcast fans)
- **Subtitle**: "A Very Special Birthday Edition"
- **Body**: "A bunch of your closest friends submitted their pettiest and lowest-stakes stories you've ever heard, with the shared goal of giving you a nice birthday laugh. Enjoy!"
- **Password placeholder**: "enter the password..."
- **Submit button**: "Let me in"

## Layout
- Mobile-first, designed for 390×844 (iPhone Pro dimensions)
- Two anchored sections: copy pinned to top, password input pinned to bottom
- Breathing room between the two sections — nothing crowded

## Visual
- Background: Sky Tint (#C8DFFF)
- Decorative blobs (Electric Blue, Gossip Green, Periwinkle) at low opacity — adds depth without clutter
- Headline in Midnight (#0A1628), "Gossip" in Electric Blue (#1A5FFF)
- Subtitle in Periwinkle (#6B5AFF)
- Green divider bar between subtitle and body copy
- Password field: white pill, Electric Blue border, focus state shifts to Periwinkle
- Submit button: Electric Blue pill, full width

## Error State
- Inline error message below the submit button: "Incorrect password — try again."
- Input shakes on wrong password (CSS keyframe animation)
- No page change, no redirect
