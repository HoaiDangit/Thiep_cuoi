# Deployment — 2026-10-12

- Website: https://thiep-cuoi.thiep-hy-danglnh3264.workers.dev
- Admin login: https://thiep-cuoi.thiep-hy-danglnh3264.workers.dev/login
- Source repository: https://github.com/HoaiDangit/Thiep_cuoi
- Deployed application source: b9da2a0525702b2b77ffa223213b23ce14a01c42.
- Cloudflare Worker: thiep-cuoi.
- D1: thiep-cuoi-db, c9568aa3-bc02-4bab-9908-cf70df85b29a, APAC (served by SIN in verification).
- All three migrations applied to production. Data is separate from thiep-hy-db.
- Administrator password is stored as the Worker secret ADMIN_PASSWORD. The private handoff file is local only at cloudflare-app/.wrangler/admin-credentials.txt; it is excluded from GitHub.
- HTTPS end-to-end verification passed: login, HttpOnly/Secure cookies, upload, save wedding, personalized 40-day guest links, retry without duplication, reload saved list, rename without extending expiry, revoke, logout and denial of revoked session. Ten unit tests and TypeScript passed; GitHub CI Check source passed.
- Disposable production test records were removed. Verified weddings=0, guests=0, photos=0, admin_sessions=0 afterward; site remains available and protected APIs return 401 anonymously.
- The local Wrangler simulator intermittently delayed requests with a revoked cookie. The same full test on the deployed HTTPS Worker passed in under three seconds. Browser/device visual QA is still outstanding.
- First deployment used the artifact built from the GitHub application commit. Automatic future deployments are not enabled yet: repo secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are missing; current OAuth permissions cannot access Cloudflare Builds (403). The GitHub deploy workflow reports a notice and skips deployment until secrets are configured. See DEPLOY_GUIDE_VI.md.
