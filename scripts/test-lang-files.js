// scripts/test-lang-files.js
const fs = require('fs');
const path = require('path');

const dir = process.argv[2];
let errorFiles = [];

fs.readdirSync(dir).forEach((filename) => {
    if (!filename.endsWith('.es5.js')) return;

    const filePath = path.join(dir, filename);
    const content = fs.readFileSync(filePath, 'utf8');

    const match = content.match(/tinymce\.addI18n\(['"]([a-z]{2}(?:-[A-Z]{2})?)['"]\s*,\s*(\{[\s\S]*\})\s*\);/);
    if (!match) {
        console.warn(`⚠️ Skipping invalid file: ${filename} — no valid tinymce.addI18n(...) block`);
        errorFiles.push(`- ${filename}: No valid tinymce.addI18n(...) block`);
        fs.unlinkSync(filePath);
        return;
    }

    try {
        JSON.parse(match[2]);
    } catch (e) {
        console.warn(`⚠️ Skipping file with invalid JSON: ${filename}`);
        errorFiles.push(`- ${filename}: Invalid JSON: ${e.message}`);
        fs.unlinkSync(filePath);
    }
});

if (errorFiles.length > 0) {
    fs.writeFileSync('language-file-errors.md', `## Invalid language files\n\n${errorFiles.join('\n')}\n`, 'utf8');
    console.warn('⚠️ Some language files were skipped due to errors. See language-file-errors.md.');
} else {
    console.log('✅ All language files are valid.');
}
