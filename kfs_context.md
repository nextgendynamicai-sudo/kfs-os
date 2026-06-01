# KFS Core Next.js System - Implementation Context

This document outlines the standard Web APIs, interactive simulation features, and high-fidelity placeholders integrated into the **Kreatek Flow Systems (KFS) Core** application migrated to Next.js.

---

## 1. Web Camera & QR Code Scanning System

### Production API Integration
The `VendedorDashboard` implements standard HTML5 Media Devices to request camera access:
* **API**: `navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })`
* **Target Stream**: Mounted directly onto a React `useRef` pointing to an HTML5 `<video>` tag for live rendering.

### High-Fidelity Simulator & Placeholder
In restricted environments (such as remote containers, sandboxes, or desktops without a web camera connected), calling the camera API will reject. To ensure **perfect functionality and a stunning demo experience**, the scanner view falls back to a gorgeous **Interactive QR Scanner Simulator**:
1. **Interactive Demo Overlay**: Renders a glowing camera viewframe with target brackets and a horizontal scanning laser animation.
2. **Product Scanner Simulation**: Renders a dropdown list of products in the inventory that the user can select to **"Simulate Scan"**. Clicking it triggers a mock success scan event, calling `processPurchase(product)` instantly to update client balances and commission flows.
3. **Manual Backup Code Entry**: Allows testing the transaction lifecycle manually by typing a product ID.

---

## 2. Persistent Storage (Restricted Environments Guard)
* **API**: `localStorage`
* **Iframe Guard / Volatile Memory Fallback**: Since third-party contexts or secure preview iframes can block `localStorage` access (throwing security errors), the application wraps all state initializations and updates in robust `try/catch` statements. If blocked, state transparently falls back to safe volatile React memory, preventing system crashes.

---

## 3. Marketplace & Transaction Operations
* **Product Catalog**: Lists all uploaded products in the central `MarketplaceView`.
* **Instant Checkout**: Integrates with the core `processPurchase()` pipeline to calculate system-wide commissions:
  * Collects a **$0.04 USD** fee per transaction.
  * Dynamically converts this fee into **EUR** using the current BCV (Banco Central de Venezuela) exchange rate.
  * Directs the commissions to the Architect (`kreatekCore.earningsEUR`).
  * Directs setups commissions to promotoras (**$32.50 USD** equivalent in **EUR**).
