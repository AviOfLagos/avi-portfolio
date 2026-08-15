# Figma Community covers

Figma's CDN (`s3-alpha.figma.com` and the hubfile host) returns **403 to any
request that is not from figma.com**, so the covers cannot be hotlinked or run
through the Next image optimiser. They have to be self-hosted here.

## How to add them

1. Open each Community file, right-click the cover image, "Save image as…".
2. Save into this folder using the **exact filename** below (any format —
   .png/.jpg is fine, they get converted to .webp).
3. Tell Claude, and the conversion + wiring happens automatically.

| Save as                                  | Resource                              |
| ---------------------------------------- | ------------------------------------- |
| `tailwind-design-system.png`           | Fully Editable Tailwind Design System |
| `event-ticket-booking-ui.png`          | Event Ticket Booking UI               |
| `wedding-invitations.png`              | Wedding Invitations + Editable Assets |
| `creatives-paykit.png`                 | Creative's Paykit 2.0                 |
| `drop-shadow-calculation.png`          | Mastering Drop Shadow Calculation     |
| `expense-tracker-app.png`              | Expense Tracker App                   |
| `social-media-video-streaming-app.png` | Social Media Video Streaming App      |

Filenames match the `slug` field in `lib/figma-resources.ts`.
