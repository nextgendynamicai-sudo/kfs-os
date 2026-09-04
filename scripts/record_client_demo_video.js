const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const FFMPEG_PATH = "C:\\Users\\javier\\AppData\\Local\\Programs\\Python\\Python311\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe";
const DESKTOP_DIR = "C:\\Users\\javier\\Desktop";
const OUTPUT_MP4 = path.join(DESKTOP_DIR, "video para cliente.mp4");
const OUTPUT_WITHOUT_EXT = path.join(DESKTOP_DIR, "video para cliente");
const RECORDINGS_DIR = path.resolve(__dirname, "../temp_recordings");

if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

// Clean previous temp recordings
const oldFiles = fs.readdirSync(RECORDINGS_DIR);
for (const f of oldFiles) {
  try { fs.unlinkSync(path.join(RECORDINGS_DIR, f)); } catch {}
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function smoothMouseMove(page, startX, startY, endX, endY, steps = 30) {
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    // Ease-in-out cubic
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const curX = startX + (endX - startX) * ease;
    const curY = startY + (endY - startY) * ease;
    await page.mouse.move(curX, curY);
    await sleep(15);
  }
}

async function run() {
  console.log("🎬 Iniciando grabación de video comercial en 2K vertical (9:16)...");

  const browser = await chromium.launch({
    headless: false, // Headed for high-fidelity animations, web audio & CSS render
    args: [
      '--window-size=1080,1920',
      '--disable-blink-features=AutomationControlled',
      '--enable-features=WebContentsForceDark:false',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 }, // 9:16 Vertical
    deviceScaleFactor: 2, // 2K Ultra HD High-DPI retina rendering
    recordVideo: {
      dir: RECORDINGS_DIR,
      size: { width: 1080, height: 1920 }
    }
  });

  // Inject visible custom pointer for tutorial clarity
  await context.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      const cursor = document.createElement('div');
      cursor.id = 'demo-touch-pointer';
      cursor.style.position = 'fixed';
      cursor.style.width = '34px';
      cursor.style.height = '34px';
      cursor.style.borderRadius = '50%';
      cursor.style.backgroundColor = 'rgba(124, 58, 237, 0.55)';
      cursor.style.border = '3px solid #ffffff';
      cursor.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.9), 0 0 40px rgba(124, 58, 237, 0.6)';
      cursor.style.pointerEvents = 'none';
      cursor.style.zIndex = '2147483647';
      cursor.style.transform = 'translate(-50%, -50%)';
      cursor.style.transition = 'transform 0.08s ease-out, background-color 0.12s, width 0.12s, height 0.12s';
      cursor.style.left = '-100px';
      cursor.style.top = '-100px';
      document.body.appendChild(cursor);

      window.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });
      window.addEventListener('mousedown', () => {
        cursor.style.backgroundColor = 'rgba(236, 72, 153, 0.85)';
        cursor.style.width = '42px';
        cursor.style.height = '42px';
      });
      window.addEventListener('mouseup', () => {
        cursor.style.backgroundColor = 'rgba(124, 58, 237, 0.55)';
        cursor.style.width = '34px';
        cursor.style.height = '34px';
      });
    });
  });

  const page = await context.newPage();

  console.log("📍 [1/6] Cargando Landing Page oficial...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.mouse.move(540, 600);
  await sleep(1500);

  // Smooth showcase scroll on landing page
  console.log("📜 Desplazando página de inicio para mostrar propuesta de valor...");
  for (let s = 0; s < 4; s++) {
    await page.mouse.wheel(0, 150);
    await sleep(350);
  }
  await sleep(1200);

  // Scroll back to top
  for (let s = 0; s < 4; s++) {
    await page.mouse.wheel(0, -150);
    await sleep(250);
  }
  await sleep(1000);

  // Click on "Afiliar Comercio (B2B)"
  console.log("👆 Haciendo clic en 'Afiliar Comercio (B2B)'...");
  const b2bBtn = page.locator('button:has-text("Afiliar Comercio (B2B)")').first();
  await b2bBtn.waitFor({ state: 'visible', timeout: 10000 });
  const b2bBox = await b2bBtn.boundingBox();
  if (b2bBox) {
    await smoothMouseMove(page, 540, 300, b2bBox.x + b2bBox.width / 2, b2bBox.y + b2bBox.height / 2, 25);
    await sleep(400);
    await page.mouse.click(b2bBox.x + b2bBox.width / 2, b2bBox.y + b2bBox.height / 2);
  } else {
    await b2bBtn.click();
  }

  await sleep(1500);

  // Step 1: Form Filling
  console.log("✍️ [2/6] Llenando Paso 1: Datos de Registro Comercial...");
  
  const companyInput = page.locator('input[placeholder*="Bodegón"]').first();
  await companyInput.scrollIntoViewIfNeeded();
  const compBox = await companyInput.boundingBox();
  if (compBox) {
    await smoothMouseMove(page, 540, 500, compBox.x + 50, compBox.y + compBox.height / 2, 20);
  }
  await companyInput.click();
  await sleep(200);
  await companyInput.pressSequentially("Bodegón Gourmet Caracas C.A.", { delay: 40 });
  await sleep(400);

  const emailInput = page.locator('input[type="email"]').first();
  await emailInput.click();
  await sleep(200);
  await emailInput.pressSequentially("gerencia@bodegongourmet.com", { delay: 35 });
  await sleep(400);

  const passwordInput = page.locator('input[type="password"]').first();
  await passwordInput.click();
  await sleep(200);
  await passwordInput.pressSequentially("kfs2026vip", { delay: 45 });
  await sleep(400);

  const phoneInput = page.locator('input[placeholder*="412"], input[placeholder*="0412"]').first();
  await phoneInput.click();
  await sleep(200);
  await phoneInput.pressSequentially("4129876543", { delay: 40 });
  await sleep(400);

  const rifInput = page.locator('input[placeholder*="J-"]').first();
  await rifInput.click();
  await sleep(200);
  await rifInput.pressSequentially("J-50123456-7", { delay: 40 });
  await sleep(400);

  const addressInput = page.locator('textarea').first();
  await addressInput.click();
  await sleep(200);
  await addressInput.pressSequentially("Av. Francisco de Miranda, C.C. Lido, Nivel Galería, Chacao, Caracas", { delay: 35 });
  await sleep(600);

  // Click "Continuar al Contrato"
  console.log("➡️ Avanzando al Paso 2...");
  const continueBtn = page.locator('button:has-text("Continuar al Contrato")').first();
  await continueBtn.scrollIntoViewIfNeeded();
  const contBox = await continueBtn.boundingBox();
  if (contBox) {
    await smoothMouseMove(page, 540, 700, contBox.x + contBox.width / 2, contBox.y + contBox.height / 2, 25);
    await sleep(300);
    await page.mouse.click(contBox.x + contBox.width / 2, contBox.y + contBox.height / 2);
  } else {
    await continueBtn.click();
  }

  await sleep(1500);

  // Step 2: Contract and Payment Reference
  console.log("📜 [3/6] Paso 2: Contrato Comercial & Setup Fee...");
  const contractCheckbox = page.locator('input[type="checkbox"]').first();
  await contractCheckbox.scrollIntoViewIfNeeded();
  const checkBx = await contractCheckbox.boundingBox();
  if (checkBx) {
    await smoothMouseMove(page, 540, 600, checkBx.x + checkBx.width / 2, checkBx.y + checkBx.height / 2, 20);
    await sleep(300);
    await page.mouse.click(checkBx.x + checkBx.width / 2, checkBx.y + checkBx.height / 2);
  } else {
    await contractCheckbox.check();
  }
  await sleep(800);

  // Select Pago Móvil
  console.log("💳 Seleccionando método de pago (Pago Móvil)...");
  const pagoMovilBtn = page.locator('button:has-text("Pago Móvil")').first();
  if (await pagoMovilBtn.isVisible()) {
    const pmBox = await pagoMovilBtn.boundingBox();
    if (pmBox) {
      await smoothMouseMove(page, 540, 700, pmBox.x + pmBox.width / 2, pmBox.y + pmBox.height / 2, 20);
      await sleep(250);
      await page.mouse.click(pmBox.x + pmBox.width / 2, pmBox.y + pmBox.height / 2);
    }
  }
  await sleep(800);

  // Enter reference
  const refInput = page.locator('input[placeholder*="dígitos"]').first();
  await refInput.click();
  await sleep(200);
  await refInput.pressSequentially("REF-9842510", { delay: 45 });
  await sleep(800);

  // Click "Pagar y Activar Comercio"
  console.log("🚀 Confirmando activación comercial...");
  const payBtn = page.locator('button:has-text("Pagar y Activar Comercio")').first();
  const payBox = await payBtn.boundingBox();
  if (payBox) {
    await smoothMouseMove(page, 540, 800, payBox.x + payBox.width / 2, payBox.y + payBox.height / 2, 20);
    await sleep(300);
    await page.mouse.click(payBox.x + payBox.width / 2, payBox.y + payBox.height / 2);
  } else {
    await payBtn.click();
  }

  await sleep(2000);

  // Step 3: Success & QR Standee
  console.log("🎉 [4/6] Paso 3: Activación Exitosa & Kit de Mostrador QR...");
  await page.mouse.move(540, 400);
  await sleep(1500);

  // Smooth showcase scroll of QR card
  for (let s = 0; s < 2; s++) {
    await page.mouse.wheel(0, 100);
    await sleep(300);
  }
  await sleep(1500);

  // Click "Ir a Terminal de Venta / POS"
  console.log("🛒 [5/6] Entrando al Punto de Venta Axis Nitro POS...");
  const gotoPosBtn = page.locator('button:has-text("Ir a Terminal de Venta / POS")').first();
  if (await gotoPosBtn.isVisible()) {
    const gBox = await gotoPosBtn.boundingBox();
    if (gBox) {
      await smoothMouseMove(page, 540, 900, gBox.x + gBox.width / 2, gBox.y + gBox.height / 2, 20);
      await sleep(300);
      await page.mouse.click(gBox.x + gBox.width / 2, gBox.y + gBox.height / 2);
    } else {
      await gotoPosBtn.click();
    }
  }

  await sleep(1500);

  // In POS interface: execute demonstration of sale with audio & thermal ticket
  console.log("⚡ [6/6] Demostración de venta y Efecto Parlante en Terminal POS...");
  await page.goto('http://localhost:3000/pos', { waitUntil: 'networkidle' });
  await sleep(1500);

  // Click "Confirmar Cobro" to trigger audio voice announcement and thermal receipt
  const chargeBtn = page.locator('button:has-text("Confirmar Cobro")').first();
  if (await chargeBtn.isVisible()) {
    const chBox = await chargeBtn.boundingBox();
    if (chBox) {
      await smoothMouseMove(page, 540, 700, chBox.x + chBox.width / 2, chBox.y + chBox.height / 2, 25);
      await sleep(400);
      await page.mouse.click(chBox.x + chBox.width / 2, chBox.y + chBox.height / 2);
    } else {
      await chargeBtn.click();
    }
  }

  // Allow thermal receipt printing animation and acoustic announcement to complete
  await sleep(4500);

  console.log("🏁 Finalizando sesión de navegación...");
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video
  const recordedFiles = fs.readdirSync(RECORDINGS_DIR).filter(f => f.endsWith('.webm'));
  if (recordedFiles.length === 0) {
    throw new Error("No se generó el archivo de grabación .webm en " + RECORDINGS_DIR);
  }

  const rawWebm = path.join(RECORDINGS_DIR, recordedFiles[0]);
  console.log(`🎥 Archivo sin procesar capturado: ${rawWebm}`);

  // FFmpeg Conversion to 2K (1440x2560), 60FPS, 1.1x speed, ultra quality
  console.log("⚙️ Procesando video con FFmpeg: 2K vertical (1440x2560), 60 FPS, velocidad 1.1x...");

  const ffmpegArgs = [
    '-i', rawWebm,
    '-filter:v', 'setpts=PTS/1.1,scale=1440:2560:flags=lanczos',
    '-r', '60',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-crf', '18',
    '-preset', 'slow',
    '-y', OUTPUT_MP4
  ];

  await new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG_PATH, ffmpegArgs);

    proc.stderr.on('data', (data) => {
      // ffmpeg writes progress to stderr
      const str = data.toString();
      if (str.includes('frame=') || str.includes('fps=')) {
        process.stdout.write(`\rTranscodificando: ${str.trim().slice(0, 70)}`);
      }
    });

    proc.on('close', (code) => {
      console.log("");
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg falló con código ${code}`));
      }
    });
  });

  // Also create a copy without extension as requested: "video para cliente"
  try {
    fs.copyFileSync(OUTPUT_MP4, OUTPUT_WITHOUT_EXT);
  } catch (err) {
    console.warn("No se pudo crear copia sin extensión:", err.message);
  }

  const stats = fs.statSync(OUTPUT_MP4);
  console.log(`✅ ¡Video generado con éxito total!`);
  console.log(`📁 Destino: ${OUTPUT_MP4}`);
  console.log(`📊 Tamaño: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

run().catch((err) => {
  console.error("❌ Error en generación de video:", err);
  process.exit(1);
});
