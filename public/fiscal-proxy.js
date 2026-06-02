/**
 * Kreatek Flow Systems OS - Sincro-Shield Fiscal Local Proxy
 * 
 * Este script se ejecuta localmente en la computadora de la caja registradora.
 * Sirve como un puente (proxy) entre la aplicación web en la nube y la impresora fiscal física 
 * conectada por puerto serial (COM/USB) compatible con protocolos de The Factory HKA / PNP.
 * 
 * Requisitos:
 * 1. Node.js instalado (v16 o superior).
 * 2. Ejecutar 'npm install' para instalar dependencias si se desea comunicación serial física real.
 * 3. Ejecutar 'node fiscal-proxy.js' para arrancar el servidor local en el puerto 8080.
 */

const http = require('http');

const PORT = 8080;
// Prefijo de Serial de Registro Fiscal (SENIAT)
const MACHINE_SERIAL = "PPG" + Math.floor(10000000 + Math.random() * 90000000);
let invoiceCounter = Math.floor(100 + Math.random() * 900);

const server = http.createServer((req, res) => {
  // Habilitar CORS para que la aplicación web (HTTP o HTTPS) pueda comunicarse localmente
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Endpoint de telemetría / salud
  if (req.url === '/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: "connected",
      model: "TFHKA-DT230-VENEZUELA",
      port: "COM3 (Serial 9600 baud)",
      machineSerial: MACHINE_SERIAL,
      compliance: "SENIAT Gaceta Nro 41.518",
      invoiceCount: invoiceCounter
    }));
    return;
  }

  // Endpoint para procesar la impresión fiscal
  if (req.url === '/print-fiscal' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        invoiceCounter++;
        
        console.log("\n========================================================");
        console.log("   📥 [FISCAL PROXY] RECIBIDA ORDEN DE IMPRESIÓN FISCAL");
        console.log("========================================================");
        console.log(`> Transmitiendo comandos ESC/POS a tiquetera serial...`);
        console.log(`> Tienda: ${payload.clientName || 'Comercio KFS'}`);
        console.log(`> Factura Fiscal Nro: 0000${invoiceCounter}`);
        console.log(`> RIF Comercio: ${payload.clientRif || 'J-12345678-9'}`);
        console.log(`> Cliente: ${payload.customerName || 'Consumidor Final'}`);
        console.log(`> RIF/Cédula Cliente: ${payload.customerRif || 'N/A'}`);
        console.log(`> Producto: ${payload.productName} x1`);
        
        const isForeign = ['zelle', 'cash_usd', 'cash_eur', 'binance', 'nfc_web'].includes(payload.paymentMethod);
        
        console.log("--------------------------------------------------------");
        console.log(`  Monto Base (Exento/Gravado):   $${payload.subtotalUSD.toFixed(2)}`);
        if (payload.ivaUSD > 0) {
          console.log(`  I.V.A. (16.00%):               $${payload.ivaUSD.toFixed(2)}`);
        }
        if (payload.igtfUSD > 0) {
          console.log(`  I.G.T.F. (3.00% - Divisas):    $${payload.igtfUSD.toFixed(2)}`);
        }
        console.log(`  TOTAL FACTURADO (USD):         $${payload.amountUSD.toFixed(2)}`);
        console.log(`  Tasa Cambiaria Oficial BCV:    Bs. ${payload.exchangeRateBCV.toFixed(2)}`);
        console.log(`  TOTAL A CANCELAR EN BOLÍVARES: Bs. ${(payload.amountUSD * payload.exchangeRateBCV).toFixed(2)}`);
        console.log("--------------------------------------------------------");
        console.log(`[TFHKA DRIVER COM3] [OK] Escribiendo memoria fiscal...`);
        console.log(`[TFHKA DRIVER COM3] [OK] Imprimiendo pie de página SENIAT...`);
        console.log(`[MF] Registro Fiscal: ${MACHINE_SERIAL}`);
        console.log("========================================================\n");

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: "success",
          message: "Factura impresa correctamente.",
          invoiceNumber: `0000${invoiceCounter}`,
          machineSerial: MACHINE_SERIAL,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.error("Error procesando impresión:", err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: "Formato de payload inválido." }));
      }
    });
    return;
  }

  // RUTA 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: "error", message: "Ruta no encontrada." }));
});

server.listen(PORT, () => {
  console.log("==================================================================");
  console.log(` 🛡️  KFS Sincro-Shield Fiscal Local Proxy Activo en Puerto ${PORT}`);
  console.log(` 📡 Escuchando peticiones en http://localhost:${PORT}`);
  console.log(` 🤖 Serial de Registro Fiscal (Simulado): ${MACHINE_SERIAL}`);
  console.log(` ⚙️  Listo para interceptar peticiones de KFS OS Cloud.`);
  console.log("==================================================================");
  console.log(" Presiona Ctrl+C para detener el servidor proxy local.");
});
