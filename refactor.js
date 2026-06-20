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

function getRelativeImport(filePath) {
    const dir = path.dirname(filePath);
    const configPath = path.join(__dirname, 'src', 'config', 'brandConfig');
    let rel = path.relative(dir, configPath).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    return `import { KFS_BRAND } from "${rel}";`;
}

let modifiedFiles = 0;

walkSync(srcDir, function(filePath) {
    if (filePath.includes('brandConfig.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. JSX Text Content (Between > and <)
    // We safely replace the exact words. We don't touch anything if it's not between > and <
    content = content.replace(/>([^<]+)</g, (match, inner) => {
        let newInner = inner;
        newInner = newInner.replace(/\bK-Points\b/g, "{KFS_BRAND.economy.currency}");
        newInner = newInner.replace(/\bMarketplace\b/g, "{KFS_BRAND.modules.marketplace}");
        newInner = newInner.replace(/\bPartner\b/g, "{KFS_BRAND.modules.partner}");
        newInner = newInner.replace(/\bKFS\b/g, "{KFS_BRAND.productAcronym}");
        // Also "Tienda" but only if capitalized to avoid breaking arbitrary words
        newInner = newInner.replace(/\bTienda\b/g, "{KFS_BRAND.modules.marketplace}");
        
        if (newInner !== inner) {
            return `>${newInner}<`;
        }
        return match;
    });

    // 2. String literals inside JS (backticks or quotes)
    // Specifically looking for showToast
    content = content.replace(/showToast\(([`"'])(.*?)([`"'])/g, (match, q1, inner, q2) => {
        let newInner = inner;
        newInner = newInner.replace(/\bK-Points\b/g, "${KFS_BRAND.economy.currency}");
        newInner = newInner.replace(/\bMarketplace\b/g, "${KFS_BRAND.modules.marketplace}");
        newInner = newInner.replace(/\bPartner\b/g, "${KFS_BRAND.modules.partner}");
        newInner = newInner.replace(/\bKFS\b/g, "${KFS_BRAND.productAcronym}");
        newInner = newInner.replace(/\bTienda\b/g, "${KFS_BRAND.modules.marketplace}");
        
        if (newInner !== inner) {
            return `showToast(\`${newInner}\``; // upgrade to template literal
        }
        return match;
    });

    // 3. String literals inside objects (e.g. titles in arrays)
    // specifically in OnboardingWizard or similar if they have title: "Marketplace"
    content = content.replace(/title:\s*([`"'])(.*?)([`"'])/g, (match, q1, inner, q2) => {
        let newInner = inner;
        newInner = newInner.replace(/\bK-Points\b/g, "${KFS_BRAND.economy.currency}");
        newInner = newInner.replace(/\bMarketplace\b/g, "${KFS_BRAND.modules.marketplace}");
        newInner = newInner.replace(/\bPartner\b/g, "${KFS_BRAND.modules.partner}");
        newInner = newInner.replace(/\bKFS\b/g, "${KFS_BRAND.productAcronym}");
        newInner = newInner.replace(/\bTienda\b/g, "${KFS_BRAND.modules.marketplace}");
        
        if (newInner !== inner) {
            return `title: \`${newInner}\``;
        }
        return match;
    });

    if (content !== originalContent) {
        if (!content.includes('import { KFS_BRAND }')) {
            const importStr = getRelativeImport(filePath) + "\n";
            // Insert after the last import
            const importRegex = /import\s+.*?;?\n/g;
            let lastIndex = 0;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                lastIndex = importRegex.lastIndex;
            }
            if (lastIndex > 0) {
                content = content.slice(0, lastIndex) + importStr + content.slice(lastIndex);
            } else {
                content = importStr + content;
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFiles++;
        console.log("Modified:", filePath);
    }
});

console.log(`Refactored ${modifiedFiles} files safely.`);
