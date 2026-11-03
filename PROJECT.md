# Project: KFS OS Comprehensive Audit, UI/UX Optimization & Offline Hardening

## Architecture
- **Framework & Core**: Next.js 16.2.6 (Turbopack, App Router), React 19.2.4, TypeScript (strict mode, target ES2017).
- **Mobile Container**: Capacitor Android (v5.7.0 / v6 / PWA), responsive web views tailored for mobile viewports (specifically Samsung Galaxy S25 Ultra: 412 x 915).
- **Storage & State Engine**:
  - Primary in-memory: React Context (`KFSContext.tsx`) with monolithic multi-collection database (`clients`, `products`, `transactions`, `customers`, `promotoras`, `riders`, `vendedores`, `vales`, `auditLogs`, `zReports`, `orders`).
  - Primary offline storage: IndexedDB (`kfs_os_db_prod` in `KFS_OS_OFFLINE_DB`), LocalStorage migration and crash-safe fallback.
  - Cloud synchronization: Supabase (`kfs_store_states` and relational dual-schema tables) with WebSocket real-time pubsub and fallback polling.
  - Offline Engine & PWA: Service Worker (`public/sw.js`), `PwaUpdater.tsx`, and offline preloads.
- **Testing Architecture**:
  - Playwright E2E suite (`@playwright/test`), 118 existing tests across 14 specs in `e2e/`.
  - Dedicated isolated testing port (`PORT=3005`) to prevent collisions with external processes.

## Feature Inventory
| # | Feature / Remediation Item | Description | Milestone | Source |
|---|-----------------------------|-------------|-----------|--------|
| 1 | Linter error cleanup in `KFSContext.tsx` | Fix 3 `prefer-const` errors on lines 1364, 1368, 1375 (`let list` -> `const list`). | M1 | explorer_survey_1 |
| 2 | ESLint ignore rule correction | Change `build/**` to `builds/**` in `eslint.config.mjs` to stop scanning Android build node_modules and avoid out-of-memory. | M1 | explorer_survey_3 |
| 3 | IndexedDB Boot Timeout Fix (Regla 1) | Increase boot race timeout from 1.5s to 8s; add LocalStorage emergency recovery before setting `isDataLoaded(true)`; prevent factory state from overwriting real user offline data. | M1 | explorer_survey_1 |
| 4 | Upgrade to Baseline Data Loss Fix (Regla 1) | Include `topups`, `fiscalLogs`, `crm` in `upgradeToNewBaseline()`; support fallback item keys in `mergeAdditive`. | M1 | explorer_survey_1 |
| 5 | Infinite Reload Loop on Remote Wipe Version | Prevent `window.location.reload()` infinite loop in `KFSContext.tsx` when `remoteVersion > CURRENT_WIPE_VERSION`. | M1 | explorer_survey_1 |
| 6 | Unhandled Promise Rejection in Supabase Polling | Add `.catch()` handler to `KFSContext.tsx:1067` Supabase state polling to eliminate console crashes when connection drops. | M1 | explorer_survey_3 |
| 7 | Next.js 16 Proxy Migration | Migrate deprecated `src/middleware.ts` to `src/proxy.ts` (or standard Next.js 16 conventions) to eliminate build warning. | M1 | explorer_survey_1 |
| 8 | Playwright Port Collision Isolation | Update `playwright.config.ts` to use dynamic/isolated port (default 3005) and remove blind reuse of port 3000. Add `npm test` script. | Test Infra | explorer_survey_1 |
| 9 | Navbar Horizontal Overflow (412px Viewport) | Fix `Navbar.tsx` flex layout (~525px) on mobile viewports (<640px) so logo and controls fit cleanly without overflowing screen width. | M2 | explorer_survey_2 |
| 10 | RiderDashboard Tab Navigation Restoration | Add interactive tab navigation bar for the 4 states (`overview`, `deliveries`, `pago`, `docs`) in `RiderDashboard.tsx`. | M2 | explorer_survey_2 |
| 11 | PromotoraDashboard Bottom Tab Clipping | Replace `justify-center` with `justify-start sm:justify-center` on bottom navigation scroll container in `PromotoraDashboard.tsx`. | M2 | explorer_survey_2 |
| 12 | POS Mobile Checkout Bar Android Gesture Collision | Apply `safe-pb` and dynamic safe-area insets (`env(safe-area-inset-bottom)`) to `AxisNitroPOS.tsx` floating checkout bar and mobile cart drawer. | M2 | explorer_survey_2 |
| 13 | Toast Notification Layering Over Bottom Nav | Relocate Toast container to `top-4 sm:top-6` in mobile viewports to avoid overlapping fixed bottom navigation bars. | M2 | explorer_survey_2 |
| 14 | POS Cart Touch Target Accessibility | Expand +/- item count buttons and denomination chips in `AxisNitroPOS.tsx` to minimum 44x44px touch targets. | M2 | explorer_survey_2 |
| 15 | ReceiptModal Ghost Trap Accidental Trigger Guard | Add explicit confirmation dialog/modal before triggering `triggerGhostTrap` on "Anular" button in `ReceiptModal.tsx`. | M2 | explorer_survey_2 |
| 16 | OnboardingWizard Color Contrast WCAG AA | Fix purple-on-purple low contrast text (`text-violet-900` on `bg-violet-600`) to high-contrast white text (`text-white`). | M2 | explorer_survey_2 |
| 17 | CoreDashboard Deep Navigation Back Buttons | Add back navigation buttons and breadcrumb context to deep subviews (`kyc`, `vista_dios`, `db_manager`, `rewards`, `sales_landing`). | M2 | explorer_survey_2 |
| 18 | Window.alert / prompt Migration to Toast | Replace disruptive native `alert()` and `prompt()` calls with `showToast()` in `StorefrontCustomizer`, `PushCommandCenter`, `AppEnforcer`, `download-apk`. | M2 | explorer_survey_2 |
| 19 | Offline Service Worker White-Screen Death Loop | In `public/sw.js`, prevent `/_next/` chunk requests from falling back to root HTML (`/`). In `PwaUpdater.tsx`, decouple destructive cache wipe when offline. | M3 | explorer_survey_3 |
| 20 | Rider Simulation High-Frequency Sync Throttling | Throttle or debounce full database serialization to IndexedDB and Supabase cloud during 2-second rider delivery simulation in `KFSContext.tsx`. | M3 | explorer_survey_3 |
| 21 | POS Cart Lookup Optimization ($O(1)$) | Replace linear `cart.find()` with a Map/Set lookup in `AxisNitroPOS.tsx` product catalog loop. | M3 | explorer_survey_3 |
| 22 | Initial Network State Accuracy | Initialize `networkState` in `UIContext.tsx` using `typeof navigator !== 'undefined' ? (navigator.onLine ? 'online' : 'offline') : 'online'`. | M3 | explorer_survey_3 |
| 23 | Capacitor Android Configuration & Permissions | Add missing permissions (`VIBRATE`, `ACCESS_NETWORK_STATE`, `POST_NOTIFICATIONS`) in `AndroidManifest.xml`, configure AMOLED dark theme `#0B0F19`, portrait lock. | M3 | explorer_survey_3 |
| 24 | E2E Testing Suite Verification (Tiers 1-4) | Execute full suite of Playwright E2E tests against KFS OS on isolated port 3005 and ensure 100% pass rate. | Final Milestone | E2E Track |
| 25 | Adversarial Coverage Hardening (Tier 5) | Run adversarial verification on data persistence, offline resilience, and mobile viewport layout stability. | Final Milestone | E2E Track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| Test Infra | E2E Test Suite & Port Isolation | Isolate Playwright on port 3005, configure test runner, verify baseline test suite. | none | DONE |
| M1 | Core Build, Linter & Storage Persistence Hardening | Fix ESLint errors, `eslint.config.mjs`, IndexedDB 8s boot race timeout & local fallback, `upgradeToNewBaseline` collection preservation (Regla 1), Next.js proxy migration. | none | DONE |
| M2 | UI/UX & Mobile Viewport (Samsung S25 Ultra 412x915) | Navbar mobile layout, RiderDashboard tabs, PromotoraDashboard scroll, POS safe-areas & touch targets, Toast position, ReceiptModal guard, Onboarding contrast. | M1 | DONE |
| M3 | Offline Resilience, Capacitor & Performance | Fix `sw.js` chunk fallback + `PwaUpdater.tsx` cache wipe, throttle 2s rider sync, POS $O(1)$ cart lookup, Capacitor permissions/manifest styling. | M1 | DONE |
| Final | 100% E2E Test Pass & Adversarial Hardening | Validate all E2E tests pass cleanly on isolated port, perform adversarial verification and forensic integrity audit. | M1, M2, M3, Test Infra | DONE |
| Report | Production Technical Comprehensive Report | Generate `FINAL_REPORT.md` documenting all audit findings, technical remediations, and verification proofs. | Final | IN_PROGRESS |

