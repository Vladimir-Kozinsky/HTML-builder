const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const folderPath = path.join(__dirname, 'styles');
const bundleFolderPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

// function clearFile() {
//     fs.truncate(bundlePath, err => {
//         if (err) throw err; // не удалось очистить файл
//     });
// }

const output = fs.createWriteStream(bundlePath);
(async () => {
    // const bundleFiles = await readdir(bundleFolderPath);
    // const isBundle = bundleFiles.find(file => file === 'bundle.css');
    // console.log(isBundle);
    // if (isBundle) {
    //   // clearFile();
    // }
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