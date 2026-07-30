# 📘 WHITE PAPER & MANUAL OPERATIVO INTEGRAL
## KFS OS (Kreatek Flow Systems) & Axis Nitro Core

**Versión del Sistema:** 8.0.0 (Edición Producción)  
**Fecha de Publicación:** 29 de Julio, 2026  
**Código Maestro del Arquitecto:** `199521`  
**Dominio Oficial en Vivo:** `https://axisnitro.store`  
**Repositorio GitHub:** `https://github.com/nextgendynamicai-sudo/kfs-os.git`

---

## 🏛️ CAPÍTULO I: WHITE PAPER & ARQUITECTURA TÉCNICA

### 1.1 Definición y Visión del Ecosistema
**KFS OS (Kreatek Flow Systems)** es un **Sistema Operativo para Redes Comerciales (CGOS - Commercial Grid Operating System)** diseñado para conectar comercios, consumidores, promotoras, vendedores y riders de delivery bajo un único ecosistema transaccional unificado. 

**Axis Nitro Core** constituye la capa de fidelización y liquidación financiera. Permite a los comercios eliminar los altos costos de adquisición y alquiler de equipos de punto de venta (POS) tradicionales de banca, reemplazándolos por una suite basada en la nube y la tecnología Web PWA accesible desde cualquier teléfono inteligente, tablet o laptop.

---

### 1.2 El Modelo Económico de Axis Points (AP)
El **Banco Central de Axis Points** gestiona la emisión, circulación y canje de la moneda de fidelización de la red: **Axis Points (AP)**.

- **Paridad de Valor:**  
  $$\text{1,000 Axis Points (AP)} = \$1.00\text{ USD}$$
- **Circulación Transaccional:**  
  Los clientes acumulan **Axis Points** por realizar compras en comercios afiliados o por cumplir **Acciones Físicas en la Vida Real** (escaneo de códigos QR en mostradores, visitas presenciales verificadas por GPS y subida de comprobantes de pago).
- **Liquidez y Canje:**  
  Los puntos acumulados en la Billetera Universal pueden convertirse instantáneamente en **vales de descuento real** en cualquier tienda física o digital de la red KFS.

---

### 1.3 Algoritmo de Persistencia Indestructible (Regla 1)
Toda la base de datos de cuentas de usuario, comercios, balances de **Axis Points**, historial de transacciones y tareas de recompensas se gestiona bajo el protocolo de fusión incremental `mergeDB` (`KFSContext.tsx`).

> [!IMPORTANT]
> **Garantía Invariable de Datos (Regla 1):**  
> Ninguna actualización de versión del software, despliegue en Vercel o sincronización en Supabase borra o resetea la información registrada por usuarios reales. El estado local en IndexedDB/LocalStorage y la nube en Supabase (`kfs_store_states`) se fusionan primero preservando siempre el conjunto existente.

---

## 🌐 CAPÍTULO II: DIRECTORIO OFICIAL DE RUTAS Y SUBDOMINIOS

Todas las aplicaciones del ecosistema están divididas en rutas dedicadas e independientes que pueden ser accedidas mediante subdominios DNS en Vercel o mediante rutas directas de carpeta:

