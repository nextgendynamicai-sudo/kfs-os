/**
 * fix-forms.js
 * Fixes all form inputs to have visible placeholder text across the entire app.
 * Two key issues:
 * 1. placeholder:text-* classes missing from inputs (invisible on light bg)
 * 2. Some inputs have no placeholder at all (must infer from context)
 */
const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
const original = page;

let patchCount = 0;

// ─────────────────────────────────────────────────────────────────
// STRATEGY: For every input/textarea that has a placeholder, ensure
// it also has placeholder:text-gray-400 or placeholder:text-gray-500
// depending on context (dark vs light bg)
// ─────────────────────────────────────────────────────────────────

// Fix 1: All inputs with dark bg (violet-900/80) — add placeholder:text-gray-400
page = page.replace(
  /className=\{?`(w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-\[violet-600\] transition-all \$\{standalone \? "bg-\[violet-900\]\/80 border-\[violet-600\]\/50 text-white" : "bg-gray-50 border-gray-200 text-gray-900"\})`\}?/g,
  (match) => {
    if (match.includes('placeholder:')) return match;
    patchCount++;
    return match.replace(
      '"bg-gray-50 border-gray-200 text-gray-900"',
      '"bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"'
    ).replace(
      '"bg-[violet-900]/80 border-[violet-600]/50 text-white"',
      '"bg-[violet-900]/80 border-[violet-600]/50 text-white placeholder:text-gray-300"'
    );
  }
);

