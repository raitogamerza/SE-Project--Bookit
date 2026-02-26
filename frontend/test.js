const fs = require('fs');

const content = fs.readFileSync('C:/Users/Chiba Mairu/Desktop/Bookit/frontend/src/pages/seller/AddBook.jsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    balance += opens - closes;
    if (line.includes('<form') || line.includes('</form')) {
        console.log(`Line ${i + 1}: form tag. Balance is ${balance}`);
    }
}
console.log(`Final balance: ${balance}`);
