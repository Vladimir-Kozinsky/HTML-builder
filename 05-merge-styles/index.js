const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const folderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

const output = fs.createWriteStream(bundlePath);
(async () => {
    let files = await readdir(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const ext = path.extname(filePath);
        if (ext === '.css') {
            const input = fs.createReadStream(filePath, 'utf-8');
            input.pipe(output);
            input.on('error', error => console.log('Error', error.message));
        }
    }
})();