// Fix 2: All light-background standalone inputs (bg-gray-50) missing placeholder color
page = page.replace(
  /className="w-full bg-gray-50 border border-gray-200 rounded[-\w]* px-4 py-[0-9.]+ text-sm[^"]*"/g,
  (match) => {
    if (match.includes('placeholder:')) return match;
    patchCount++;
    return match.replace('"', '"').replace(/focus:ring-2[^"]*"/, (m) => m.replace(/"$/, ' placeholder:text-gray-400"'));
  }
);

// Fix 3: Dark bg inputs (bg-[violet-900]/80) missing placeholder color
page = page.replace(
  /className="w-full bg-\[violet-900\]\/80 border border-\[violet-600\]\/50 rounded[-\w]* px-4 py-[0-9.]+ text-sm text-white[^"]*"/g,
  (match) => {
    if (match.includes('placeholder:')) return match;
    patchCount++;
    return match.replace(/transition-all"$/, 'transition-all placeholder:text-gray-400"');
  }
);

// Fix 4: Neumorphic inputs (bg-[#EEF2F5] shadow-[inset...]) missing placeholder
page = page.replace(
  /className="[^"]*bg-\[#EEF2F5\] shadow-\[inset_2px_2px_5px_#d1d9e6[^"]*focus:outline-none[^"]*"/g,
  (match) => {
    if (match.includes('placeholder:')) return match;
    patchCount++;
    return match.replace(/focus:outline-none([^"]*)"/g, 'focus:outline-none$1 placeholder:text-gray-400"');
  }
);

// Fix 5: bg-white/5 (dark glass inputs in ClientDashboard/VendedorDashboard)
page = page.replace(
  /className="[^"]*bg-white\/5 border border-white\/10[^"]*placeholder:text-gray-[0-9]+[^"]*"/g,
  (match) => match  // already has placeholder
);
page = page.replace(
  /className="[^"]*bg-white\/[0-9]+ border border-white\/[^"]*focus:outline-none[^"]*text-white[^"]*"/g,
  (match) => {
    if (match.includes('placeholder:')) return match;
    patchCount++;
    return match.replace(/text-white([^"]*)"/g, 'text-white$1 placeholder:text-gray-500"');
  }
);

// ─────────────────────────────────────────────────────────────────
// Also fix specific forms with missing placeholders found in the scan
// ─────────────────────────────────────────────────────────────────

// Lines around 2365, 2375 — CustomerDashboard pin/phone inputs
// Lines around 2632, 2641, 2653 — TopUp modal inputs
// Lines around 2680 — textarea in TopUp
// Lines around 2718 — payout modal
// Lines around 2874, 2884 — oracle/filter inputs
// Lines around 5332, 5342, 5352 — StorefrontCustomizer
// Lines around 5848, 5856 — add product form
// Lines around 6124 — product description textarea
// Lines around 6445 — ClientDashboard search
// Lines around 6623 — business config
// Lines around 8448 — ticket textarea
// Lines around 8772, 8796 — vendedor forms

// Use line-by-line approach for inputs with no placeholder attribute at all
const lines = page.split('\n');
const inputsToFix = [
  // [lineIndex (0-based), placeholder text to add, field context]
  // These will be checked and fixed if they're missing placeholder
];

// Scan for inputs without placeholder and add sensible ones based on nearby context
let fixedMissing = 0;
const contextMap = {
  // line patterns → placeholder to inject
};

// Smart scan: look for <input type="text/number/email/password/tel"> with no placeholder 
// within 2 lines of a label or heading that gives context
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Only process actual text/number/email/password inputs (not file, checkbox, color, time)
  if (!line.includes('<input') && !line.includes('<textarea')) continue;
  if (line.includes('type="file"') || line.includes('type="checkbox"') || 
      line.includes('type="color"') || line.includes('type="time"') ||
      line.includes('type="date"') || line.includes('type="hidden"') ||
      line.includes('className="hidden"') || line.includes('className="sr-only"') ||
      line.includes('readOnly') || line.includes('ref={fileInputRef}')) continue;
  if (line.includes('placeholder=')) continue;  // already has placeholder
  
  // Look at surrounding lines for context
  const ctx = lines.slice(Math.max(0, i-5), Math.min(lines.length, i+3)).join(' ');
  
  let placeholder = null;
  
  if (ctx.match(/searchVendedor|Buscar vendedor/i)) placeholder = 'Buscar vendedor...';
  else if (ctx.match(/searchPromotora|Buscar promotora/i)) placeholder = 'Buscar promotora...';
  else if (ctx.match(/searchClient|Buscar cliente|Buscar comercio/i)) placeholder = 'Buscar comercio...';
  else if (ctx.match(/searchCustomer|Buscar customer|Buscar usuario/i)) placeholder = 'Buscar usuario...';
  else if (ctx.match(/monto|amount|Monto|Amount/i) && ctx.match(/USD|\$/)) placeholder = 'Monto $USD';
  else if (ctx.match(/monto|amount|Monto/i)) placeholder = 'Monto';
  else if (ctx.match(/referencia|reference|Referencia/i)) placeholder = 'Número de referencia';
  else if (ctx.match(/telefono|phone|Teléfono/i)) placeholder = 'Teléfono';
  else if (ctx.match(/password|contraseña|clave/i)) placeholder = 'Contraseña';
  else if (ctx.match(/email|correo/i)) placeholder = 'Correo electrónico';
  else if (ctx.match(/nombre|name/i)) placeholder = 'Nombre';
  else if (ctx.match(/producto|product/i)) placeholder = 'Nombre del producto';
  else if (ctx.match(/precio|price/i)) placeholder = 'Precio';
  else if (ctx.match(/descripcion|description/i)) placeholder = 'Descripción';
  else if (ctx.match(/direccion|address/i)) placeholder = 'Dirección';
  else if (ctx.match(/cedula|RIF|cedula/i)) placeholder = 'Cédula / RIF';
  else if (ctx.match(/empresa|company/i)) placeholder = 'Nombre de la empresa';
  else if (ctx.match(/nota|note|comment/i)) placeholder = 'Escribe aquí...';
  else if (ctx.match(/buscar|search|Search/i)) placeholder = 'Buscar...';
  else if (ctx.match(/codigo|code|barcode/i)) placeholder = 'Código de barras';
  else if (ctx.match(/ticket|Ticket/i)) placeholder = 'Describe tu consulta...';
  else if (ctx.match(/porcentaje|percentage|fee/i)) placeholder = 'Porcentaje (%)';
  else if (ctx.match(/pin|PIN/i)) placeholder = 'PIN';
  else if (ctx.match(/binance/i)) placeholder = 'Binance ID';
  else if (ctx.match(/pago movil|pagoMovil/i)) placeholder = 'Pago Móvil (0412...)';
  else if (ctx.match(/categoria|category/i)) placeholder = 'Categoría';
  else if (ctx.match(/lote|batch/i)) placeholder = 'Número de lote';
  else if (ctx.match(/number.*type|type.*number/i)) placeholder = '0';
  else placeholder = 'Ingresa aquí...';
  
  if (placeholder) {
    // Insert placeholder into this line
    // Find the end of the opening tag attributes  
    const trimmed = line.trimStart();
    const indent = line.slice(0, line.length - trimmed.length);
    
    if (trimmed.startsWith('<input')) {
      // Add placeholder right after <input
      lines[i] = lines[i].replace('<input', `<input placeholder="${placeholder}"`);
      fixedMissing++;
    } else if (trimmed.startsWith('<textarea')) {
      lines[i] = lines[i].replace('<textarea', `<textarea placeholder="${placeholder}"`);
      fixedMissing++;
    }
  }
}

page = lines.join('\n');

// Save
fs.writeFileSync('src/app/page.tsx', page);
console.log(`✅ Placeholder color fixes: ${patchCount}`);
console.log(`✅ Missing placeholder injections: ${fixedMissing}`);
console.log(`📏 File size: ${Math.round(fs.statSync('src/app/page.tsx').size / 1024)}KB`);

// Verify the RegisterClientForm specifically
const checkForm = fs.readFileSync('src/app/page.tsx', 'utf8');
const hasPlaceholderColor = checkForm.includes('placeholder:text-gray-400') || 
                             checkForm.includes('placeholder:text-gray-300') ||
                             checkForm.includes('placeholder:text-gray-500');
console.log(`✅ Placeholder colors present: ${hasPlaceholderColor}`);
