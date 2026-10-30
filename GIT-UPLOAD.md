# Git Upload — Untenanted Heart CMS V5.2

Upload the **contents** of this package to the root of the GitHub repository. Do not upload the ZIP as the application itself and do not nest the project inside another folder.

The repository root should directly contain `package.json`, `app`, `components`, `lib`, `public`, `scripts`, `supabase`, `next.config.mjs` and `proxy.js`.

Commit and push to `main`, then confirm Vercel deploys the new commit hash.

Expected Vercel package/build line:

`untenanted-heart-cms-v5@5.2.0 build`

followed by:

`next build`

There is no automatic prebuild verifier.