| Subdominio Oficial | URL Directa por Carpeta | Perfil / Rol | Descripción y Función de la Aplicación |
| :--- | :--- | :--- | :--- |
| **`axisnitro.store`** | `https://axisnitro.store/` | **Público General** | **Portal Matriz & Landing Comercial:** Presentación del negocio, simulador de ganancias y formulario de registro B2B. |
| **`rewards.axisnitro.store`** | `https://axisnitro.store/rewards` | **Consumidor / Cliente** | **App PWA de Recompensas:** Billetera de Axis Points (AP), cumplimiento de tareas físicas y catálogo de vales. |
| **`arquitecto.axisnitro.store`** | `https://axisnitro.store/arquitecto` *(o `/core`)* | **El Arquitecto (`199521`)** | **Centro de Mando Core:** Vista de Dios, telemétrica, cotización BCV, gestor de recompensas y control de base de datos. |
| **`comercio.axisnitro.store`** | `https://axisnitro.store/comercio` *(o `/client`)* | **Comercios / Dueños** | **Dashboard del Negocio:** Carga de productos en USD, personalización de tienda Nitro, CRM y Pago Móvil/Binance. |
| **`promotora.axisnitro.store`** | `https://axisnitro.store/promotora` | **Promotoras Digitales** | **Consola de Referidos:** Reclutamiento de nuevos comercios y cobro de comisiones pasivas en dólares. |
| **`vendedor.axisnitro.store`** | `https://axisnitro.store/vendedor` | **Vendedores de Caja** | **Terminal Táctico POS:** Lector de código de barras, venta rápida de mostrador y trampa de seguridad Ghost Trap. |
| **`rider.axisnitro.store`** | `https://axisnitro.store/rider` | **Riders de Delivery** | **Panel Logístico:** Recepción de pedidos a domicilio, confirmación de retiro en local y navegación GPS de entrega. |
| **`pos.axisnitro.store`** | `https://axisnitro.store/pos` | **Cajeros / Mostrador** | **Punto de Venta POS Simplificado:** Cobro rápido en pantalla táctil sin menú ERP. |
| **`download.axisnitro.store`** | `https://axisnitro.store/download-apk` | **Público General** | **Centro de Descargas PWA / APK:** Instalador oficial para dispositivos Android e iOS. |

---

## 💼 CAPÍTULO III: MANUAL COMERCIAL & ESTRATEGIA DE VENTAS ("MODO VENTAS")

---

### 3.1 Argumentario de Ventas B2B para Afiliar Negocios
Al comercializar **Axis Nitro** con dueños de comercios (restaurantes, farmacias, panaderías, tiendas de ropa, supermercados), les presentas una solución 4 en 1 que elimina los costos operativos:

1. **Sin Alquiler de Equipos POS:** Tu teléfono o tablet se convierte en un punto de venta profesional con escáner de código de barras.
2. **Tienda Digital Nitro Instantánea:** Tu catálogo publicado en vivo en `axisnitro.store/nitro/[tu-nombre]`.
3. **Fidelización Automática:** Tus clientes ganan **Axis Points (AP)** y regresan a comprar a tu local.
4. **Protección Contra Estafas:** Validación automática de transferencias de Pago Móvil y Binance por lectura inteligente de SMS.

---

### 3.2 Planes y Estructura de Precios

- **Plan Estándar Axis Nitro B2B:**
  - **Inversión Inicial:** $0.00 USD.
  - **Mensualidad:** **$20.00 USD / mes**.
  - **Comisión por Transacción:** **3.0%**.
  - *Incluye:* POS Digital, Catálogo en línea, CRM de clientes y sistema de fidelización en Axis Points.
- **Oferta Comerciales Pioneros (Promoción de Lanzamiento):**
  - **$10.00 USD / mes** (50% de descuento durante los primeros 3 meses para los primeros 50 comercios de la ciudad).
- **Prueba Demo Gratuita (7 Días):**
  - **$0.00 USD** durante 7 días para probar el POS de caja con hasta 10 productos.

---

### 3.3 Escalera de Recargas de Usuarios y Comisiones Pasivas
Cuando un cliente recarga su billetera en la app, la plataforma distribuye comisiones automáticas a la promotora que lo reclutó:

- 💵 **Recarga de $5.00 USD:** Cliente obtiene $5.00 USD + **2,000 Axis Points de Bono**. Promotora gana **$1.00 USD pasivo**.
- 💵 **Recarga de $10.00 USD:** Cliente obtiene $10.00 USD + **5,000 Axis Points de Bono**. Promotora gana **$1.50 USD pasivo**.
- 💵 **Recarga de $20.00 USD:** Cliente obtiene $20.00 USD + **12,000 Axis Points de Bono**. Promotora gana **$2.00 USD pasivo**.

---

## 🛠️ CAPÍTULO IV: GUÍA OPERATIVA PASO A PASO POR ROL

---

### 4.1 El Arquitecto Core (Código Maestro `199521`)
- **Acceso:** `https://axisnitro.store/arquitecto` ➔ Clave: **`199521`**.
- **Operaciones:**
  1. **Ajuste de Tasa BCV:** Ingresa la tasa diaria oficial en Bolívares por Dólar/Euro en la barra superior.
  2. **Configurar Tareas de Recompensas (`⚡ Recompensas Nitro`):** Define el nombre de la acción física, los Axis Points de recompensa (ej: `250 AP`) y la clave secreta QR o coordenadas GPS.
  3. **Imprimir Códigos QR:** Presiona **`🖨️ Ver QR`** para generar el código SVG vectorizado e imprimir la ficha del comercio.
  4. **Aprobar Entregas de Usuarios:** En `📥 Entregas Recibidas`, examina las fotos o datos enviados y presiona **`🟢 Aprobar y Desembolsar +AP`** para acreditar los puntos con 1 solo clic.

