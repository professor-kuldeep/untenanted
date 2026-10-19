> **Fresh repo / empty Supabase database:** Start with [`SETUP-QUICKSTART.md`](SETUP-QUICKSTART.md). Deployment rollback and database recovery are different operations; see [`ROLLBACK-AND-RECOVERY.md`](ROLLBACK-AND-RECOVERY.md). No legacy upgrade scripts are included.

# Untenanted Heart CMS V4

Current audited build: **4.0.3**

Untenanted Heart V4 is a Vercel-ready editorial, community, member and SEO publishing platform built with Next.js, Supabase and React.

V4 keeps the premium public website and V3 member/community features, while adding a much stronger CMS and technical SEO layer.

## Runtime

- Node.js 24.x
- Next.js 16.4.2
- React 19.3.1
- Supabase SSR 0.12.7
- Supabase JS 2.118.0
- Vercel deployment
- Supabase database, Auth and Storage

Next.js 16 uses `proxy.js` rather than the deprecated `middleware.js` convention. V4 has already been migrated.

## V4 highlights

### SEO Control Center
Admin route: `/admin/seo`

Includes:
- SEO health scoring for posts
- title and meta-description length checks
- focus keyword checks
- image and content completeness checks
- noindex visibility
- page and collection audits
- global SEO settings
- links to sitemap, robots, RSS and llms.txt

### Per-post SEO
Posts support:
- SEO title
- meta description
- focus keyword
- secondary keywords
- breadcrumb label
- canonical URL
- Open Graph title, description and image
- Twitter/X title, description and image
- index/noindex
- follow/nofollow
- Article / BlogPosting / NewsArticle schema selection
- FAQ content and FAQ structured data
- emotion tags
- reusable search tags
- featured-image alt text

### Page SEO
Topic pages, custom pages and collections support:
- custom SEO title and description
- canonical
- OG/social metadata
- breadcrumb title
- index/noindex
- follow/nofollow
- schema type
- FAQ fields where supported

### Search-engine infrastructure
Automatically generated:
- `/sitemap.xml`
- `/robots.txt`
- `/feed.xml`
- `/llms.txt`
- canonical metadata
- Open Graph metadata
- Twitter/X metadata
- Organization schema
- WebSite schema
- Article schema
- BreadcrumbList schema
- CollectionPage/WebPage schema
- FAQPage schema when FAQs are present

### Redirect Manager
Admin route: `/admin/redirects`

Supports:
- 301, 302, 307 and 308 redirects
- enabled/disabled rules
- notes
- hit counts
- last-hit timestamp
- automatic 301 creation when a post slug changes

Redirects are resolved before normal routing through `proxy.js`.

### Taxonomy Manager
Admin route: `/admin/taxonomies`

Manage:
- categories
- emotions
- tags
- descriptions
- SEO titles/descriptions
- indexable status
- sorting and enable/disable state

Public indexable taxonomy routes include:
- `/emotion/<slug>`
- `/tag/<slug>`

### SEO Manager role
V4 adds a dedicated `seo_manager` role.

SEO Managers can:
- access SEO Control Center
- update SEO-only fields through restricted database RPCs
- manage redirects
- manage taxonomies
- access audience analytics

They do not receive general page-builder, theme or article-body editing permissions.

### Trash and recovery
Admin route: `/admin/trash`

Posts now use soft deletion. Deleting a post moves it to Trash rather than permanently removing it immediately.

### Visible breadcrumbs
Public article, topic, tag, emotion, collection and custom pages can display breadcrumb navigation matching their structured data.

### Better CMS dashboard
The dashboard now surfaces:
- live CMS posts
- drafts
- review queue
- scheduled posts
- moderation queue
- media count
- active redirects
- indexable taxonomies
- direct access to SEO Control Center

## Existing platform features retained

V4 keeps the previous platform features:
- premium public website redesign
- responsive mobile site
- member accounts
- saved reflections
- personalized For You feed
- reactions and reporting
- block-based article editor
- Media Library
- homepage builder
- custom page builder
- topic-page editor
- site design/navigation controls
- Letters Never Sent CMS
- community moderation
- story submission moderation
- story submission to draft workflow
- newsletter centre
- collections/series
- daily reflections
- editorial workflow
- internal editorial comments
- scheduling
- revision history
- audit log
- audience analytics
- content-gap signals
- PWA foundation

## Main public routes

- `/`
- `/stories`
- `/stories/<slug>`
- `/healing`
- `/relationships`
- `/self-worth`
- `/midnight-thoughts`
- `/letting-go`
- `/starting-again`
- `/emotion/<slug>`
- `/tag/<slug>`
- `/collections/<slug>`
- `/letters`
- `/community`
- `/daily`
- `/search`
- `/saved`
- `/for-you`
- `/account`
- `/account/login`
- `/submit-message`
- `/submit-story`
- `/<custom-page-slug>`

## Main CMS routes

- `/admin`
- `/admin/posts`
- `/admin/workflow`
- `/admin/calendar`
- `/admin/seo`
- `/admin/redirects`
- `/admin/taxonomies`
- `/admin/trash`
- `/admin/media`
- `/admin/pages`
- `/admin/custom-pages`
- `/admin/homepage`
- `/admin/site`
- `/admin/letters`
- `/admin/collections`
- `/admin/daily`
- `/admin/community`
- `/admin/submissions`
- `/admin/newsletter`
- `/admin/analytics`
- `/admin/revisions`
- `/admin/activity`
- `/admin/users`

## Fresh installation

1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Create `untenantedheart@gmail.com` in Supabase Authentication.
4. Run `credentials/FIRST-SUPER-ADMIN.sql`.
5. Add the environment variables from `.env.example` to Vercel.
6. Push the project to GitHub.
7. Import the repository into Vercel.
8. Confirm Node.js 24.x and Next.js are detected.
9. Deploy.
10. Sign in at `/admin/login`.

## Upgrade from V3/V3.2/V3.2.1

1. Back up Supabase.
2. Deploy the V4 code only after the database migration is ready.
3. Run `supabase/upgrade-v3-to-v4.sql` once.
4. Run `supabase/schema.sql` afterward to refresh the full schema, functions, policies and seed settings.
5. Add any missing Vercel environment variables.
6. Deploy V4.
7. Open `/admin/seo` and review the initial SEO health report.
8. Review `/admin/taxonomies` and decide which emotion/tag archives should be indexable.
9. Review `/admin/redirects` for legacy URLs.

See `V4-UPGRADE.md` and `DEPLOYMENT-CHECKLIST.md` for the detailed sequence.

## Environment variables

Required:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ANALYTICS_SALT=use-a-long-random-secret
```

Optional newsletter/test-email values:

```text
RESEND_API_KEY=
NEWSLETTER_FROM=Untenanted Heart <hello@your-domain.com>
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` with a `NEXT_PUBLIC_` prefix.

## Validation commands

```bash
npm run check:env
npm run seo:audit
npm run build
```

The `prebuild` script automatically runs the project integrity checker before Next.js builds.

## Credential handoff

`credentials/CREDENTIALS-TEMPLATE.txt` is prefilled with:

`untenantedheart@gmail.com`

Do not commit completed credentials to GitHub. Save the completed file as `CREDENTIALS-PRIVATE.txt`; that filename is already ignored by Git.


## V4.0.3 audit note

V4.0.3 refreshes deployment checks, updates the service-worker cache namespace, strengthens secret-file ignores, and corrects stale V3 labels in setup tooling. The project intentionally does not ship generated secrets. A `package-lock.json` is not included because the full npm install could not be completed in the packaging environment; after the first successful local install, commit the generated lockfile for maximum reproducibility.
