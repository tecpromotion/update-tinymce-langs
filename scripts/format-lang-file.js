// scripts/format-lang-file.js
const fs = require('fs');
const path = require('path');

const dir = process.argv[2]; // e.g. tmp_langs

fs.readdirSync(dir).forEach((filename) => {
    if (!filename.endsWith('.es5.js')) return;

    const fullPath = path.join(dir, filename);
    const raw = fs.readFileSync(fullPath, 'utf8');

    const match = raw.match(/tinymce\.addI18n\(["'](.+?)["']\s*,\s*(\{.*\})\);?/s);
    if (!match) {
        console.warn(`⚠️  File skipped: ${filename} (no match for addI18n)`);
        return;
    }

    const lang = match[1].replace(/_/g, '-'); // zh_TW → zh-TW
    const json = JSON.parse(match[2]);

    const formatted = `tinymce.addI18n('${lang}', ${JSON.stringify(json, null, 2)});\n`;

    fs.writeFileSync(fullPath, formatted, 'utf8');
});
