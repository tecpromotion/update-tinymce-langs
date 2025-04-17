// scripts/format-lang-file.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = process.argv[2];

fs.readdirSync(dir).forEach((filename) => {
    if (!filename.endsWith('.es5.js')) return;

    const fullPath = path.join(dir, filename);
    const raw = fs.readFileSync(fullPath, 'utf8');

    try {
        const sandbox = {
            tinymce: {
                addI18n: (lang, content) => ({ lang, content })
            }
        };
        const script = new vm.Script(raw);
        const result = script.runInNewContext(sandbox);

        const formatted = `tinymce.addI18n('${result.lang.replace(/_/g, '-')}', ${JSON.stringify(result.content, null, 2)});\n`;

        fs.writeFileSync(fullPath, formatted, 'utf8');
    } catch (e) {
        console.warn(`⚠️ Error parsing ${filename}: ${e.message}`);
    }
});
