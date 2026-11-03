# KFS OS End-to-End (E2E) Test Infrastructure Documentation

## 1. Overview & Architecture

KFS OS utilizes **Playwright** (`@playwright/test`) for comprehensive, multi-viewport, end-to-end testing of the Next.js 16 / React 19 application. The test suite verifies critical user paths across administrative, merchant, promotora, rider, and customer roles, along with offline storage and POS transactional integrity.

### Key Architectural Decisions
- **Port Isolation (`PORT=3005`)**: On local developer environments and shared host systems, standard port `3000` is frequently occupied by external services. To ensure strict isolation (in compliance with *Regla Infranqueable 2: Strict Context Isolation*), Playwright is configured to run and test against isolated port `3005` by default (`const PORT = process.env.PORT || 3005`).
- **Dedicated WebServer Lifecycle**: The `webServer` block in `playwright.config.ts` launches Next.js production server on the designated port (`npx next start -p 3005`).
- **Safe Server Reuse (`reuseExistingServer: false`)**: Set to `!process.env.CI && false` (or explicitly `false`) to prevent tests from accidentally attaching to an external process or unverified instance running on default ports.
- **Dual-Device Coverage**:
  - `chromium` (Desktop Chrome, 1280x720)
  - `Mobile Chrome` (Pixel 5 mobile profile, evaluating mobile viewports such as Samsung Galaxy S25 Ultra 412x915)

---

## 2. Test Execution & Invocation Commands

All test runs are managed through npm and the Playwright CLI:

### Standard Suite Execution
```bash
# Run all E2E specs across configured projects
npm test

# Equivalent direct Playwright invocation
npx playwright test
```

### Targeted Spec Runs
```bash
# Run smoke tests (quick verification of application boot and branding)
npx playwright test e2e/smoke.spec.ts

# Run with interactive UI mode
npx playwright test --ui

# Run with headful browser for visual debugging
npx playwright test e2e/smoke.spec.ts --headed

# Run specifically against desktop or mobile project
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"
```

### Port Customization
If port `3005` needs to be customized for a specific CI or sandbox environment:
```bash
# Windows PowerShell
$env:PORT="3010"; npm test

# Bash / POSIX
PORT=3010 npm test
```

### Viewing Test Reports
```bash
# View the generated HTML report
npx playwright show-report
```

---

## 3. Test Tier Coverage Structure

The KFS OS test inventory comprises 118 tests across 14 spec files organized into 4 primary tiers plus an adversarial hardening layer:

### Tier 1: Smoke, Core Boot & Navigation
Verifies application bootstrap, route rendering, core branding, and initial authentication/access control flows.
- `e2e/smoke.spec.ts`: Landing page mount, document title (`KFS OS`), header branding presence.
- `e2e/smart_access_flow.spec.ts`: Role-based route redirection, PIN/login gateway, and credential checking.
- `e2e/deep_audit_access.spec.ts`: Deep link resolution, view state persistence, and error boundary handling.

### Tier 2: Role Dashboards & Multi-Actor User Journeys
Exercises dedicated dashboards for all operational actors in the KFS ecosystem.
- `e2e/human_audit_all_roles.spec.ts`: End-to-end workflows for Admin, Merchant (Client), Promotora, Rider, and Customer.
- `e2e/fintech_visual_enhancements.spec.ts`: Fintech metrics, balance displays, commission cards, and transaction history cards.
- `e2e/features_7_6_3_2.spec.ts`: Specialized operational actions, modal views, and contextual actions.

### Tier 3: Transactional Engine, POS & Offline Storage
Validates core commerce capabilities, catalog search, cart operations, and local state persistence.
- `e2e/category_search_select.spec.ts`: POS category filtering, live search queries, item selection, and SKU resolution.
- `e2e/matrix.spec.ts`: Multi-variable pricing matrices, tax calculations, and discount rules.
- `e2e/five_pillars_audit.spec.ts`: Core architectural pillars: IndexedDB persistence, offline synchronization queue, transaction log integrity, and state hydration (*Regla Infranqueable 1*).

### Tier 4: Comprehensive System Audit & Responsive Views
Validates design system tokens, responsive viewports, and strategic features.
- `e2e/complete_audit_suite.spec.ts`: Comprehensive end-to-end regression audit across all subsystems.
- `e2e/navbar_glassmorphism.spec.ts`: Mobile viewport layout (< 640px and 412x915), safe insets, and glassmorphic header behavior.
- `e2e/new_strategic_features.spec.ts`: Promotional vouchers, loyalty rewards, and customer referral tracking.
- `e2e/registration_guide_faq.spec.ts`: Onboarding wizard, interactive FAQ modals, and merchant setup guides.
- `e2e/e2e.spec.ts`: Cross-cutting integration tests.

### Tier 5 (Adversarial Hardening)
Adversarial edge cases, offline network disconnection simulations, and extreme payload handling:
- Offline mode cutoffs (`navigator.onLine = false`).
- Database migration resilience without data loss (`upgradeToNewBaseline`).
- Rapid concurrent transactions and cart mutation stress testing.

---

## 4. Configuration Reference (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || 3005;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI && false,
    timeout: 60000,
  },
});
```
