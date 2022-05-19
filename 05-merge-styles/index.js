const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const folderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundle() {
    let files = await readdir(folderPath);
    clearFile();
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const ext = path.extname(filePath);
        if (ext === '.css') {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                fs.appendFile(bundlePath, data + '\n', err => {
                    if (err) throw err;
                });
            })
        }
    }
}


function clearFile() {
    fs.truncate(bundlePath, err => {
        if (err) throw err; // не удалось очистить файл
    });
}

bundle();