## Interface Contracts
### `KFSContext.tsx` ↔ Offline Storage Layer (`src/lib/indexedDB.ts`)
- `getIndexedDBValue("kfs_os_db_prod")`: Promise resolving to stored database or null.
- Timeout guard: Must wait at least 8,000ms before falling back. On failure, fall back to `localStorage.getItem("kfs_os_db_prod")`. If both fail, enter `offlineSafeFallback` mode WITHOUT overwriting IndexedDB with empty initial state.
- `upgradeToNewBaseline(oldDb, baselineDb)`: Must preserve `orders`, `transactions`, `products`, `clients`, `customers`, `promotoras`, `riders`, `vendedores`, `vales`, `auditLogs`, `zReports`, `topups`, `fiscalLogs`, and `crm`.

### `Navbar.tsx` ↔ Mobile Viewport (412x915)
- In viewports < 640px, the navigation bar must never exceed `100vw`. Secondary action icons (search, theme switch) wrap or collapse into a mobile drawer/menu, while logo and primary user/logout controls remain accessible without horizontal scroll.

### `public/sw.js` ↔ `src/components/PwaUpdater.tsx`
- Service worker MUST NOT return `index.html` as fallback for script resources (`/_next/static/chunks/*`).
- `PwaUpdater.tsx` MUST NOT execute `caches.delete()` or force reloads when `navigator.onLine === false`.

## Code Layout
- `src/context/`: Core state contexts (`KFSContext.tsx`, `UIContext.tsx`, `ReceiptContext.tsx`).
- `src/components/`: Primary application UI components and view dashboards.
- `src/components/dashboards/`: Role-specific dashboards (`ClientDashboard.tsx`, `CoreDashboard.tsx`, `PromotoraDashboard.tsx`, `RiderDashboard.tsx`, `VendedorDashboard.tsx`, `CustomerDashboard.tsx`).
- `src/lib/`: Storage engines (`indexedDB.ts`, `offlineSync.ts`, `supabaseSync.ts`, `pushNotifications.ts`, `safeDOM.ts`).
- `public/`: Service worker (`sw.js`), web manifest (`manifest.json`), icons and assets.
- `e2e/`: Playwright end-to-end test specifications.
- `builds/android_rewards/`: Capacitor Android native project files and manifests.
