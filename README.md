# Nirupan Gupta Portfolio

Product-first portfolio for GitHub Pages with an optional Supabase-backed admin CMS.

## Public site

GitHub Pages repository: `nirupangupta.github.io`

Publishing source: `main` / root.

## Admin CMS

Open `/admin/` on the live site. The admin supports:

- Email + password login through Supabase Auth
- Password recovery email
- One authorized admin account through `admin_users`
- Profile/contact editing
- Proof numbers and impact metrics
- Product-thinking/process steps
- Capabilities
- Structured project editor with publish toggles, order, metrics and case-study links
- Career editor with promotions grouped under each company
- Resume replacement via Supabase Storage
- Profile image upload
- Draft → publish workflow
- Version history
- Public site automatically reads the latest published revision, while the bundled content remains as a fallback

### One-time Supabase setup

1. Create a Supabase project.
2. In Authentication > Users, create the single admin email/password account.
3. Run `schema.sql` in Supabase SQL Editor.
4. Copy the Auth user's UUID and run the commented `insert into public.admin_users...` statement in `schema.sql` with your admin email.
5. Put the project URL and **anon/publishable key** into `supabase-config.js`:

```js
window.SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR-PUBLIC-ANON-OR-PUBLISHABLE-KEY"
};
```

Never put a Supabase secret/service-role key in this file. Browser-side Supabase Auth is intended to use the public client key, with access controlled by Auth and RLS.

6. Upload the full package to the root of the GitHub repository.
7. Visit `https://nirupangupta.github.io/admin/` and sign in.
8. Save a draft, review it, then Publish.

### Important

GitHub Pages is static hosting, so it cannot itself securely write files or provide server-side authentication. The admin CMS therefore uses Supabase Auth, Postgres and Storage. If Supabase is not configured, the public site still works using the bundled content.
