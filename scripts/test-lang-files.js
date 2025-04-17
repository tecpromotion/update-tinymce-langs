// scripts/test-lang-files.js
const fs = require('fs');
const path = require('path');

const dir = process.argv[2];
let failed = false;
let errorFiles = [];

fs.readdirSync(dir).forEach((filename) => {
    if (!filename.endsWith('.es5.js')) return;

    const filePath = path.join(dir, filename);
    const content = fs.readFileSync(filePath, 'utf8');

    const match = content.match(/tinymce\.addI18n\(['"]([a-z]{2}(?:-[A-Z]{2})?)['"]\s*,\s*(\{[\s\S]*\})\s*\);/);
    if (!match) {
        console.error(`❌ Invalid file: ${filename} — no valid tinymce.addI18n(...) block`);
        errorFiles.push(`- ${filename}: No valid tinymce.addI18n(...) block`);
        failed = true;
        return;
    }

    try {
        JSON.parse(match[2]);
    } catch (e) {
        console.error(`❌ Invalid JSON in file: ${filename}`);
        console.error(e.message);
        errorFiles.push(`- ${filename}: Invalid JSON: ${e.message}`);
        failed = true;
    }
});

if (failed) {
    fs.writeFileSync('language-file-errors.md', `## Invalid language files\n\n${errorFiles.join('\n')}\n`, 'utf8');
    console.error('\n🛑 Test failed. For details, see language-file-errors.md.');
    process.exit(1);
} else {
    console.log('✅ All language files are valid.');
}
