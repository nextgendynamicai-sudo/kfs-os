const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && (filePath.endsWith('.tsx') || filePath.endsWith('.ts'))) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

let modifiedFiles = 0;

walkSync(srcDir, function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Fix literal string interpolations (e.g., "Centros Comerciales {KFS_BRAND.productAcronym}")
    // Case 1: JSX Attribute like  title="... {KFS_BRAND...} ..."
    content = content.replace(/=([ \n]*)["']([^"'\n]*)\{KFS_BRAND\.([^}]+)\}([^"'\n]*)["']/g, (match, space, p1, p2, p3) => {
        return `=${space}{\`${p1}\${KFS_BRAND.${p2}}${p3}\`}`;
    });
    // Run it twice in case there are multiple {KFS_BRAND.} in the same string? No, rare.

    // Case 2: Object key/value or normal JS like "Comercio {KFS_BRAND.productAcronym}"
    content = content.replace(/(?<!=)[\s:(\[]+["']([^"'\n]*)\{KFS_BRAND\.([^}]+)\}([^"'\n]*)["']/g, (match) => {
        return match.replace(/["'](.*)\{KFS_BRAND\.([^}]+)\}(.*)["']/, (m, p1, p2, p3) => {
            return `\`${p1}\${KFS_BRAND.${p2}}${p3}\``;
        });
    });

    // 2. Replace "KP" with "Axis Points" inside texts and literals
    // Be careful with classNames or IDs. We'll only replace ' KP ' or 'KP ' or ' KP.' or '(KP)'
    // Actually, "KP" is usually " 30.000 KP " or " K-Points (KP)"
    // The user wants "Axis Points" completely.
    content = content.replace(/\bKP\b/g, "Axis Points");
    // Some are "K-Points (KP)" -> "Axis Points (Axis Points)" which is redundant.
    content = content.replace(/Axis Points \(Axis Points\)/g, "Axis Points");
    content = content.replace(/\{KFS_BRAND\.economy\.currency\} \(Axis Points\)/g, "{KFS_BRAND.economy.currency}");

    // 3. Rename "Flow Express" to "Nitro" or "{KFS_BRAND.modules.marketplace}"
    // In JSX text:
    content = content.replace(/>([^<]*)Flow Express([^<]*)</g, (match, p1, p2) => {
        // If it's pure text, we can use {KFS_BRAND.modules.marketplace}
        return `>${p1}{KFS_BRAND.modules.marketplace}${p2}<`;
    });
    // In strings:
    content = content.replace(/["']([^"'\n]*)Flow Express([^"'\n]*)["']/g, (match, p1, p2) => {
        return `\`${p1}\${KFS_BRAND.modules.marketplace}${p2}\``;
    });
    // Also "Flow Express" in JS comments, let's leave it or replace to Nitro:
    content = content.replace(/\/\/.*Flow Express/g, (match) => match.replace("Flow Express", "Nitro"));

    // 4. Update the Architect store explicit text in KFSContext.tsx
    if (filePath.includes('KFSContext.tsx')) {
        content = content.replace(/"Arquitecto Flow Express"/g, `"Arquitecto Axis Points Reward"`);
        content = content.replace(/Asesoría con CEO y fundador/g, `Asesoría con CEO y fundador`);
        content = content.replace(/30\.000 KP/g, `30.000 Axis Points`);
        content = content.replace(/30000 KP/g, `30000 Axis Points`);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFiles++;
    }
});

console.log(`Refactored ${modifiedFiles} files.`);
