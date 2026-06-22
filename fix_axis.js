const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && (filePath.endsWith('.ts') || filePath.endsWith('.tsx'))) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

let modifiedFiles = 0;

walkSync(srcDir, function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace "K-Point Cash" (case insensitive)
    content = content.replace(/K-Points?\s*Cash/gi, "Axis Cash");
    
    // Replace "K-Point Bonus" (case insensitive)
    content = content.replace(/K-Points?\s*Bonus/gi, "Axis Bonus");
    
    // Replace standalone "K-Point" or "K-Points" (case insensitive)
    content = content.replace(/K-Points?/gi, "Axis Points");

    // Replace "K Point" or "K Points" (without dash)
    content = content.replace(/K\s*Points?/gi, "Axis Points");

    // Replace "K$" (if used visually) but careful not to replace it if not needed.
    // We'll leave K$ alone unless specified, the user asked for K-Points.
    content = content.replace(/K\$/g, "A$"); // Let's leave K$ alone, they didn't specifically ask for A$, just Axis Points/Cash/Bonus.
    // Reverting K$ to A$ is risky, let's just do K-Points.
    content = original; // Reset
    
    content = content.replace(/K-Points?\s*Cash/gi, "Axis Cash");
    content = content.replace(/K-Points?\s*Bonus/gi, "Axis Bonus");
    // Only match K-Point(s) or K Point(s) if not followed by Cash or Bonus (which are already replaced)
    content = content.replace(/K-Points?/gi, "Axis Points");
    content = content.replace(/K\s+Points?/gi, "Axis Points");

    // Fix double replacement "Axis Points Cash" or "Axis Points Bonus" if regex ran out of order
    // (Wait, I run `K-Points Cash` -> `Axis Cash` first, so `Axis Cash` is already there. The third rule won't match `Axis Cash`.)
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFiles++;
        console.log(`Updated ${filePath}`);
    }
});

console.log(`\nRefactored ${modifiedFiles} files.`);
