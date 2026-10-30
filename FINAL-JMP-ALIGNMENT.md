# V5.2 Final JMP Alignment

Untenanted Heart V5.2 adopts the relevant operational patterns from the final JMP CMS while keeping the Untenanted Heart product independent and purpose-built for publishing, emotional content, members and community.

## Added from the JMP operational pattern

- Polished sticky admin shell with grouped navigation and responsive behavior
- Traffic dashboard with visits, visitors, pages, sources, campaigns and devices
- UTM/referrer attribution through public conversion points
- Analytics consent controls and privacy-preference reset
- GA4 connection controls and optional server-side reporting
- Google Search Console property controls and optional server-side reporting
- Security Center
- TOTP authenticator MFA
- Session controls
- Password management / reset flow
- Safe and Full backups with Super Admin restore
- System Health monitoring and public non-secret health endpoint
- CSV traffic export
- Stronger operational dashboard shortcuts

## Intentionally not copied

JMP-specific accounting, tax, enquiry CRM, appointment, client portal and business-service modules are not included because they do not belong to the Untenanted Heart product.

## Privacy model

First-party analytics use an anonymous browser identifier which is hashed server-side using `ANALYTICS_SALT`. The tracker does not intentionally store raw IP addresses. Optional GA4 is loaded only after analytics consent when consent is required.

## Google reporting credentials

GA4/GSC API credentials are server-only Vercel environment variables. The Google service-account private key is never stored in public site settings or delivered to the browser.
