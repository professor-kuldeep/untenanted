# Rollback and recovery: fresh GitHub repo + empty Supabase database

## Initial launch

A brand-new repository and Vercel project have **no previous deployment**. You cannot use Vercel rollback until you have at least one earlier successful deployment.

For a reproducible baseline, tag a known-good commit after launch:

```bash
git tag baseline-v4.0.3
git push origin baseline-v4.0.3
```

## Rolling back ONLY website code (after multiple deployments)

- In Vercel > Project > Deployments, identify the last working deployment and use the platform's available Promote/Rollback action, if present.
- Or use Git to revert faulty commits, commit the reversion and push to trigger a new deployment. Example: `git revert <bad-commit-sha>` followed by `git push origin main`.
- This **does not undo database changes**, user-generated content, or Supabase Auth/Storage updates.
- If a DB migration was applied, do not blindly restore an earlier app version unless its code remains compatible with the current schema.

## Database backups and restoration

- The `supabase/schema.sql` file is an **initialization script**, NOT a point-in-time backup.
- Before future schema changes, export/back up the Supabase database and verify your plan's restoration options. Back up Storage files separately where necessary.
- For recovery, restore a verified backup to an appropriate project and carefully reconfigure environment variables; do not assume Vercel rollback restores data.
- On initial deployment with a brand-new **empty** database, no old database migrations or legacy rollback scripts are needed.

## Content editing / CMS revisions

The CMS includes revision/history and Trash interfaces. They are **content-level recovery**, distinct from deployment rollback. Availability of recoverable revisions depends on what has actually been saved to Supabase. With a fresh DB, there are no previous posts or revisions to recover.
