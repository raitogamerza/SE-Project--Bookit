import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const replacements = [
    // Backgrounds
    { regex: /\bbg-white\b/g, replacement: 'bg-[var(--color-surface)]' },
    { regex: /\bbg-gray-50\b/g, replacement: 'bg-[var(--color-background)]' },
    { regex: /\bbg-gray-100\b/g, replacement: 'bg-[var(--color-secondary)]/10' },
    { regex: /\bbg-gray-200\b/g, replacement: 'bg-[var(--color-secondary)]/20' },

    // Text colors (Main)
    { regex: /\btext-gray-900\b/g, replacement: 'text-[var(--color-text-main)]' },
    { regex: /\btext-gray-800\b/g, replacement: 'text-[var(--color-text-main)]' },
    { regex: /\btext-gray-700\b/g, replacement: 'text-[var(--color-text-main)]' },
    { regex: /\btext-black\b/g, replacement: 'text-[var(--color-text-main)]' },

    // Text colors (Light/Muted)
    { regex: /\btext-gray-600\b/g, replacement: 'text-[var(--color-text-light)]' },
    { regex: /\btext-gray-500\b/g, replacement: 'text-[var(--color-text-light)]' },
    { regex: /\btext-gray-400\b/g, replacement: 'text-[var(--color-text-light)]' },
    { regex: /\btext-gray-300\b/g, replacement: 'text-[var(--color-secondary)]' },
    { regex: /\btext-white\b/g, replacement: 'text-[var(--color-text-inverse)]' },

    // Borders
    { regex: /\bborder-gray-100\b/g, replacement: 'border-[var(--color-secondary)]/10' },
    { regex: /\bborder-gray-200\b/g, replacement: 'border-[var(--color-secondary)]/20' },
    { regex: /\bborder-gray-300\b/g, replacement: 'border-[var(--color-secondary)]/30' },
    { regex: /\bborder-orange-100\b/g, replacement: 'border-[var(--color-secondary)]/10' },
    { regex: /\bborder-orange-200\b/g, replacement: 'border-[var(--color-secondary)]/20' }
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const { regex, replacement } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(srcDir);
console.log('Done replacing colors!');
