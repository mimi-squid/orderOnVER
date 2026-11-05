# OrderOn

A mobile-first campus ordering PWA. React 18, TypeScript, Vite, React Router 6, TanStack Query, Zustand, React Hook Form, Zod, Tailwind, Lucide, IndexedDB and Workbox. Playfair Display is self-hosted.

## Run locally

```sh
cd ~/Desktop/orderOnVER
npm install
cp .env.example .env
npm run dev
```

Open the printed URL (normally http://127.0.0.1:5173). Demo mode is the default. Use Node 22+.

```sh
npm run build
npm run preview
npm test
npm run test:e2e
```

If Playwright browsers are absent: `npx playwright install chromium`.

## Try the connected demo

1. Browse Campus Bites and add a dish.
2. Sign up, or log in as **9876543210 / Demo123!**.
3. Choose pickup or a table. Continue to payment and click the explicitly labeled simulation button.
4. Open a **second tab in the same browser profile**. Partner login: **9876543211 / Demo123!**.
5. Accept → Start preparing → Mark ready. The customer tab updates automatically.
6. Admin demo: **9876543212 / Demo123!**.

Demo auth is intentionally simulated: all demo profiles (including newly registered ones) use the shared demo password on subsequent login. User-entered signup passwords are validated but are never stored. Tabs keep separate sessions in sessionStorage, while IndexedDB and BroadcastChannel share business data. Demo mode is not a security boundary and must not contain real customer information. No real payment, SMS or payout occurs.

Demo seed: three eateries, 25 menu items, six tables each, and three illustrative kitchen orders. Clear site storage in your browser to reset. Cart and checkout drafts persist in IndexedDB. Demo business hours are informational so the demo can be exercised at any time; live order creation enforces hours in Asia/Kolkata.

## Implemented

- Landing, search/filter discovery, menu, single-merchant cart, variants, notes, pickup/table checkout, payment and persistent order URLs.
- Customer signup/login, profile editing, order lists, tracking, reorder at current prices, printable receipts.
- Partner registration/review, labeled demo approval, live kitchen board, counter payment confirmation, mute/beep, rush mode and pause.
- Menu editor with image preview/compression, stock controls, settings, soft-deleted tables, table deep links, history and an SVG chart from completed orders.
- Admin merchant approvals/status actions.
- Cross-tab updates, periodic refetch, offline mutation blocking, duplicate creation protection, optimistic version checks, integer paise totals and immutable item snapshots.
- Lazy routes, route error boundaries, self-hosted fonts, PWA precache, image cache and persisted drafts.
- Supabase adapter, SQL migrations with RLS and RPC-only writes, gateway attempt Edge Function, signed/deduplicated atomic webhook handling.

## Live configuration

Frontend variables:

| Variable | Purpose |
| --- | --- |
| `VITE_DATA_MODE` | `demo` (default) or `live` |
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key; never a service-role key |
| `VITE_TURNSTILE_SITE_KEY` | Public captcha site key; production auth integration remains gated |

Server-only secrets: `PAYMENT_KEY_ID`, `PAYMENT_KEY_SECRET`, `PAYMENT_WEBHOOK_SECRET`, `REQUIRE_PHONE_OTP`, `APP_ORIGIN`, and Supabase-provided `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`. Never give secrets a `VITE_` prefix. `.env` is ignored.

```sh
supabase init # only if config.toml has not been created
supabase start
supabase db reset
# To deploy to an existing project:
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase functions deploy create-payment-attempt
supabase functions deploy payment-webhook --no-verify-jwt
supabase functions deploy delete-account
# Configure server secrets using the Supabase dashboard or CLI.
```

Configure Razorpay to send captured, failed and refund-processed events to `payment-webhook`. Its endpoint bypasses JWT because Razorpay does not send a user JWT; it verifies the raw-body HMAC instead. Never bypass HMAC verification. Payment attempts use server totals and an exclusive database claim. An interrupted provider request leaves a pending claim for reconciliation rather than blindly creating another gateway order. Deploy an operational reconciliation job before launch. A UPI deep link is not proof of payment.

Enable Supabase phone/password authentication, an SMS provider, captcha and auth rate limits. SQL validates order data independently of the frontend. Promote admins manually from a trusted SQL console; never from signup metadata. `seed.sql` seeds only the campus directory, not live credentials. New business owners register through verified Auth; admin approval is required.

Deploy `dist/` to a static HTTPS host with all non-file paths rewritten to `/index.html`. Build with live env variables to include the live adapter. Configure the auth redirect URLs and `APP_ORIGIN` for your host. HTTPS (or localhost) is required for service workers and Web Locks.

## Verification and remaining launch work

The demo golden path and responsive landing widths (320, 360, 390, 768, 1024, 1440) are automated in Playwright. Unit tests cover legal/illegal transitions, money/tax rounding, input validation, single-merchant carts and price/stock/variant revalidation. Additional browser tests cover duplicate creation, stale updates, cross-tab stock and offline checkout.

**This is a working demo and backend foundation, not a production-ready release.** The following requirements still need production work:

- Live signup currently fails closed until Turnstile, OTP expiry/resend/recovery and provider settings are connected. Remember-me and Google login are not offered.
- No production Supabase project or gateway credentials were supplied. Migrations, RLS, Edge Functions, provider callbacks and live reconnect behavior have not been integration-tested against deployed services.
- Merchant gateway onboarding, automated refunds, payment exception management, full campus administration and the admin audit-log viewer are not complete.
- Account deletion in live mode currently anonymizes the profile and bans access while retaining transaction records. Full legal erasure/retention and Auth identity removal require an operational workflow; do not promise permanent erasure.
- Discovery uses the seeded campus and preparation-time sorting; geolocation does not implement a real nearby radius search. The campus request is recorded in registration for review.
- Optional printable table QR codes are not generated; working per-table links are provided.
- Menu variants use total variant prices; additive multi-select add-ons are not implemented.
- Core PWA shell and demo menus work offline after the first production load. Live menu caching is implemented but unverified against a deployed backend. Installation behavior on each target mobile OS, all-route accessibility audits and Lighthouse/Web Vitals require further validation.
- Current tax is a demonstrative 5% calculation. Configure the applicable business tax rules before launch.
- Restaurant photos are remotely hosted demo images. Use licensed merchant-specific photos for production.

No claims are made for Lighthouse ≥90, LCP/INP/CLS targets, or a complete WCAG audit without measured results. Do not deploy real ordering until these launch requirements are addressed.
