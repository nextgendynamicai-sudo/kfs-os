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
    
    if (content.includes('"use client"') || content.includes("'use client'")) {
        // Remove all occurrences of "use client"
        let newContent = content.replace(/['"]use client['"];?\s*/g, '');
        
        // Add "use client"; at the very top
        newContent = '"use client";\n\n' + newContent;
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            modifiedFiles++;
        }
    }
});

console.log(`Fixed ${modifiedFiles} files.`);
