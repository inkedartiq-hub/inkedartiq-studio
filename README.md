# InkedArtiq Airbnb Studio — Go-live guide

This folder is a complete, working website. Follow these steps in order.
Total time: 20-30 minutes the first time.

---

## Step 1 — Create your free Supabase project (the database)

1. Go to https://supabase.com → Sign up (free) → "New project"
2. Name it `inkedartiq-studio`, set a database password (save it somewhere), pick a region close to India (Singapore is usually closest)
3. Wait ~2 minutes for it to spin up
4. Once inside the project: left sidebar → **SQL Editor** → **New query**
5. Open `supabase_setup.sql` from this folder, copy all of it, paste into the SQL editor, click **Run**
   - This creates the one table the app needs (`app_storage`)
6. Left sidebar → **Project Settings** → **API**
   - Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
   - Copy the **anon public** key (long string starting with `eyJ...`)

## Step 2 — Add your keys locally

1. In this folder, copy `.env.example` to a new file named `.env`
2. Paste your Project URL and anon key into it, e.g.:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
3. Save. Never commit this `.env` file to GitHub (it's already in `.gitignore`).

## Step 3 — Replace the WhatsApp number

Open `src/App.jsx`, find this line near the top:
```js
const WHATSAPP_NUMBER = "919999999999";
```
Replace it with your real number — country code + number, no spaces, no `+`.
Example for an Indian number `98765 43210` → `919876543210`.

## Step 4 — Test it on your own computer (optional but recommended)

You'll need Node.js installed (https://nodejs.org — get the LTS version).

```bash
cd inkedartiq-live
npm install
npm run dev
```
Open the URL it prints (usually `http://localhost:5173`). Click through every tab,
add a test lead, run a mini-audit — make sure it feels right before going live.

## Step 5 — Put the code on GitHub

1. Go to https://github.com → sign in → **New repository** → name it `inkedartiq-studio` → Create
2. Back in your terminal, inside this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/inkedartiq-studio.git
   git push -u origin main
   ```
   (GitHub will show you these exact commands on the new repo page — you can copy them from there instead.)

## Step 6 — Deploy on Vercel (this makes it a real public website)

1. Go to https://vercel.com → sign up using your GitHub account
2. Click **Add New → Project**
3. Select your `inkedartiq-studio` repo → **Import**
4. Before clicking Deploy, expand **Environment Variables** and add:
   - `VITE_SUPABASE_URL` = (your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)
5. Click **Deploy**. Wait ~1 minute.
6. You'll get a real URL like `inkedartiq-studio.vercel.app` — this is now live and anyone can visit it.

## Step 7 (optional) — Custom domain

If you buy a domain (e.g. from Namecheap, GoDaddy, or directly via Vercel):
Vercel dashboard → your project → **Settings → Domains** → add your domain →
follow the DNS instructions it gives you. Takes a few hours to propagate.

---

## What's still NOT real after this

- **Payments**: the pricing/order screens show packages but don't charge anyone.
  To actually collect money you need a payment gateway — Razorpay is the standard
  choice in India and has a straightforward integration. Tell me when you're ready
  and I'll wire it in as the next step.
- **Your own login**: right now there's no password on this site — anyone with the
  URL can open and edit your dashboard data. Fine while only you use it, but before
  sharing the link widely, ask me to add simple authentication.

## Updating the site after this

Whenever you want to change something:
1. Ask me to edit the code (or edit `src/App.jsx` yourself)
2. ```bash
   git add .
   git commit -m "describe what changed"
   git push
   ```
3. Vercel automatically redeploys within ~1 minute of every push. No extra steps.
