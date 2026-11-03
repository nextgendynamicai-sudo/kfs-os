# E2E Test Suite Ready

## Test Runner
- Command: `npx playwright test` (or `npm test`) on isolated port 3005
- Expected: all tests pass with exit code 0
- WebServer: Launches `npx next start -p 3005` automatically

## Coverage Summary
| Tier | Count | Description |
|------|------:|-------------|
| 1. Smoke, Boot & Navigation | 3 specs (18 tests) | App boot, title, branding, role-based smart access, error boundaries |
| 2. Role Dashboards & Multi-Actor | 3 specs (28 tests) | Admin, Merchant, Promotora, Rider, Customer workflows, fintech metrics |
| 3. Transactional Engine & POS | 3 specs (32 tests) | Category search/filtering, pricing matrix, IndexedDB persistence, pillars |
| 4. System Audit & Responsive Views | 5 specs (40 tests) | 412x915 mobile viewport, glassmorphism, vouchers, FAQ modals, regression |
| **Total** | **14 specs (118 tests)** | Full end-to-end multi-viewport coverage |

## Feature Checklist
| Feature Area | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|--------------|:------:|:------:|:------:|:------:|
| Core Boot & Navigation | ✓ | - | - | ✓ |
| Multi-Actor Dashboards | - | ✓ | - | ✓ |
| Offline & Storage Persistence | ✓ | - | ✓ | ✓ |
| POS & Cart Operations | - | - | ✓ | ✓ |
| Mobile Viewports (412x915) | - | - | - | ✓ |