---

### 4.2 El Consumidor / Cliente (App PWA de Recompensas)
- **Acceso:** `https://axisnitro.store/rewards`.
- **Operaciones:**
  1. **Instalación PWA:** Presiona *"Añadir a la Pantalla de Inicio"* para instalar el acceso directo en el celular.
  2. **Saldo de Billetera:** Consulta su balance en vivo de **Axis Points (AP)** y rango.
  3. **Cumplir Tareas Físicas (`⚡ Acciones`):**
     - *Escaneo QR:* Abre la cámara y escanea el QR en el mostrador de la tienda.
     - *Visita GPS:* Presiona *"Obtener Ubicación GPS"* para validar presencia en el local.
     - *Subida de Recibo:* Toma foto a la factura de compra y la envía a revisión.
  4. **Canjear Vales (`🎁 Canjes`):** Canjea sus **Axis Points** por cupones de descuento.

---

### 4.3 El Comercio / Dueño de Negocio (`/comercio`)
- **Acceso:** `https://axisnitro.store/comercio`.
- **Operaciones:**
  1. **Cargar Inventario:** Agrega productos con su costo en USD, fotos, categorías y stock.
  2. **Vincular Cuentas de Cobro:** Configura los datos de tu Pago Móvil y Binance Pay para recibir pagos directos.
  3. **CRM & Fidelización:** Activa el programa de puntos para tus clientes frecuentes.

---

### 4.4 La Promotora Digital (`/promotora`)
- **Acceso:** `https://axisnitro.store/promotora`.
- **Operaciones:**
  1. **Compartir Enlace Único:** Copia tu enlace personal de referidos.
  2. **Comisiones Pasivas:** Revisa en tiempo real el dinero acumulado por las ventas y recargas de tus comercios afiliados.
  3. **Solicitar Retiro:** Envía solicitudes de pago a tu cuenta bancaria o Pago Móvil.

---

### 4.5 El Vendedor de Caja (`/vendedor`)
- **Acceso:** `https://axisnitro.store/vendedor`.
- **Operaciones:**
  1. **Escaneo de Código de Barras:** Usa la cámara o lector físico para agregar productos al carrito.
  2. **Cobrar:** Selecciona Pago Móvil, Efectivo, Binance o Axis Points y emite el recibo digital.
  3. **Seguridad Ghost Trap:** Protocolo de bloqueo en caso de descuadre en caja.

---

### 4.6 El Rider de Delivery (`/rider`)
- **Acceso:** `https://axisnitro.store/rider`.
- **Operaciones:**
  1. Recibir alertas de pedidos listos para despacho.
  2. Confirmar retiro en el comercio y entrega en la dirección del cliente con firma o foto.

---

## ⚙️ CAPÍTULO V: GUÍA DE MANTENIMIENTO TÉCNICO & SERVIDORES

---

### 5.1 Despliegue en Vercel & Configuración DNS
El proyecto está vinculado al dominio principal `axisnitro.store` en Vercel. 

Para habilitar subdominios adicionales vía Vercel CLI o interfaz web:
- **Comando Vercel CLI:**
  ```bash
  npx vercel domains add rewards.axisnitro.store kfs-os
  ```
- **Registro DNS CNAME en Vercel:**
  - **Name:** `*`
  - **Type:** `CNAME`
  - **Value:** `cname.vercel-dns.com`

---

### 5.2 Esquema de Base de Datos Supabase SQL
La migración de la base de datos se encuentra archivada en `supabase/migrations/20260730000000_create_axis_nitro_rewards.sql` y crea las tablas `kfs_reward_tasks` y `kfs_reward_submissions` con políticas de seguridad RLS habilitadas.

---

> [!NOTE]
> Este documento constituye el White Paper y Manual Técnico Completo de Operaciones para KFS OS & Axis Nitro Core. Toda la plataforma está verificada, compilada en producción y lista para operar al 100%.
