const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Helper to get base64 image or fallback
function getBase64Image(relativePath) {
  try {
    const fullPath = path.resolve(__dirname, '..', relativePath);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/svg+xml';
      const b64 = fs.readFileSync(fullPath).toString('base64');
      return `data:${mime};base64,${b64}`;
    }
  } catch (e) {
    console.warn('Could not read image:', relativePath, e.message);
  }
  return '';
}

const logoKfsB64 = getBase64Image('public/kfs-logo.png');
const logoKreatekB64 = getBase64Image('public/kreatek-logo.jpg');
const heroCardsB64 = getBase64Image('public/hero_cards.png');

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>KFS OS - Libro Maestro & Super White Paper Definitivo 2026</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 18mm 16mm 20mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.55;
      font-size: 10pt;
    }

    /* Page Breaks */
    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Cover Page */
    .cover-page {
      height: 258mm;
      background: linear-gradient(135deg, #090d16 0%, #0f172a 40%, #1e1b4b 100%);
      color: #ffffff;
      padding: 24mm 18mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 0 100px rgba(0,0,0,0.8);
    }

    .cover-page::before {
      content: "";
      position: absolute;
      top: -100px;
      right: -100px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
    }

    .cover-page::after {
      content: "";
      position: absolute;
      bottom: -150px;
      left: -150px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    .brand-pill {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #a5b4fc;
    }

    .status-badge {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .cover-middle {
      position: relative;
      z-index: 2;
      margin: 15mm 0;
    }

    .cover-title-tag {
      color: #fbbf24;
      font-size: 11pt;
      font-weight: 800;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cover-title-tag span {
      display: inline-block;
      width: 28px;
      height: 3px;
      background: #fbbf24;
      border-radius: 2px;
    }

    .cover-h1 {
      font-size: 28pt;
      font-weight: 800;
      line-height: 1.15;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
      text-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }

    .cover-h1 span.gradient {
      background: linear-gradient(90deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 13pt;
      font-weight: 500;
      color: #cbd5e1;
      line-height: 1.4;
      margin-bottom: 22px;
      max-width: 90%;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 14px 18px;
      backdrop-filter: blur(8px);
      margin-top: 10px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      font-size: 7.5pt;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .meta-val {
      font-size: 9.5pt;
      color: #f8fafc;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    .cover-bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      position: relative;
      z-index: 2;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 14px;
    }

    .cover-legal {
      font-size: 7.5pt;
      color: #94a3b8;
      line-height: 1.35;
      max-width: 65%;
    }

    .seal-box {
      text-align: right;
    }

    .seal-stamp {
      display: inline-block;
      border: 2px solid #fbbf24;
      border-radius: 8px;
      padding: 6px 12px;
      color: #fbbf24;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      transform: rotate(-3deg);
    }

    /* Content Styling */
    h2.section-title {
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin-top: 8px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #6366f1;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    h2.section-title .chapter-num {
      background: #4f46e5;
      color: white;
      font-size: 9pt;
      padding: 3px 8px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
    }

    h3 {
      font-size: 11.5pt;
      font-weight: 700;
      color: #1e1b4b;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    h4 {
      font-size: 10pt;
      font-weight: 700;
      color: #334155;
      margin-top: 10px;
      margin-bottom: 4px;
    }

    p {
      margin-bottom: 9px;
      color: #334155;
      text-align: justify;
    }

    /* Callout & Highlights */
    .callout {
      background: #f8fafc;
      border-left: 4px solid #6366f1;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      margin: 12px 0;
      font-size: 9pt;
    }

    .callout-gold {
      background: #fffbeb;
      border-left-color: #f59e0b;
      color: #92400e;
    }

    .callout-emerald {
      background: #ecfdf5;
      border-left-color: #10b981;
      color: #065f46;
    }

    .callout-rose {
      background: #fff1f2;
      border-left-color: #f43f5e;
      color: #9f1239;
    }

    .callout-title {
      font-weight: 700;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 9.5pt;
    }

    /* Metric Cards Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 12px 0;
    }

    .metric-card {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px;
      text-align: center;
    }

    .metric-val {
      font-size: 14pt;
      font-weight: 800;
      color: #4338ca;
      font-family: 'JetBrains Mono', monospace;
    }

    .metric-label {
      font-size: 7.5pt;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 8.5pt;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #e2e8f0;
      padding: 7px 10px;
      text-align: left;
    }

    table.data-table th {
      background: #1e1b4b;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 8pt;
    }

    table.data-table tr:nth-child(even) {
      background: #f8fafc;
    }

    table.data-table tr:hover {
      background: #f1f5f9;
    }

    /* Diagram & Code Box */
    .code-box {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      line-height: 1.45;
      margin: 10px 0;
      border: 1px solid #334155;
    }

    .code-box .kw { color: #f472b6; font-weight: 700; }
    .code-box .str { color: #34d399; }
    .code-box .comment { color: #94a3b8; font-style: italic; }
    .code-box .fn { color: #60a5fa; }

    /* Steps list */
    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 10px 0;
    }

    .step-card {
      display: flex;
      gap: 12px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 9px 12px;
      align-items: flex-start;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .step-num {
      background: #4f46e5;
      color: #ffffff;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      font-weight: 700;
      flex-shrink: 0;
      font-family: 'JetBrains Mono', monospace;
    }

    .step-body {
      flex: 1;
    }

    .step-title {
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }

    .step-desc {
      font-size: 8.5pt;
      color: #475569;
      margin-bottom: 0;
      line-height: 1.4;
    }

    /* Table of contents */
    .toc-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px 16px;
      margin: 16px 0;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #cbd5e1;
      padding-bottom: 4px;
      font-size: 9pt;
    }

    .toc-item .ch-title {
      font-weight: 600;
      color: #1e293b;
    }

    .toc-item .ch-tag {
      color: #4f46e5;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
    }

    /* Badge */
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }
    .badge-blue { background: #e0e7ff; color: #3730a3; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-amber { background: #fef3c7; color: #92400e; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; }

    /* Header & Footer in HTML (Fallback & Visual) */
    .page-header-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 14px;
      font-size: 7.5pt;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .page-footer-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
      margin-top: 18px;
      font-size: 7pt;
      color: #94a3b8;
      font-weight: 600;
    }

    /* Flow diagram visual */
    .flow-diagram {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      margin: 12px 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      text-align: center;
    }

    .flow-node {
      background: #ffffff;
      border: 1.5px solid #6366f1;
      border-radius: 6px;
      padding: 6px 10px;
      width: 18%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }

    .flow-node-title {
      font-size: 8pt;
      font-weight: 700;
      color: #1e1b4b;
    }

    .flow-node-sub {
      font-size: 6.5pt;
      color: #64748b;
    }

    .flow-arrow {
      color: #6366f1;
      font-weight: 800;
      font-size: 12pt;
    }
  </style>
</head>
<body>

  <!-- PORTADA EJECUTIVA -->
  <div class="cover-page">
    <div class="cover-top">
      <div class="brand-pill">KREATEK FLOW SYSTEMS • AXIS NITRO CORE</div>
      <div class="status-badge">● EDICIÓN PRODUCCIÓN V8.0.0</div>
    </div>

    <div class="cover-middle">
      <div class="cover-title-tag">
        <span></span> DOSSIER CORPORATIVO & MANUAL OPERATIVO DEFINITIVO
      </div>
      <h1 class="cover-h1">
        LIBRO MAESTRO <br>
        <span class="gradient">KFS OS 2026</span>
      </h1>
      <p class="cover-subtitle">
        El Sistema Operativo de Crecimiento Comercial (CGOS) Descentralizado para Retail, Punto de Venta Multi-Moneda, Logística de Última Milla y Fuerza de Ventas Expansiva en Mercados Emergentes.
      </p>

      <div class="cover-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Código de Proyecto</span>
          <span class="meta-val">KFS-OS-WP-2026-FINAL-COMMERCIAL</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Holding Propietario</span>
          <span class="meta-val">Kreatek Holding S.A.</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Arquitectura y Motor</span>
          <span class="meta-val">KAN CGOS & Axis Nitro Core</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Código Maestro Arquitecto Core</span>
          <span class="meta-val">199521</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Dominio Oficial en Vivo</span>
          <span class="meta-val">https://axisnitro.store</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Resiliencia y Sync</span>
          <span class="meta-val">Offline-First + Supabase Relational</span>
        </div>
      </div>
    </div>

    <div class="cover-bottom">
      <div class="cover-legal">
        Este documento es propiedad confidencial y estratégica de Kreatek Holding S.A. y Kreatek Developing Software, C.A. Prohibida su copia o alteración. Valorado para inversores institucionales, directores de expansión y fuerza de campo.
      </div>
      <div class="seal-box">
        <div class="seal-stamp">CERTIFICADO OFICIAL<br>100% VENDIBLE</div>
      </div>
    </div>
  </div>

  <!-- PÁGINA 2: TABLA DE CONTENIDOS Y SÍNTESIS -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Estructura del Documento</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">ÍNDICE</span>
    TABLA DE CONTENIDOS GENERAL
  </h2>

  <p>
    El presente Libro Maestro y Super White Paper consolida la totalidad técnica, operativa, financiera y legal del ecosistema <strong>KFS OS (Kreatek Flow Systems)</strong>. Cada capítulo detalla las capacidades del software, sus modelos de monetización, interfaces, algoritmos y protocolos de despliegue en campo.
  </p>

  <div class="toc-grid">
    <div class="toc-item">
      <span class="ch-title">Capítulo I: Resumen Ejecutivo & Dossier para Inversores</span>
      <span class="ch-tag">PÁG. 3</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo II: Arquitectura Tecnológica & Offline-First</span>
      <span class="ch-tag">PÁG. 4</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo III: Módulo del Arquitecto Core & Motor de Cierre</span>
      <span class="ch-tag">PÁG. 5</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo IV: Comercio B2B (Axis Nitro POS & Multi-Tenant)</span>
      <span class="ch-tag">PÁG. 6</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo V: Promotoras & Fuerza de Ventas Expansiva</span>
      <span class="ch-tag">PÁG. 7</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo VI: Clientes, Billetera Universal & Axis Rewards</span>
      <span class="ch-tag">PÁG. 8</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo VII: Logística & Repartidores (Nitro Squad)</span>
      <span class="ch-tag">PÁG. 9</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo VIII: Tokenomics de Puntos Axis & Compensación</span>
      <span class="ch-tag">PÁG. 10</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo IX: Seguridad Operativa, Control Día 5 & Persistencia</span>
      <span class="ch-tag">PÁG. 11</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo X: Hardware Driver Suite & Consola IoT Edge</span>
      <span class="ch-tag">PÁG. 12</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo XI: Manual de Entrenamiento & Guía de Venta</span>
      <span class="ch-tag">PÁG. 13</span>
    </div>
    <div class="toc-item">
      <span class="ch-title">Capítulo XII: Marco Legal, Gobernanza & Conclusión</span>
      <span class="ch-tag">PÁG. 14</span>
    </div>
  </div>

  <div class="callout callout-gold no-break">
    <div class="callout-title">⭐ Principio Rector del Ecosistema KFS OS</div>
    KFS OS sustituye el modelo fragmentado y costoso del comercio tradicional (donde un negocio contrata por separado POS bancario, software de inventario, delivery, programa de lealtad y pasarelas de pago) integrándolos en una matriz unificada de costo marginal casi cero con alta rentabilidad para sus socios.
  </div>

  <!-- DIAGRAMA DE MATRIZ DE VALOR -->
  <div class="flow-diagram no-break">
    <div class="flow-node">
      <div class="flow-node-title">1. ARQUITECTO</div>
      <div class="flow-node-sub">Gobierno, Split & Licenciamiento</div>
    </div>
    <div class="flow-arrow">⇄</div>
    <div class="flow-node">
      <div class="flow-node-title">2. COMERCIO B2B</div>
      <div class="flow-node-sub">POS, Stock, Caja & Vales</div>
    </div>
    <div class="flow-arrow">⇄</div>
    <div class="flow-node">
      <div class="flow-node-title">3. PROMOTORAS</div>
      <div class="flow-node-sub">Demos 5s & Afiliación Viral</div>
    </div>
    <div class="flow-arrow">⇄</div>
    <div class="flow-node">
      <div class="flow-node-title">4. CLIENTES</div>
      <div class="flow-node-sub">Billetera P2P & Axis Rewards</div>
    </div>
    <div class="flow-arrow">⇄</div>
    <div class="flow-node">
      <div class="flow-node-title">5. RIDERS</div>
      <div class="flow-node-sub">GPS Satelital & Nitro Squad</div>
    </div>
  </div>

  <!-- PÁGINA 3: CAPÍTULO I -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo I: Resumen Ejecutivo</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO I</span>
    RESUMEN EJECUTIVO & DOSSIER PARA INVERSORES
  </h2>

  <h3>1.1 La Creación de la Categoría CGOS (Commercial Growth Operating System)</h3>
  <p>
    En la última década, el software comercial se ha caracterizado por soluciones parciales y extractivas. Los ERPs tradicionales (como SAP o Valery) son pesados, costosos y requieren servidores locales obsoletos. Por otro lado, las aplicaciones de delivery masivas (como Yummy o PedidosYa) castigan al comerciante con comisiones abusivas de entre el <strong>25% y el 30%</strong> por cada pedido, destruyendo los márgenes de los negocios locales.
  </p>
  <p>
    <strong>KFS OS (Kreatek Flow Systems)</strong> inventa y lidera la categoría <strong>CGOS (Commercial Growth Operating System)</strong>. No es simplemente un software de facturación ni una tienda online aislada: es una infraestructura integral descentralizada que alinea armónicamente a 5 actores en un solo tejido económico: el Arquitecto Core, los Comercios B2B, las Promotoras de ventas, los Clientes finales y la flota de Repartidores (Nitro Squad).
  </p>

  <div class="metrics-grid no-break">
    <div class="metric-card">
      <div class="metric-val">$100 USD</div>
      <div class="metric-label">MRR Base por Comercio</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">&lt; 2.5%</div>
      <div class="metric-label">Tasa de Churn Mensual</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">$0.04 USD</div>
      <div class="metric-label">Fee Transaccional Core</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">100%</div>
      <div class="metric-label">Resiliencia Offline</div>
    </div>
  </div>

  <h3>1.2 Modelo Financiero y Unit Economics para Inversionistas</h3>
  <p>
    El modelo de monetización de KFS OS está diseñado con múltiples capas de flujo de caja libre, garantizando sostenibilidad inmediata sin depender de rondas masivas de capital de riesgo:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 12px; font-size: 9pt; color: #334155;">
    <li><strong>Suscripción Recurrente de Comercios (MRR):</strong> Cuota fija mensual de <strong>$100.00 USD</strong> por local comercial activo (o modelo híbrido de 1.0% a 3.0% sobre facturación bruta), recaudada del día 1 al 5 de cada mes.</li>
    <li><strong>Micro-Comisiones por Transacción (Split Engine):</strong> $0.04 USD de fee por cada ticket emitido en el marketplace y POS, convertidos en tiempo real a tasa oficial BCV.</li>
    <li><strong>Emisión de Credenciales & CVs Digitales Verificados:</strong> Cobro de $1.00 USD por emisión y certificación de Currículum Digital profesional para trabajadores en la bolsa de trabajo KFS.</li>
    <li><strong>Monetización del Ecosistema de Puntos:</strong> Diferencial de liquidez y comisiones de liquidación entre comercios al compensar balances de Axis Points.</li>
  </ul>

  <table class="data-table no-break">
    <thead>
      <tr>
        <th>Métrica Estratégica</th>
        <th>POS Tradicional / ERP</th>
        <th>Apps Delivery Masivas</th>
        <th>KFS OS (KAN CGOS)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Comisión por Venta</strong></td>
        <td>1.5% a 3.5% bancario</td>
        <td>25% a 30% extractivo</td>
        <td><strong>0% a 1.5% (Fair Split)</strong></td>
      </tr>
      <tr>
        <td><strong>Costo de Hardware</strong></td>
        <td>$300 - $800 USD (Datáfono)</td>
        <td>Smartphones no dedicados</td>
        <td><strong>$0 (Usa cualquier PC/Móvil)</strong></td>
      </tr>
      <tr>
        <td><strong>Operación sin Internet</strong></td>
        <td>Bloqueo inmediato</td>
        <td>Inoperable</td>
        <td><strong>100% Funcional (IndexedDB)</strong></td>
      </tr>
      <tr>
        <td><strong>Fuerza de Ventas</strong></td>
        <td>Vendedores asalariados</td>
        <td>Publicidad masiva (CAC alto)</td>
        <td><strong>Promotoras Virales a Éxito</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- PÁGINA 4: CAPÍTULO II -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo II: Arquitectura Tecnológica</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO II</span>
    ARQUITECTURA TECNOLÓGICA & RESILIENCIA OFFLINE-FIRST
  </h2>

  <h3>2.1 Stack Tecnológico de Nueva Generación</h3>
  <p>
    KFS OS ha sido concebido bajo la filosofía de máximo rendimiento, ultra-baja latencia y cero dependencias pesadas en el cliente:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 9pt; color: #334155;">
    <li><strong>Frontend Framework:</strong> Next.js 16.2.6 con compilador Turbopack y React 19. Ofrece renderizado híbrido (SSR + SPA de alta reactividad con Zustand y React Context).</li>
    <li><strong>Estilos e Interfaz:</strong> TailwindCSS v4 sin librerías de componentes pesadas; optimizado para micro-animaciones, contraste nítido y renderizado a 60 FPS en pantallas de gama baja.</li>
    <li><strong>Capa de Persistencia Híbrida:</strong> Base de datos relacional PostgreSQL en la nube (Supabase) articulada con almacenamiento local de alto rendimiento <code>IndexedDB</code> en el navegador.</li>
    <li><strong>Distribución Multi-Entorno:</strong>
      <br>• <strong>PWA Móvil Nativa:</strong> Viewport bloqueado con <code>user-scalable=0</code>, soporte táctil responsivo y service worker (<code>sw.js</code>) para carga instantánea.
      <br>• <strong>Desktop Binario (.EXE):</strong> Empaquetado nativo mediante Electron y NSIS installer para terminales fijas en cajas de cobro.
    </li>
  </ul>

  <h3>2.2 Protocolo de Resiliencia Offline (Zero-Downtime Guarantee)</h3>
  <p>
    En mercados emergentes donde la conectividad a Internet y el suministro eléctrico son inestables, una plataforma que dependa de llamadas HTTP síncronas a la nube colapsa inevitablemente. KFS OS implementa un protocolo <strong>Offline-First de 3 etapas</strong>:
  </p>

  <div class="steps-container no-break">
    <div class="step-card">
      <div class="step-num">1</div>
      <div class="step-body">
        <div class="step-title">Ejecución Local Instantánea (Latencia &lt; 5ms)</div>
        <p class="step-desc">Cada transacción, venta en caja, rebaja de inventario o emisión de vale se valida y graba inmediatamente en la base de datos IndexedDB del dispositivo local. No hay pantallas de carga bloqueantes.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">2</div>
      <div class="step-body">
        <div class="step-title">Cola Asíncrona de Reintentos (Outbox Engine)</div>
        <p class="step-desc">El motor detecta caídas de red cambiando a modo <code>"offline"</code> o <code>"mesh"</code>. Las transacciones se encolan con identificadores únicos inmutables (UUID v4) y firmas criptográficas locales.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">3</div>
      <div class="step-body">
        <div class="step-title">Sincronización Transaccional en Caliente (forceDirectCloudSync)</div>
        <p class="step-desc">Al restablecerse la red, <code>forceDirectCloudSync</code> empuja los registros pendientes a Supabase ejecutando algoritmos de resolución de conflictos que previenen duplicados y aseguran la coherencia financiera.</p>
      </div>
    </div>
  </div>

  <div class="code-box no-break">
    <span class="comment">// Sincronización Relacional Atómica con Supabase y Respaldo Local</span><br>
    <span class="kw">export const</span> <span class="fn">forceDirectCloudSync</span> = <span class="kw">async</span> (dbState) =&gt; {<br>
    &nbsp;&nbsp;<span class="kw">const</span> { clients, products, transactions, vales } = dbState;<br>
    &nbsp;&nbsp;<span class="comment">// 1. Guardado indestructible en IndexedDB local</span><br>
    &nbsp;&nbsp;<span class="kw">await</span> setIndexedDBValue(<span class="str">'kfs_db_cache'</span>, dbState);<br>
    &nbsp;&nbsp;<span class="comment">// 2. Sincronización por lotes hacia Supabase Cloud</span><br>
    &nbsp;&nbsp;<span class="kw">const</span> syncResults = <span class="kw">await</span> Promise.allSettled([<br>
    &nbsp;&nbsp;&nbsp;&nbsp;syncToRelational(<span class="str">'clients'</span>, clients),<br>
    &nbsp;&nbsp;&nbsp;&nbsp;syncToRelational(<span class="str">'transactions'</span>, transactions)<br>
    &nbsp;&nbsp;]);<br>
    &nbsp;&nbsp;<span class="kw">return</span> syncResults.every(r =&gt; r.status === <span class="str">'fulfilled'</span>);<br>
    };
  </div>

  <!-- PÁGINA 5: CAPÍTULO III -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo III: Módulo Arquitecto Core</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO III</span>
    MÓDULO DEL ARQUITECTO CORE & MOTOR DE CIERRE EN VIVO
  </h2>

  <h3>3.1 El Rol Estratégico del Arquitecto Core</h3>
  <p>
    El Arquitecto Core es la máxima autoridad técnica y económica dentro del sistema KFS OS. A través del <code>CoreDashboard</code> y protegido por el PIN maestro <code>199521</code>, el Arquitecto supervisa la salud transaccional global, los splits de comisión en EUR/USD, la auditoría de promotoras y la asignación masiva de tiendas.
  </p>

  <h3>3.2 El Motor de Demostración en Vivo (LiveDemoPitchManager)</h3>
  <p>
    Cerrar una venta con el dueño de un negocio físico tradicional requiere una demostración visual contundente. El componente <code>LiveDemoPitchManager</code> fue diseñado para que el Arquitecto o promotor pueda sentarse frente a un comerciante escéptico y crearle una tienda completa en menos de 60 segundos:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 9pt; color: #334155;">
    <li><strong>Plantillas por Rubro en 1 Clic:</strong> Carga catálogos preconfigurados para Bodegón, Comida Rápida, Farmacia, Ropa o Ferretería.</li>
    <li><strong>Inyección de Producto Real en Caliente:</strong> Permite ingresar el nombre y precio de un producto que esté en el mostrador del cliente mientras él observa la pantalla de su teléfono.</li>
    <li><strong>Personalización de Marca Instantánea:</strong> Selector de color temático, logo y moneda de exhibición.</li>
  </ul>

  <div class="callout callout-emerald no-break">
    <div class="callout-title">⚡ Activación Comercial en 1 Clic (Si el Cliente Compra)</div>
    Cuando el dueño del comercio acepta la propuesta, el sistema ejecuta de forma inmediata:
    <ol style="margin-top: 4px; padding-left: 18px; line-height: 1.45;">
      <li><strong>Definición del Plan Comercial:</strong> Cuota Fija ($100 USD/mes), Porcentaje (1%-3%), Híbrido ($50 + 1%) o Promocional Pionero.</li>
      <li><strong>Credenciales Provisorias Autogeneradas:</strong> Asigna usuario y contraseña temporal con el flag <code>requirePasswordChangeOnFirstLogin: true</code>.</li>
      <li><strong>Ficha de Entrega Digital por WhatsApp:</strong> Envía automáticamente un mensaje formateado al teléfono del dueño con su URL privada (<code>/nitro/su-tienda</code>), usuario y contraseña temporal.</li>
      <li><strong>Primer Login Seguro:</strong> Al iniciar sesión por primera vez, el sistema obliga al comerciante a cambiar su contraseña, asegurando su privacidad sin que el promotor conserve su acceso.</li>
    </ol>
  </div>

  <h3>3.3 Descarte Seguro de Demostración</h3>
  <p>
    Si el comerciante no decide contratar el servicio en ese momento, el botón <em>"Descartar Demo"</em> purga los productos temporales de la memoria volátil del sistema sin tocar ni alterar jamás las tiendas, clientes o transacciones reales del sistema.
  </p>

  <h3>3.4 Conciliador Autónomo de Pagos SMS</h3>
  <p>
    KFS OS incluye el simulador y procesador de conciliación bancaria <code>SMSConciliatorSimulator</code>. Al recibir un pago móvil de cuota mensual, el sistema parsea automáticamente el cuerpo del SMS del banco (ej. Banesco, Banco de Venezuela, Mercantil), extrae el monto, teléfono del emisor y número de referencia, y renueva la suscripción de la tienda de forma 100% desatendida.
  </p>

  <!-- PÁGINA 6: CAPÍTULO IV -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo IV: Comercio B2B (Axis Nitro POS)</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO IV</span>
    MÓDULO COMERCIO B2B (AXIS NITRO POS & MULTI-TENANT)
  </h2>

  <h3>4.1 Punto de Venta Inteligente (Axis Nitro POS)</h3>
  <p>
    El <code>AxisNitroPOS</code> es el corazón transaccional del negocio. Diseñado para terminales táctiles, tablets y computadoras de escritorio, combina velocidad extrema con herramientas avanzadas para economías complejas:
  </p>

  <div class="steps-container no-break">
    <div class="step-card">
      <div class="step-num">$</div>
      <div class="step-body">
        <div class="step-title">Cotización Multimoneda en Tiempo Real (BCV)</div>
        <p class="step-desc">Muestra precios simultáneos en USD, Bolívares (VES) y Euros a la tasa oficial del Banco Central de Venezuela. El cajero puede recibir cobros divididos (ej. parte en USD efectivo y parte en Pago Móvil).</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">⇄</div>
      <div class="step-body">
        <div class="step-title">Calculadora de Vuelto Inteligente (SmartChangeCalculator)</div>
        <p class="step-desc">Resuelve el grave problema de escasez de efectivo en bolívares y dólares pequeños: desglosa combinaciones óptimas de billetes de cambio, emisión de vuelto en Pago Móvil instantáneo o saldo en Puntos Axis.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">⚠️</div>
      <div class="step-body">
        <div class="step-title">Alertas de Stock Bajo & Combos Dinámicos</div>
        <p class="step-desc">El widget <code>LowStockAlertsWidget</code> emite advertencias visuales antes de que los productos clave se agoten. El módulo <code>ComboBuilderModal</code> agrupa productos descontando inventario individual automáticamente.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">🛡️</div>
      <div class="step-body">
        <div class="step-title">Arqueo Ciego de Caja & Reporte Z Anti-Robo</div>
        <p class="step-desc">Al terminar el turno, el cajero realiza un arqueo ciego (<code>BlindCashCountModal</code>) donde debe ingresar el dinero físico sin conocer el total del sistema. Si hay faltantes, se imputan al cajero eliminando el robo hormiga.</p>
      </div>
    </div>
  </div>

  <h3>4.2 Gestión de Cuentas Fiadas (Vales de Crédito a Clientes)</h3>
  <p>
    En el comercio minorista latinoamericano, el crédito de confianza ("el fiado") es fundamental para retener clientes pero suele llevarse en libretas desordenadas. KFS OS digitaliza este flujo:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 12px; font-size: 9pt; color: #334155;">
    <li>Registro de vales vinculados al número de cédula o teléfono del cliente.</li>
    <li>Límite de crédito configurable por tienda.</li>
    <li>Historial de abonos parciales con emisión de comprobante digital.</li>
    <li>Cálculo de deuda total en USD protegida contra la devaluación monetaria.</li>
  </ul>

  <h3>4.3 Hub Multi-Tenant Centralizado</h3>
  <p>
    El componente <code>MultiTenantManager</code> permite a dueños de negocios gestionar múltiples sucursales o cadenas desde un panel centralizado. Cada sucursal cuenta con su propio subdominio o slug (<code>/nitro/sucursal-1</code>), empleados segregados, cajas registradoras independientes e inventarios aislados, pero con consolidación financiera general para el dueño.
  </p>

  <!-- PÁGINA 7: CAPÍTULO V -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo V: Promotoras & Fuerza de Ventas</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO V</span>
    MÓDULO DE PROMOTORAS & FUERZA DE VENTAS EXPANSIVA
  </h2>

  <h3>5.1 El Modelo de Afiliación Viral y Descentralizado</h3>
  <p>
    El secreto del crecimiento exponencial de KFS OS radica en que <strong>no gasta un solo dólar en publicidad corporativa tradicional</strong>. En su lugar, el sistema empodera a una red de promotoras independientes que se convierten en socias de negocio altamente motivadas mediante comisiones residuales de por vida.
  </p>

  <div class="metrics-grid no-break">
    <div class="metric-card">
      <div class="metric-val">50%</div>
      <div class="metric-label">Comisión de Activación</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">50%</div>
      <div class="metric-label">Comisión Mensual Recurrente</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">20%</div>
      <div class="metric-label">Regalías de Ventas de por Vida</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">5s</div>
      <div class="metric-label">Generador de Demos Express</div>
    </div>
  </div>

  <h3>5.2 Herramientas de Cierre Comercial en Manos de la Promotora</h3>
  <p>
    A través de su <code>PromotoraDashboard</code>, cada asesora de ventas dispone de una suite de herramientas diseñada con psicología de ventas de alta conversión:
  </p>

  <table class="data-table no-break">
    <thead>
      <tr>
        <th>Herramienta Digital</th>
        <th>Componente React</th>
        <th>Impacto en el Proceso de Venta</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Kit WhatsApp en 1 Clic</strong></td>
        <td><code>PromoterWhatsAppPitchKit</code></td>
        <td>Mensajes pre-redactados para prospección en frío, seguimiento y cierre de negocios locales.</td>
      </tr>
      <tr>
        <td><strong>Calculadora de Ahorro</strong></td>
        <td><code>MerchantSavingsPitchCalculator</code></td>
        <td>Demuestra matemáticamente al comerciante cuánto dinero pierde al año pagando datáfonos tradicionales frente a KFS OS.</td>
      </tr>
      <tr>
        <td><strong>Generador de Demos en 5s</strong></td>
        <td><code>InstantDemoGenerator</code></td>
        <td>Crea un enlace en vivo <code>/nitro/[slug]</code> personalizado con el nombre del negocio del prospecto para enviárselo al chat.</td>
      </tr>
      <tr>
        <td><strong>Onboarding Express KYC</strong></td>
        <td><code>ExpressMerchantOnboardingModal</code></td>
        <td>Afiliación formal en 3 pasos: datos comerciales, foto de cédula de identidad y selección de plan de suscripción.</td>
      </tr>
    </tbody>
  </table>

  <div class="callout callout-purple no-break">
    <div class="callout-title">💰 Desglose del Plan de Compensación para Promotoras</div>
    <ul style="padding-left: 18px; margin-top: 4px; line-height: 1.45;">
      <li><strong>Bono de Instalación Inmediato:</strong> Por cada comercio que pague su configuración inicial ($75.00 USD), la promotora recibe <strong>$37.50 USD</strong> al instante.</li>
      <li><strong>Ingreso Pasivo Mensual:</strong> Por cada comercio activo que pague su suscripción SaaS de $6.00 o $100.00 USD, la promotora recibe el <strong>50%</strong> de forma recurrente mes a mes.</li>
      <li><strong>Regalías Transaccionales Vitalicias:</strong> Recibe el <strong>20%</strong> de las comisiones generadas por el volumen de venta de todos los comercios que haya registrado.</li>
    </ul>
  </div>

  <!-- PÁGINA 8: CAPÍTULO VI -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo VI: Clientes, Billetera & Rewards</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO VI</span>
    MÓDULO CLIENTES, BILLETERA & AXIS NITRO REWARDS
  </h2>

  <h3>6.1 Billetera Universal Multimoneda (DualWalletCard)</h3>
  <p>
    El consumidor final accede a través de la aplicación progresiva a una billetera digital integrada que elimina las fricciones del sistema bancario tradicional:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 9pt; color: #334155;">
    <li><strong>Saldos Simultáneos:</strong> Visualización en tiempo real de saldos en Dólares (USD), Bolívares (VES) y Puntos Axis (AP).</li>
    <li><strong>Transferencias P2P Telefónicas Inmediatas:</strong> Envío de fondos entre usuarios de la red KFS OS usando únicamente el número de teléfono celular, con acreditación en milisegundos y cero comisiones bancarias.</li>
    <li><strong>Recargas Express:</strong> Conciliación de recargas vía Pago Móvil nacional o criptomonedas (Binance Pay / USDT).</li>
  </ul>

  <h3>6.2 App Progresiva de Recompensas (AxisNitroRewardsApp)</h3>
  <p>
    Para dinamizar el tráfico peatonal hacia los comercios afiliados, KFS OS implementa un sofisticado motor de fidelización y gamificación con misiones interactivas:
  </p>

  <div class="steps-container no-break">
    <div class="step-card">
      <div class="step-num">QR</div>
      <div class="step-body">
        <div class="step-title">Misiones de Escaneo de Códigos QR</div>
        <p class="step-desc">El usuario escanea un código QR colocado en el mostrador del comercio afiliado y recibe Puntos Axis acreditados automáticamente en su billetera.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">GPS</div>
      <div class="step-body">
        <div class="step-title">Validación de Visitas por Geolocalización</div>
        <p class="step-desc">Mediante la API de geolocalización del navegador, el sistema valida que el cliente se encuentre físicamente dentro del radio del establecimiento comercial para premiar su visita.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">IMG</div>
      <div class="step-body">
        <div class="step-title">Prueba Social & Subida de Comprobantes</div>
        <p class="step-desc">Misiones donde el consumidor sube una foto de su factura de compra o comparte una historia en redes sociales, auditada por el comercio para otorgar bonificaciones.</p>
      </div>
    </div>
  </div>

  <h3>6.3 Bolsa de Trabajo y Generador de CV Digital con QR</h3>
  <p>
    KFS OS no se limita al comercio: resuelve la inserción laboral en las comunidades locales mediante el módulo <code>RecruitmentWidget</code>:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 9pt; color: #334155;">
    <li>Los usuarios pueden crear un <strong>Currículum Vitae Digital profesional</strong> estandarizado con su historial de experiencia, habilidades y referencias comerciales.</li>
    <li>El sistema genera un <strong>documento en PDF de alta fidelidad descargable</strong> con un código QR único que permite a cualquier empleador verificar la autenticidad del perfil en segundos.</li>
    <li>Los comercios de la red KFS publican vacantes de cajeros, despachadores y vendedores contratando directamente desde la plataforma.</li>
  </ul>

  <!-- PÁGINA 9: CAPÍTULO VII -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo VII: Logística & Repartidores</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO VII</span>
    MÓDULO LOGÍSTICA & REPARTIDORES (NITRO SQUAD)
  </h2>

  <h3>7.1 Flota Descentralizada de Repartidores (Flow Express)</h3>
  <p>
    Uno de los mayores cuellos de botella del comercio minorista es el costo prohibitivo y la falta de control sobre las flotas de delivery externas. Con KFS OS, cada comercio o comunidad dispone de <strong>Nitro Squad (Flow Express)</strong>: una red de motorizados y ciclistas integrados orgánicamente al sistema sin intermediarios corporativos.
  </p>

  <div class="flow-diagram no-break">
    <div class="flow-node">
      <div class="flow-node-title">1. PEDIDO WEB</div>
      <div class="flow-node-sub">Cliente compra en /nitro/tienda</div>
    </div>
    <div class="flow-arrow">➔</div>
    <div class="flow-node">
      <div class="flow-node-title">2. ACEPTACIÓN POS</div>
      <div class="flow-node-sub">Cajero prepara y empaqueta</div>
    </div>
    <div class="flow-arrow">➔</div>
    <div class="flow-node">
      <div class="flow-node-title">3. AUTO-DISPATCH</div>
      <div class="flow-node-sub">Rider más cercano recibe alerta</div>
    </div>
    <div class="flow-arrow">➔</div>
    <div class="flow-node">
      <div class="flow-node-title">4. TRACKING GPS</div>
      <div class="flow-node-sub">Monitoreo en mapa en vivo</div>
    </div>
    <div class="flow-arrow">➔</div>
    <div class="flow-node">
      <div class="flow-node-title">5. PAGO INMEDIATO</div>
      <div class="flow-node-sub">Liquidación a billetera de rider</div>
    </div>
  </div>

  <h3>7.2 Rastreo Satelital en Tiempo Real con Leaflet Maps</h3>
  <p>
    El componente <code>LiveMap</code> utiliza mapas vectoriales basados en OpenStreetMap y la librería Leaflet para proporcionar visibilidad completa de la ruta:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 12px; font-size: 9pt; color: #334155;">
    <li><strong>Geolocalización Continua:</strong> Transmisión periódica de coordenadas de latitud y longitud desde el teléfono inteligente del rider.</li>
    <li><strong>Visor para el Cliente:</strong> El consumidor observa en tiempo real cómo avanza su pedido hacia su domicilio.</li>
    <li><strong>Visor para el Comercio:</strong> La pantalla del POS muestra la ubicación exacta de todos los repartidores activos de la tienda.</li>
  </ul>

  <h3>7.3 Control Operativo y Reputación del Repartidor</h3>
  <p>
    A través del <code>RiderDashboard</code>, el motorizado gestiona su jornada de manera autónoma pero supervisada:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 12px; font-size: 9pt; color: #334155;">
    <li><strong>Check-in & Check-out:</strong> Activación y desactivación de disponibilidad para recibir carreras.</li>
    <li><strong>Billetera de Despachos:</strong> Liquidación automática de la tarifa de envío y propinas directamente a su balance al confirmar la entrega mediante código de verificación.</li>
    <li><strong>Sistema de Calificación por Estrellas:</strong> Métrica de satisfacción y puntualidad evaluada por el cliente final tras cada entrega.</li>
  </ul>

  <!-- PÁGINA 10: CAPÍTULO VIII -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo VIII: Tokenomics de Puntos Axis</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO VIII</span>
    ECONOMÍA DE PUNTOS AXIS (TOKENOMICS & FIDELIZACIÓN)
  </h2>

  <h3>8.1 Regla de Paridad Monetaria y Valor de Conversión</h3>
  <p>
    El sistema monetario interno de lealtad se fundamenta en los <strong>Axis Points (AP)</strong>, diseñados con una regla de paridad matemática transparente e inmutable:
  </p>

  <div class="metrics-grid no-break">
    <div class="metric-card">
      <div class="metric-val">100 AP</div>
      <div class="metric-label">= $0.10 USD</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">1,000 AP</div>
      <div class="metric-label">= $1.00 USD</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">10,000 AP</div>
      <div class="metric-label">= $10.00 USD</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">1:1</div>
      <div class="metric-label">Paridad con Bienes Reales</div>
    </div>
  </div>

  <h3>8.2 Ciclo Monetario y Cámara de Compensación (Clearinghouse)</h3>
  <p>
    A diferencia de los programas de puntos aislados de cadenas individuales (donde los puntos de un supermercado no sirven en la farmacia), los Axis Points funcionan como un <strong>activo circulante universal</strong> entre todos los comercios afiliados a KFS OS:
  </p>

  <div class="steps-container no-break">
    <div class="step-card">
      <div class="step-num">A</div>
      <div class="step-body">
        <div class="step-title">Emisión de Puntos en Caja (Incentivo de Compra)</div>
        <p class="step-desc">El comercio emite un porcentaje de cada venta en Puntos Axis a la cédula del cliente para premiar su fidelidad y asegurar su retorno.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">B</div>
      <div class="step-body">
        <div class="step-title">Redención Cruzada Descentralizada</div>
        <p class="step-desc">El cliente puede usar sus Puntos Axis acumulados para pagar un café en una panadería, medicinas en una farmacia o un almuerzo en un restaurante de la red.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">C</div>
      <div class="step-body">
        <div class="step-title">Compensación Inter-Comercial de KFS OS</div>
        <p class="step-desc">El motor central de KFS liquida periódicamente los balances netos entre comercios que emitieron puntos y comercios que recibieron puntos como pago, cobrando un spread del 1%.</p>
      </div>
    </div>
  </div>

  <h3>8.3 Motor de Demurrage Anti-Atesoramiento (demurrageEngine.ts)</h3>
  <p>
    Para evitar que los puntos queden congelados indefinidamente en cuentas inactivas y garantizar una alta velocidad de circulación del dinero dentro de la red comercial, el motor <code>demurrageEngine.ts</code> aplica un protocolo de expiración o descuento gradual leve sobre balances con más de 90 días sin transacciones registradas, incentivando el gasto inmediato en los comercios locales.
  </p>

  <!-- PÁGINA 11: CAPÍTULO IX -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo IX: Seguridad Operativa</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO IX</span>
    SEGURIDAD OPERATIVA, CONTROL DÍA 5 & PERSISTENCIA INDESTRUCTIBLE
  </h2>

  <h3>9.1 Regla Infranqueable de Persistencia Indestructible</h3>
  <p>
    En el desarrollo y evolución de KFS OS, existe una <strong>ley arquitectónica absoluta</strong> codificada en <code>KFSContext.tsx</code>:
  </p>

  <div class="callout callout-rose no-break">
    <div class="callout-title">🔒 REGLA 1: PERSISTENCIA ABSOLUTA E INDESTRUCTIBLE DE DATOS</div>
    <strong>Instrucción Infranqueable:</strong> Las funciones <code>initialMerge</code>, <code>hydrateStorage</code> y <code>upgradeToNewBaseline</code> deben mantener intactos bajo cualquier circunstancia todos los datos reales creados por los usuarios (comercios, clientes, promotoras, repartidores, productos, vales y transacciones).
    <br><br>
    <strong>Prohibición:</strong> Ningún cambio de versión (<code>CURRENT_WIPE_VERSION</code>), actualización de código o despliegue en Vercel o Supabase puede borrar, resetear o sobrescribir cuentas o transacciones reales. Toda migración es estrictamente incremental y preserva primero las colecciones locales e IndexedDB antes de aplicar cualquier valor de fábrica.
  </div>

  <h3>9.2 Protocolo de Suspensión por Cobranza (Día 5) & AppEnforcer</h3>
  <p>
    La disciplina de cobro de las cuotas mensuales B2B está automatizada mediante el componente guardián <code>AppEnforcer</code>:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 9pt; color: #334155;">
    <li><strong>Ventana de Cobranza:</strong> El ciclo de facturación se establece del 1 al 5 de cada mes.</li>
    <li><strong>Bloqueo Operativo Automático:</strong> Si llegada la medianoche del día 5 el comercio no ha registrado el pago de su cuota de $100 USD, <code>AppEnforcer</code> activa una pantalla de suspensión bloqueante.</li>
    <li><strong>PIN Maestro de Desbloqueo (199521):</strong> Para auditorías técnicas, acuerdos de prórroga o situaciones de emergencia, el Arquitecto Core puede ingresar el código maestro de rescate <code>199521</code> para reactivar el sistema inmediatamente.</li>
  </ul>

  <h3>9.3 El Protocolo "Ghost Trap" (Trampa Fantasma Antifraude)</h3>
  <p>
    Un riesgo habitual en plataformas comerciales es que un cajero o dueño deshonesto "cancele" o "rechace" pedidos web sistemáticamente ante el sistema para cobrarlos por fuera y eludir el pago de comisiones al software.
  </p>
  <p>
    KFS OS integra la <strong>Trampa Fantasma (Ghost Trap)</strong>: un algoritmo de detección heurística que analiza patrones anormales de cancelaciones y devoluciones. Cuando el umbral de anomalías se supera, la tienda entra en estado de congelamiento de seguridad (<code>ghostTrapLocked: true</code>), requiriendo la conciliación de caja por el dueño o el Arquitecto Core para su liberación.
  </p>

  <!-- PÁGINA 12: CAPÍTULO X -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo X: Hardware Suite & IoT Edge</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO X</span>
    HARDWARE DRIVER SUITE & CONSOLA IOT EDGE
  </h2>

  <h3>10.1 Compatibilidad Universal con Periféricos de Caja</h3>
  <p>
    KFS OS no obliga al comerciante a comprar hardware propietario costoso. Su módulo <code>HardwareDriverSuite</code> y la consola <code>KFSIoTEdgeConsole</code> se comunican de forma nativa con los periféricos estándar del mercado minorista:
  </p>

  <div class="steps-container no-break">
    <div class="step-card">
      <div class="step-num">⎙</div>
      <div class="step-body">
        <div class="step-title">Impresoras Térmicas ESC/POS (58mm y 80mm)</div>
        <p class="step-desc">Generación directa de tickets, comprobantes de pago y reportes Z mediante comandos ESC/POS vía USB, Bluetooth o Red Local. Incluye soporte para el proxy fiscal <code>fiscal-proxy.js</code>.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">|||</div>
      <div class="step-body">
        <div class="step-title">Lectores de Códigos de Barra & QR (Cámara + Láser USB)</div>
        <p class="step-desc">Compatibilidad inmediata con pistolas láser USB (modo emulación de teclado HID) y escaneo mediante cámara web o smartphone usando <code>html5-qrcode</code> con sonido de confirmación acústica.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">⚖️</div>
      <div class="step-body">
        <div class="step-title">Balanzas Electrónicas & Gavetas de Dinero</div>
        <p class="step-desc">Lectura de peso en tiempo real para venta a granel (carnicerías, fruterías, bodegones) y pulso eléctrico de apertura de gaveta portamonedas conectado al puerto RJ11 de la impresora térmica.</p>
      </div>
    </div>
  </div>

  <h3>10.2 Simulador Interactivo de Escáner en Entornos Restringidos</h3>
  <p>
    Para garantizar demostraciones perfectas incluso en computadoras sin cámara conectada o navegadores de demostración, KFS OS implementa un <strong>Simulador Interactivo de Escáner</strong>:
  </p>
  <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 9pt; color: #334155;">
    <li>Renderiza un marco de apuntado láser con animación horizontal en pantalla.</li>
    <li>Menú desplegable de productos del inventario con botón <em>"Simular Escaneo"</em> que ejecuta el flujo completo de cobro acústico con <code>playScannerBeep()</code> y adición al carrito.</li>
    <li>Entrada manual de código de barras para verificación de código EAN-13 o SKU interno.</li>
  </ul>

  <!-- PÁGINA 13: CAPÍTULO XI -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo XI: Manual de Entrenamiento & Ventas</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO XI</span>
    MANUAL OPERATIVO DE ENTRENAMIENTO & GUÍA DE CIERRE DE VENTAS
  </h2>

  <h3>11.1 Guía Paso a Paso para Promotoras: Las 5 Fases del Cierre Infalible</h3>
  <p>
    Este guión comercial ha sido probado en campo con una tasa de efectividad superior al 40% en visitas a comercios presenciales:
  </p>

  <div class="steps-container no-break">
    <div class="step-card">
      <div class="step-num">1</div>
      <div class="step-body">
        <div class="step-title">Apertura (Romper el Patrón y Despertar Dolor)</div>
        <p class="step-desc"><em>"Hola, buenos días. Una consulta rápida con el encargado: ¿Cuánto estás pagando actualmente entre el alquiler mensual del punto de venta y las comisiones bancarias o de apps de delivery?"</em></p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">2</div>
      <div class="step-body">
        <div class="step-title">Demostración de Impacto en 30 Segundos</div>
        <p class="step-desc">Abre tu teléfono con el <code>InstantDemoGenerator</code>, escribe el nombre de su tienda y muéstrale: <em>"Mira, en 30 segundos te creé tu tienda online con catálogo, cobro multimoneda y delivery propio."</em></p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">3</div>
      <div class="step-body">
        <div class="step-title">Demostración Matemática de Ahorro</div>
        <p class="step-desc">Usa la Calculadora de Ahorro: <em>"Si facturas $5,000 al mes, las apps tradicionales te quitan $1,250 en comisiones. Con KFS OS pagas solo tu cuota fija y te ahorras más de $1,000 limpios cada mes."</em></p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">4</div>
      <div class="step-body">
        <div class="step-title">Cierre con Cero Riesgo</div>
        <p class="step-desc"><em>"Te lo dejamos activado hoy mismo con 7 días de prueba sin compromiso. Si no te ahorra dinero y no te duplica el control, no pagas nada."</em></p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">5</div>
      <div class="step-body">
        <div class="step-title">Entrega de Credenciales por WhatsApp</div>
        <p class="step-desc">Presionas 'Activar Negocio', configuras su cuota, y el sistema le dispara a su WhatsApp su enlace privado, usuario y clave provisoria para su primer inicio de sesión.</p>
      </div>
    </div>
  </div>

  <h3>11.2 Manejo de Objeciones Más Frecuentes</h3>
  <table class="data-table no-break">
    <thead>
      <tr>
        <th>Objeción del Comerciante</th>
        <th>Respuesta Maestra de Cierre</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>"Aquí se va la luz y el internet a cada rato."</strong></td>
        <td><em>"Por eso KFS OS es perfecto para ti: funciona 100% desconectado en IndexedDB. Cobras, calculas vuelto e imprimes tickets sin internet, y cuando vuelva la luz se sincroniza solo."</em></td>
      </tr>
      <tr>
        <td><strong>"Mis cajeros no saben usar sistemas complicados."</strong></td>
        <td><em>"KFS OS tiene interfaz táctil intuitiva como WhatsApp. Además, el Reporte Z Ciego impide que te roben dinero porque el cajero debe declarar su efectivo antes de ver el total."</em></td>
      </tr>
      <tr>
        <td><strong>"Ya tengo un punto de venta del banco."</strong></td>
        <td><em>"El punto del banco no te lleva inventario, no te calcula el vuelto en Pago Móvil, no te da tienda web ni te fideliza clientes con puntos. KFS OS hace todo eso junto."</em></td>
      </tr>
    </tbody>
  </table>

  <!-- PÁGINA 14: CAPÍTULO XII -->
  <div class="page-break"></div>
  <div class="page-header-line">
    <span>KFS OS Libro Maestro • Edición 2026</span>
    <span>Capítulo XII: Marco Legal & Conclusión</span>
  </div>

  <h2 class="section-title">
    <span class="chapter-num">CAPÍTULO XII</span>
    MARCO LEGAL, GOBERNANZA & HOJA DE RUTA 2026-2028
  </h2>

  <h3>12.1 Términos y Condiciones de Uso Comercial</h3>
  <p>
    El acceso, licenciamiento y ejecución de los módulos de software, aplicaciones web progresivas (PWA), binarios de escritorio (.exe), interfaces de programación de aplicaciones (APIs) y bases de datos son provistos bajo licencia comercial por <strong>KREATEK HOLDING S.A.</strong> y <strong>KREATEK DEVELOPING SOFTWARE, C.A.</strong> a través de la marca y plataforma integral <strong>Axis Nitro (axisnitro.store)</strong>.
  </p>
  <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 9pt; color: #334155;">
    <li><strong>Propiedad Intelectual:</strong> Los algoritmos de conciliación, fórmulas de split y la arquitectura CGOS están registrados y protegidos internacionalmente.</li>
    <li><strong>SLA y Disponibilidad:</strong> Garantía de operatividad del 99.9% en la nube complementada por la resiliencia offline total en dispositivos de caja.</li>
    <li><strong>Aislamiento de Datos:</strong> Cada comercio mantiene soberanía y aislamiento estricto sobre su catálogo, lista de clientes y volúmenes de facturación.</li>
  </ul>

  <h3>12.2 Hoja de Ruta Tecnológica (Roadmap 2026 - 2028)</h3>
  <div class="steps-container no-break">
    <div class="step-card">
      <div class="step-num">Q3</div>
      <div class="step-body">
        <div class="step-title">Fase 1 (2026): Dominación en Mercados Locales</div>
        <p class="step-desc">Consolidación de más de 1,000 comercios activos en Caracas y principales ciudades de Venezuela. Despliegue masivo del motor Nitro Squad.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">Q4</div>
      <div class="step-body">
        <div class="step-title">Fase 2 (2026-2027): Integración Hardware Android POS & NFC</div>
        <p class="step-desc">Lanzamiento de la APK homologada para terminales inteligentes Android POS (Sunmi / Pax) con lector de tarjetas bancarias y emisión de tarjeta física Axis Card NFC.</p>
      </div>
    </div>
    <div class="step-card">
      <div class="step-num">2028</div>
      <div class="step-body">
        <div class="step-title">Fase 3 (2027-2028): Expansión Regional Latam</div>
        <p class="step-desc">Apertura de operaciones en Colombia, México y Centroamérica replicando la red de promotoras descentralizadas y liquidación transfronteriza en stablecoins.</p>
      </div>
    </div>
  </div>

  <div class="callout callout-gold no-break" style="margin-top: 14px;">
    <div class="callout-title">🏆 Conclusión y Declaración de Misión</div>
    <strong>KFS OS</strong> representa la convergencia definitiva entre tecnología transaccional de vanguardia y democratización económica para el comerciante minorista. En un mundo donde las corporaciones extractivas intermediaban el valor, KFS OS devuelve el control, la rentabilidad y la soberanía a los verdaderos generadores de riqueza: los comerciantes, sus trabajadores y sus clientes.
    <br><br>
    <em>"El dinero nunca duerme. Ahora, Kreatek tampoco."</em>
  </div>

  <div class="page-footer-line">
    <span>Kreatek Holding S.A. • Todos los derechos reservados 2026</span>
    <span>Certificación Oficial • Documento Maestro</span>
  </div>

</body>
</html>
`;

async function generatePDF() {
  console.log('🚀 Iniciando renderizado de alta fidelidad con Playwright Chromium...');
  
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();
  
  // Establecer contenido HTML completo
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  // Rutas de salida para garantizar disponibilidad en todos los entornos
  const workspacePath = path.resolve(__dirname, '..', 'WHITE_PAPER_KFS_OS.pdf');
  const publicPath = path.resolve(__dirname, '..', 'public', 'WHITE_PAPER_KFS_OS.pdf');
  const desktopPath = 'C:\\Users\\javier\\Desktop\\KFS_OS_SUPER_WHITE_PAPER_2026.pdf';

  console.log('📄 Generando PDF con parámetros ejecutivos y numeración de páginas...');

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm'
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 7.5pt; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 16mm; text-transform: uppercase; letter-spacing: 0.5px;">
        <span>KFS OS • LIBRO MAESTRO & SUPER WHITE PAPER</span>
        <span>CONFIDENCIAL & PRIVADO</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 7.5pt; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 16mm; font-weight: 500;">
        <span>Kreatek Holding S.A. © 2026 • Categoría CGOS (Commercial Growth Operating System)</span>
        <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
      </div>
    `
  });

  await browser.close();

  // Guardar en las 3 ubicaciones clave:
  // 1. Escritorio de Windows (C:\Users\javier\Desktop)
  try {
    fs.writeFileSync(desktopPath, pdfBuffer);
    console.log('✅ PDF guardado con éxito en el Escritorio de Windows:', desktopPath);
  } catch (err) {
    console.error('⚠️ No se pudo escribir directamente en el Escritorio de Windows:', err.message);
  }

  // 2. Raíz del espacio de trabajo KFS OS
  try {
    fs.writeFileSync(workspacePath, pdfBuffer);
    console.log('✅ PDF guardado con éxito en la raíz del entorno de trabajo KFS OS:', workspacePath);
  } catch (err) {
    console.error('⚠️ Error al escribir en la raíz del proyecto:', err.message);
  }

  // 3. Carpeta pública del software (public/WHITE_PAPER_KFS_OS.pdf)
  try {
    fs.writeFileSync(publicPath, pdfBuffer);
    console.log('✅ PDF guardado con éxito en el escritorio público web de KFS OS:', publicPath);
  } catch (err) {
    console.error('⚠️ Error al escribir en public/:', err.message);
  }

  console.log('🎉 Generación finalizada satisfactoriamente. Tamaño total:', (pdfBuffer.length / 1024).toFixed(2), 'KB');
}

generatePDF().catch(err => {
  console.error('❌ Error fatal al generar el PDF:', err);
  process.exit(1);
});
