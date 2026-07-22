# Godwin Bassey — Portfolio

Premium personal portfolio + CMS. Next.js 14 (App Router) + TypeScript
+ Tailwind + Framer Motion, Supabase backend (Postgres, Auth, Storage).

## Status
- **Supabase: fully set up and verified.** Schema, RLS, storage buckets,
  and seed content are live on project `iakykmfwvjgmetrjkrii`. Security
  and performance advisors are clean (remaining warnings are confirmed
  intentional — see comments in migrations 0004–0010).
- **Frontend: code-complete, not yet deployed.** Three Vercel build
  attempts surfaced and fixed real TypeScript issues (documented in
  `lib/supabase/server.ts` and `types/database.types.ts`). The last
  known remaining bug (`uploadResume` return type) is fixed in this
  copy. Not yet verified against a real `npm install && next build` —
  do that once before deploying.

## Setup
```bash
npm install
cp .env.local.example .env.local   # or edit .env.local directly
```
Fill in `NEXT_PUBLIC_SUPABASE_ANON_KEY` (get it from Supabase dashboard
→ Project Settings → API, or ask for it again).

```bash
npm run build   # verify it's clean before deploying
npm run dev
```

## Deploying
1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import Git Repository**.
3. Set env vars in Vercel (Project Settings → Environment Variables):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `NEXT_PUBLIC_SITE_URL`. `RESEND_API_KEY` / `CONTACT_NOTIFY_EMAIL` /
   `NEXT_PUBLIC_GA_ID` are optional.
4. Deploy. Every future fix is just a `git push` — no more re-uploading
   the whole tree.

## First admin login
1. Create the account either via Supabase Dashboard → Authentication →
   Users → Add user, or by signing up at `/admin/login` once deployed.
2. That triggers `handle_new_user`, which creates a `profiles` row with
   role `editor`.
3. Promote to admin (run in Supabase SQL editor, or ask me):
   ```sql
   update profiles set role = 'admin' where id = '<their auth.users id>';
   ```

## Architecture notes
- `app/(public)/` — public site, own layout (Cursor/PageLoader/Nav/
  Footer/analytics), so `/admin` never ships that JS.
- `app/admin/(protected)/` — auth-guarded CMS. Every content module
  (Projects, Insights, Services, Skills, Achievements, Certifications,
  Experience, Education, Testimonials, SEO) is served by **one**
  generic CRUD route driven by `lib/admin/entity-configs.ts` — adding
  a new module means adding a config entry, not new route files.
- `lib/supabase/server.ts` / `client.ts` — deliberately **untyped**
  Supabase clients. A hand-authored `Database` generic caused every
  table's Row type to collapse to `never` on real builds, even with
  Insert/Update/Relationships all present — root cause undiagnosed
  without local `tsc`. Untyped trades away compile-time row safety in
  exchange for a build that actually works; revisit once
  `supabase gen types` can run against the real project locally.
- `supabase/migrations/0001–0010` — full schema, RLS, seed content,
  and two rounds of security hardening, applied in order.

## Known gaps (honest, not hidden)
- No image picker in Projects/Insights admin forms — cover images,
  galleries, and before/after all reference `media` by ID in the
  schema, but there's no UI to attach them yet.
- No rich text editor for `insights.content` — still hand-authored
  JSON blocks.
- No Lighthouse/axe run actually performed.
- Frontend build not verified locally since the last fix — run
  `npm run build` once before trusting it fully.
