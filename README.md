# Creative Solace — Website

## First-time setup (run once)

```bash
# 1. Install dependencies
npm install

# 2. Set up the D1 database (run once)
npx wrangler d1 execute creative-solace-db --remote --file=schema.sql

# 3. Add secret environment variables to Cloudflare
npx wrangler secret put STRIPE_SECRET_KEY
# paste: sk_live_51TVx4IC1ZOnsxU8k...

npx wrangler secret put POSTMARK_TOKEN
# paste: 8bc816dd-cb96-4e1a-a496-...

npx wrangler secret put NOTION_TOKEN
# paste: ntn_490619834019rENy...

npx wrangler secret put POSTMARK_FROM
# paste: hello@creativesolace.com

npx wrangler secret put NOTION_BOOKINGS_DB
# paste: 35db6c5274a98055b938c156e7a69139

npx wrangler secret put NOTION_B2B_DB
# paste: 35db6c5274a980c3990fdea69fb91611
```

## Local development

```bash
npm run dev
```

## Deploy

Just push to GitHub — Cloudflare Pages auto-deploys.

```bash
git add .
git commit -m "your message"
git push
```

## CMS (for your girlfriend)

Go to: `https://creativesolace.com/keystatic`
Login with GitHub → edit events, workshops, products, testimonials.
