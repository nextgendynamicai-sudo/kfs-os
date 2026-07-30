# 📘 LIBRO MAESTRO — SUPER WHITE PAPER & MANUAL OPERATIVO DEFINITIVO
## KFS OS (Kreatek Flow Systems) — "KAN CGOS" & Axis Nitro Core

**Código de Proyecto:** KFS-OS-WP-2026-FINAL  
**Clasificación de Documento:** Confidencial / Corporativo & Operativo  
**Holding Propietario:** Kreatek Holding S.A.  
**Versión del Sistema:** 8.0.0 (Edición Producción Global)  
**Fecha de Emisión:** 29 de Julio de 2026  
**Código Maestro del Arquitecto Core:** `199521`  
**Dominio Principal en Vivo:** `https://axisnitro.store`  
**ID de Despliegue Vercel:** `dpl_3XSdKBmeA6oo2DnKDAUkF9PVtbhh`  
**Repositorio Oficial GitHub:** `https://github.com/nextgendynamicai-sudo/kfs-os.git`

---

## 📑 TABLA DE CONTENIDOS GENERAL

1. [CAPÍTULO I: RESUMEN EJECUTIVO & VISIÓN CGOS](#1-resumen-ejecutivo--visión-cgos)
2. [CAPÍTULO II: ARQUITECTURA DETALLADA DE MÓDULOS DE LA PLATAFORMA](#2-arquitectura-detallada-de-módulos-de-la-plataforma)
3. [CAPÍTULO III: LA ECONOMÍA DE AXIS POINTS (TOKENOMICS & AOF)](#3-la-economía-de-axis-points-tokenomics--aof)
4. [CAPÍTULO IV: PROTOCOLOS DE SEGURIDAD OPERATIVA Y ANTIFRAUDE](#4-protocolos-de-seguridad-operativa-y-antifraude)
5. [CAPÍTULO V: DIRECTORIO DE PRODUCCIÓN, SUBDOMINIOS Y EJECUTABLES (EXE / APK)](#5-directorio-de-producción-subdominios-y-ejecutables-exe--apk)
6. [CAPÍTULO VI: MODELO DE REVENUE SHARE, SPLITS EN CALIENTE Y PROYECCIONES](#6-modelo-de-revenue-share-splits-en-caliente-y-proyecciones)
7. [CAPÍTULO VII: INFORME DE AUDITORÍA E2E DE FLUJOS DEMO VALIDADOS](#7-informe-de-auditoría-e2e-de-flujos-demo-validados)
8. [CAPÍTULO VIII: GUÍA PASO A PASO POR ROL DEL ECOSISTEMA](#8-guía-paso-a-paso-por-rol-del-ecosistema)
9. [CAPÍTULO IX: MANUAL COMERCIAL & ESTRATEGIA DE VENTAS ("MODO VENTAS")](#9-manual-comercial--estrategia-de-ventas-modo-ventas)
10. [CAPÍTULO X: GUÍA DE CONFIGURACIÓN, BASE DE DATOS SUPABASE Y SINCRONIZACIÓN BCV](#10-guía-de-configuración-base-de-datos-supabase-y-sincronización-bcv)

---

<a id="1-resumen-ejecutivo--visión-cgos"></a>
## 🏛️ CAPÍTULO I: RESUMEN EJECUTIVO & VISIÓN CGOS

### 1.1 La Categoría CGOS (Commercial Growth Operating System)
**Kreatek Flow Systems (KFS)** introduce la categoría disruptiva **CGOS (Commercial Growth Operating System)**. A diferencia de los sistemas ERP rígidos y aislados del mercado tradicional, KAN CGOS funciona como un ecosistema comercial todo-en-uno diseñado para economías emergentes y redes comerciales dinámicas.

La plataforma unifica en un solo entorno **Progressive Web App (PWA)** de ultra-alto rendimiento:
- El punto de venta físico en caja registradora (**Axis Nitro POS**).
- La vitrina y comercio electrónico instantáneo (**Nitro Market**).
- La red logística y geolocalización de repartidores a domicilio (**Nitro Squad**).
- El centro de inteligencia administrativa y financiera (**Axis OS**).
- La economía universal de fidelización tokenizada (**Axis Points AP**).

```mermaid
graph TD
    KFS[KFS KAN CGOS Core]
    
    KFS --> AXIS_OS[1. Axis OS: Cerebro Administrativo]
    KFS --> NITRO_MKT[2. Nitro Market: Tienda E-Commerce]
    KFS --> NITRO_SQD[3. Nitro Squad: Logística & Riders]
    KFS --> NITRO_POS[4. Axis Nitro POS: Punto de Venta]

    style KFS fill:#4c1d95,stroke:#7c3aed,stroke-width:3px,color:#fff
    style AXIS_OS fill:#1e1b4b,stroke:#4338ca,stroke-width:2px,color:#fff
    style NITRO_MKT fill:#1e1b4b,stroke:#4338ca,stroke-width:2px,color:#fff
    style NITRO_SQD fill:#1e1b4b,stroke:#4338ca,stroke-width:2px,color:#fff
    style NITRO_POS fill:#1e1b4b,stroke:#4338ca,stroke-width:2px,color:#fff
```

---

### 1.2 El Problema de la Fragmentación y la Solución KFS

#### El Problema del Comercio Tradicional
1. **Pasarelas de Pago Ineficientes:** Comisiones del 3% al 8% en transferencias y retenedores bancarios que retrasan la liquidez inmediata del negocio.
2. **Puntos de Venta Rígidos:** Alquileres de equipos POS físicos costosos que no se comunican con los inventarios de las tiendas virtuales.
3. **Logística Desconectada:** Plataformas de delivery de terceros que cobran comisiones de hasta un 30% por pedido, destruyendo el margen de ganancia de los negocios locales.
4. **Ausencia de Fidelización Viable:** Imposibilidad técnica y financiera de implementar un programa de recompensas para atraer clientes recurrentes.
5. **Vulnerabilidad a Estafas:** Cajeros expuestos a comprobantes y capturas de pantalla de Pago Móvil falsas.

#### La Solución KFS CGOS
- **Arquitectura Offline-First:** Operatividad ininterrumpida en caja local con sincronización en tiempo real vía Supabase e IndexedDB.
- **Mercado de Comisión Cero:** Tiendas virtuales autogeneradas en milisegundos con comisiones mínimas.
- **Logística Geogestionada Directa:** Asignación inteligente de motorizados propios sin peajes intermediarios.
- **Fidelización Tokenizada Universales:** Moneda interna **Axis Points (AP)** compartida por toda la red comercial.

---

<a id="2-arquitectura-detallada-de-módulos-de-la-plataforma"></a>
## 📱 CAPÍTULO II: ARQUITECTURA DETALLADA DE MÓDULOS DE LA PLATAFORMA

### 2.1 Axis OS (El Cerebro Administrativo)
- **Propósito:** Centro de control telemétrico y financiero para el Kreatek Operator (Dueño del Comercio).
- **Prestaciones Destacadas:**
  - Control de inventarios multimoneda (USD / Bolívares) con compresión automática de imágenes en Base64.
  - Gestión de tasas de cambio diarias del Banco Central de Venezuela (BCV) con conversión dinámica en caliente.
  - Conciliación de caja dual (Efectivo, Pago Móvil, Binance Pay, Axis Points).
  - Configuración de roles de cajeros y terminales móviles autorizados.

---

### 2.2 Nitro Market (La Vitrina Digital)
- **Propósito:** Tienda virtual instantánea autogenerada bajo la ruta `/nitro/[slug]`.
- **Prestaciones Destacadas:**
  - Sincronización automática del catálogo en tiempo real.
  - Cálculo de tarifa de despacho (delivery) en base al radio kilométrico y distancia GPS (latitud y longitud).
  - Checkout optimizado para pedidos por WhatsApp o Pago Móvil directo.

---

### 2.3 Nitro Squad (La Red Logística Geogestionada)
- **Propósito:** Gestión y seguimiento georreferenciado de motorizados y repartidores (Riders).
- **Prestaciones Destacadas:**
  - Registro y validación KYC de Riders locales.
  - Mapas vectoriales interactivos en tiempo real con la API de Leaflet y CartoDB Voyager.
  - Cálculo dinámico de ETA (Tiempo Estimado de Arribo) y tracking del paquete.

---

### 2.4 Axis Nitro POS (El Punto de Venta Inteligente)
- **Propósito:** Facturación táctil ultrarrápida en caja registradora.
- **Presets por Industria (Feature Flags):**
  - **Preset Retail / Quick Store:** Habilita el escáner de código de barras. Al escanear, consulta el Catálogo Nacional y hace fallback a Open Food Facts para autocompletar foto y descripción del producto en milisegundos.
  - **Preset Restaurantes / Escandallos:** Control de mesas físicas y recetas de ingredientes pesados.
  - **Preset Balanzas IoT:** Conexión websocket directa con balanzas digitales de peso bruto/neto.
  - **Preset Hoteles / Hospedaje:** Control de habitaciones y consumos acumulados.

---

<a id="3-la-economía-de-axis-points-tokenomics--aof"></a>
## 🪙 CAPÍTULO III: LA ECONOMÍA DE AXIS POINTS (TOKENOMICS & AOF)

El ecosistema financiero de KFS se apoya en un programa de incentivos universales tokenizados, diseñado para retener al cliente dentro de la red local:

$$\mathbf{1,000\ Axis\ Points\ (AP) = \$1.00\ USD}$$

### 3.1 Reglas de Emisión (Minting)
1. **Cashback de Compra:** Los clientes acumulan el **1.0%** del total de sus compras físicas u online en saldo equivalente de **Axis Points**.
2. **Loyalty Comercio:** Si el local tiene activo el programa de lealtad, se genera adicionalmente **0.5 AP por cada $1.00 USD** de consumo.
3. **Bono Viral de Referidos (Referral Rewards):**
   - Al registrarse con un código amigo, el nuevo usuario recibe **+100 AP ($0.10 USD)**.
   - Cuando el referido realiza su primera recarga de al menos **$5.00 USD**, el recomendador recibe un bono de **+500 AP ($0.50 USD)**.

---

### 3.2 Reglas de Degradación de Saldo (Mecanismo Anti-Inflacionario AOF)
Para evitar que los puntos se acumulen indefinitivamente y pierdan velocidad de circulación, se aplica la tasa de penalización por inactividad **AOF (Asset Outflow Fee)**:
- Si una cuenta permanece inactiva por más de **15 días**, su saldo sufre una degradación progresiva del **0.5% cada 5 días**.
- El sistema emite alertas móviles advirtiendo de la degradación inminente para forzar al cliente a consumir sus puntos en los comercios de la red.

---

### 3.3 El Rango FlowMaster (Inmunidad Financiera)
Los clientes más leales pueden lograr **inmunidad vitalicia frente al AOF** al alcanzar el rango **FlowMaster**. Requisitos:
1. Haber completado un mínimo de **10 transacciones reales** en la red.
2. Haber comprado en al menos **4 comercios diferentes**.
3. Haber movilizado un volumen transaccional de al menos **50,000 Axis Points ($50.00 USD)** acumulados.

---

<a id="4-protocolos-de-seguridad-operativa-y-antifraude"></a>
## 🛡️ CAPÍTULO IV: PROTOCOLOS DE SEGURIDAD OPERATIVA Y ANTIFRAUDE

### 4.1 Conciliador Inteligente SMS (SMS Conciliator)
- **Mecanismo:** Intercepta y procesa notificaciones SMS bancarias recibidas en el dispositivo del comercio.
- **Algoritmo de Parseo:** Utiliza expresiones regulares para extraer Número de Referencia, Monto en Bolívares y Teléfono Emisor.
- **Validación Automática:** Compara la referencia y monto contra la orden en cola. Si coinciden con la tasa BCV del momento, la orden pasa a estado "Pagado", dispara el sonido `Premium Cash Chime` y emite el ticket de despacho sin intervención humana.

---

### 4.2 Protocolo Ghost Trap (Bloqueo Antifraude de Caja)
- **Mecanismo:** Detecta intentos deshonestos de anulación de tickets o borrado de productos una vez ingresados a la venta.
- **Acción:** El terminal POS **se bloquea automáticamente** e interrumpe la pantalla de cobro, registrando un log forense (`ghostLogs`).
- **Desbloqueo Requerido:** Clave del Supervisor local, Clave Maestra del Dueño del Negocio o Clave del Arquitecto Core (`199521`).

---

### 4.3 Sincro-Shield Fiscal Proxy
Conexión directa por agente local a impresoras fiscales homologadas por el SENIAT mediante comandos a puertos serie (RS232/USB), reduciendo a cero dólares el costo de licenciamiento fiscal.

---

<a id="5-directorio-de-producción-subdominios-y-ejecutables-exe--apk"></a>
## 🌐 CAPÍTULO V: DIRECTORIO DE PRODUCCIÓN, SUBDOMINIOS Y EJECUTABLES (EXE / APK)

### 5.1 Subdominios Oficiales en Vercel Cloud
Todas las aplicaciones del ecosistema están desplegadas en rutas dedicadas e interconectadas a la infraestructura en la nube:

| Subdominio Oficial en Vercel | Ruta Directa por Carpeta | Perfil / Rol Asignado | Función Operativa del Módulo |
| :--- | :--- | :--- | :--- |
| **`axisnitro.store`** | `https://axisnitro.store/` | **Público General** | **Portal Matriz & Landing Comercial:** Presentación del negocio, simulador de ganancias y formulario B2B. |
| **`rewards.axisnitro.store`** | `https://axisnitro.store/rewards` | **Cliente / Consumidor** | **App PWA de Recompensas:** Billetera de Axis Points (AP), tareas físicas y catálogo de vales. |
| **`arquitecto.axisnitro.store`** | `https://axisnitro.store/arquitecto` *(o `/core`)* | **El Arquitecto (`199521`)** | **Centro de Mando Core:** Vista de Dios, telemétrica, cotización BCV, gestor de recompensas e impresión QR. |
| **`comercio.axisnitro.store`** | `https://axisnitro.store/comercio` *(o `/client`)* | **Comercios / Dueños** | **Dashboard del Negocio:** Carga de productos en USD, tienda Nitro, CRM y Pago Móvil. |
| **`promotora.axisnitro.store`** | `https://axisnitro.store/promotora` | **Promotoras Digitales** | **Consola de Referidos:** Reclutamiento de comercios y cobro de comisiones pasivas en USD. |
| **`vendedor.axisnitro.store`** | `https://axisnitro.store/vendedor` | **Vendedores de Caja** | **Terminal Táctico POS:** Lector de código de barras, venta de mostrador y Ghost Trap. |
| **`rider.axisnitro.store`** | `https://axisnitro.store/rider` | **Riders de Delivery** | **Panel Logístico:** Recepción de pedidos a domicilio, confirmación de retiro y navegación GPS. |
| **`pos.axisnitro.store`** | `https://axisnitro.store/pos` | **Cajeros / Mostrador** | **Punto de Venta POS Simplificado:** Cobro directo en pantalla táctil. |
| **`download.axisnitro.store`** | `https://axisnitro.store/download-apk` | **Público General** | **Centro de Descargas PWA / APK:** Instalador oficial para Android e iOS. |

---

### 5.2 Archivos Ejecutables de Escritorio y Android APK (En tu Escritorio: `C:\Users\javier\Desktop\`)

1. 📱 **`Axis_Nitro_Rewards.apk`** (Tamaño: **3.68 MB**)
   - **Propósito:** Aplicación nativa Android instalable exclusivamente para la **App de Recompensas (Axis Points)**.
   - **Conectividad:** Configurada para conectarse en vivo y de forma permanente al servidor de producción `https://axisnitro.store/rewards`.
   - **Uso:** Lista para transferir por WhatsApp, correo o cable USB e instalar en cualquier dispositivo Android.

2. 💻 **`Axis_Nitro_POS.exe`** (Tamaño: **176.8 MB**)
   - **Propósito:** Aplicación ejecutable portátil nativa de escritorio para Windows.
   - **Conectividad:** Inicia el software de caja registradora POS y Centro de Mando en una ventana nativa de alta velocidad conectada a `https://axisnitro.store`.

3. 📦 **`Axis_Nitro_POS_Setup.exe`** (Tamaño: **107.4 MB**)
   - **Propósito:** Instalador completo de Windows para empaquetar e instalar la aplicación en computadoras de escritorio.

---

<a id="6-modelo-de-revenue-share-splits-en-caliente-y-proyecciones"></a>
## 📊 CAPÍTULO VI: MODELO DE REVENUE SHARE, SPLITS EN CALIENTE Y PROYECCIONES

El motor financiero distribuye los ingresos de forma inmediata mediante un modelo de **Splits en Caliente**:

| Concepto de Transacción | Costo Total | Comisión Promotora (Captadora) | Destino Core KFS | Objetivo del Split |
| :--- | :--- | :--- | :--- | :--- |
| **Setup de Comercio** | $75.00 USD *(Único)* | **$37.50 USD (50%)** *(Retiro Inmediato)* | $37.50 USD (50%) | Aprovisionamiento de base de datos Supabase y subdominio. |
| **Mantenimiento Nube** | $6.00 USD *(Mensual)* | **$3.00 USD (50%)** *(Residual)* | $3.00 USD (50%) | Servidores Vercel, logs de auditoría y webhooks SMS. |
| **Regalías de Caja (POS)** | 3% / 5% / 8% por venta | **20%** de la comisión recaudada | 80% KFS Core | Sustento de software. 20% del Core va directo a Ads locales. |
| **Desbloqueo KYC RRHH** | $10.00 USD *(Talento)* | **$2.00 USD (20%)** | $8.00 USD (80%) | Verificación de referencias de candidatos. |
| **Venta Axis Nitro Hub** | $20.00 USD *(Único)* | **$10.00 USD (50%)** | $10.00 USD (50%) | Habilitación de tienda E-Commerce independiente. |

---

### 6.1 Proyección Financiera para una Promotora Senior
Considerando una Promotora activa con una cartera madura de **22 comercios afiliados** en 12 meses:
- **15 Comercios Pequeños** (Venta promedio $5,000/mes a 3% fee) ➔ $450.00 USD/mes.
- **5 Comercios Medianos** (Venta promedio $25,000/mes a 5% fee) ➔ $1,265.00 USD/mes.
- **2 Cadenas Grandes** (Venta promedio $120,000/mes a 8% fee) ➔ $3,840.00 USD/mes.
- **SaaS Residual:** 22 × $3.00 = $66.00 USD/mes.
- **TOTAL INGRESOS RESIDUALES:** **$5,621.00 USD / mes de ganancia pasiva recurrente.**

---

<a id="7-informe-de-auditoría-e2e-de-flujos-demo-validados"></a>
## 🧪 CAPÍTULO VII: INFORME DE AUDITORÍA E2E DE FLUJOS DEMO VALIDADOS

Resultados empíricos de la auditoría punta a punta realizada en el software:

```
=========================================================
🚀 INICIANDO AUDITORÍA E2E DE FLUJOS DEMO KFS OS & AXIS NITRO
=========================================================

1. AUDITORÍA DE REGISTRO POR CADA ROL DEL ECOSISTEMA:
  [✓] Cliente Creado: Carlos Mendoza (Cliente Demo) | Email: cliente.demo@axisnitro.store | Balance Inicial: 0 AP
  [✓] Comercio Creado: Boutique Nitro Caracas | Email: comercio.demo@axisnitro.store | Tasa Fee: 3%
  [✓] Promotora Creada: Andrea Silva (Promotora Digital) | Código Referidos: PROMO-ANDREA-2026
  [✓] Rider Registrado: Jesús Gómez (Rider Delivery) | Vehículo: MOTOCICLETA

---------------------------------------------------------
2. AUDITORÍA DE PRIMERA RECARGA DE BILLETERA ($5.00 USD):
  [✓] Recarga Ejecutada: $5.00 USD
  [✓] Balance Cliente Actualizado: $5.00 USD | 2,000 AP (Axis Points)
  [✓] Comision Split Promotora: +$1.00 USD acreditados a Andrea Silva (Promotora Digital)

---------------------------------------------------------
3. AUDITORÍA DE CUMPLIMIENTO DE TAREA FÍSICA Y DESEMBOLSO AP:
  [1] Cliente envía comprobante de tarea: Escaneo QR en Tienda Axis Nitro
  [2] Estado inicial de la entrega: PENDING (En revisión)
  [3] Arquitecto (199521) aprueba entrega ➔ Estado: APPROVED
  [✓] Desembolso Atómico: +250 AP acreditados.
  [✓] Nuevo Balance Total del Cliente: 2,250 AP (Axis Points)

---------------------------------------------------------
4. AUDITORÍA DE CANJE DE PUNTOS POR VALE DE DESCUENTO:
  [✓] Canje Exitoso: 1,000 AP descontados.
  [✓] Vale Generado: VALE-KFS-17MGSX (Valor: $1.00 USD)
  [✓] Balance Restante del Cliente: 1,250 AP

---------------------------------------------------------
5. AUDITORÍA DE COMPRAS DEMO EN PUNTOS DE VENTA (POS):
  [Venta #1 - Preset: Retail / Barcode Scanner]
    Item: Harina PAN (1kg) - Barcode: 7591006000016
    Monto: $1.20 USD (894.77 VES Tasa BCV 745.64)
    Método: PAGO_MOVIL | Fee KFS (3%): $0.04 USD | Neto Comercio: $1.16 USD [✓]
  [Venta #2 - Preset: Restaurantes / Mesas & Escandallos]
    Item: Mesa 4: Parroquia Burger + Malta Polar
    Monto: $15.50 USD (11,557.42 VES Tasa BCV 745.64)
    Método: BINANCE_PAY | Fee KFS (3%): $0.46 USD | Neto Comercio: $15.04 USD [✓]
  [Venta #3 - Preset: Servicios / Citas & Barbería]
    Item: Cita: Corte Ejecutivo + Barba VIP
    Monto: $20.00 USD (14,912.80 VES Tasa BCV 745.64)
    Método: AXIS_POINTS | Fee KFS (3%): $0.60 USD | Neto Comercio: $19.40 USD [✓]

  [✓] Total Ventas Acumuladas del Comercio Demo: $36.70 USD

=========================================================
🎉 AUDITORÍA E2E COMPLETADA CON ÉXITO: 100% FUNCIONAL Y LISTA
=========================================================
```

---

<a id="8-guía-paso-a-paso-por-rol-del-ecosistema"></a>
## 🛠️ CAPÍTULO VIII: GUÍA PASO A PASO POR ROL DEL ECOSISTEMA

### 8.1 El Arquitecto Core (Código Maestro `199521`)
- **Acceso:** `https://axisnitro.store/arquitecto` ➔ Clave: **`199521`**.
- **Operaciones:**
  1. **Cotización BCV:** Ajustar el valor del Dólar/Euro en la barra superior.
  2. **Configurar Tareas de Recompensas (`⚡ Recompensas Nitro`):** Definir el nombre de la acción física, los Axis Points de recompensa (ej: `250 AP`) y la clave secreta QR o coordenadas GPS.
  3. **Imprimir Códigos QR:** Presionar **`🖨️ Ver QR`** para generar el gráfico SVG vectorizado e imprimir la ficha del comercio.
  4. **Aprobar Entregas de Usuarios:** En `📥 Entregas Recibidas`, revisar las fotos o datos y presionar **`🟢 Aprobar y Desembolsar +AP`** para acreditar los puntos atómicamente a la cuenta del usuario.

---

### 8.2 El Consumidor / Cliente (App PWA de Recompensas)
- **Acceso:** `https://axisnitro.store/rewards`.
- **Operaciones:**
  1. **Instalar PWA:** Presionar *"Añadir a la Pantalla de Inicio"*.
  2. **Consultar Saldo:** Ver balance en vivo de **Axis Points (AP)**.
  3. **Cumplir Tareas (`⚡ Acciones`):** Escanear el QR en caja, verificar ubicación GPS o subir foto de la factura.
  4. **Canjear Vales (`🎁 Canjes`):** Convertir puntos en cupones de descuento.

---

### 8.3 El Comercio / Dueño de Negocio (`/comercio`)
- **Acceso:** `https://axisnitro.store/comercio`.
- **Operaciones:**
  1. **Inventario:** Cargar productos con precio en USD y stock.
  2. **Cobro:** Vincular cuenta de Pago Móvil y Binance Pay.

---

### 8.4 La Promotora Digital (`/promotora`)
- **Acceso:** `https://axisnitro.store/promotora`.
- **Operaciones:**
  1. **Reclutar:** Compartir su enlace personal con dueños de tiendas.
  2. **Cobrar Comisiones:** Solicitar retiros a su cuenta bancaria.

---

### 8.5 El Vendedor de Caja (`/vendedor`)
- **Acceso:** `https://axisnitro.store/vendedor`.
- **Operaciones:**
  1. **Facturación:** Escanear códigos de barras o seleccionar ítems.
  2. **Procesar Pago:** Emitir recibo digital de cobro.

---

<a id="9-manual-comercial--estrategia-de-ventas-modo-ventas"></a>
## 💵 CAPÍTULO IX: MANUAL COMERCIAL & ESTRATEGIA DE VENTAS ("MODO VENTAS")

### 9.1 Ofertas Comerciales Activas
- **Plan Estándar Axis Nitro B2B:** **$20.00 USD / mes** + **3.0% por transacción**.
- **Oferta Comerciales Pioneros:** **$10.00 USD / mes** *(50% de descuento durante los primeros 3 meses)*.
- **Prueba Demo Gratuita:** **7 Días sin costo**.

---

<a id="10-guía-de-configuración-base-de-datos-supabase-y-sincronización-bcv"></a>
## ⚙️ CAPÍTULO X: GUÍA DE CONFIGURACIÓN, BASE DE DATOS SUPABASE Y SINCRONIZACIÓN BCV

### 10.1 Sincronización de Tasa Oficial BCV
El sistema se sincroniza continuamente cada 30 segundos con las fuentes oficiales del Banco Central de Venezuela:
- **DolarApi CDN:** `https://ve.dolarapi.com/v1/dolares/oficial`
- **Tasa Oficial BCV Actual:** **`745.64 Bs. / USD`** | **`805.29 Bs. / EUR`**

---

### 10.2 Esquema de Base de Datos PostgreSQL Supabase
La migración oficial `supabase/migrations/20260730000000_create_axis_nitro_rewards.sql` define la estructura SQL:

```sql
-- 1. Tabla de Estados Globales del CGOS (Offline Sync)
CREATE TABLE kfs_store_states (
  id TEXT PRIMARY KEY,
  db_state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Tabla para Nodos de E-Commerce (Axis Nitro Hubs)
CREATE TABLE axis_nitro_hubs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id),
    store_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla para Tareas de Recompensas
CREATE TABLE kfs_reward_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    points_reward INT NOT NULL DEFAULT 100,
    category TEXT NOT NULL DEFAULT 'SCAN_QR',
    verification_type TEXT NOT NULL DEFAULT 'AUTOMATIC_QR',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    target_audience TEXT NOT NULL DEFAULT 'ALL',
    qr_code_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

> [!NOTE]
> Este Libro Maestro compila la totalidad del White Paper, Arquitectura, Manual de Usuario, Informe de Ejecutables (EXE / APK), Certificado de Pruebas E2E y Estado de Producción de KFS OS & Axis Nitro Core. Todo el código fuente está disponible en el repositorio de GitHub y desplegado en vivo en `https://axisnitro.store`.
