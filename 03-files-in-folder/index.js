const { readdir } = require('fs/promises');
const { stat } = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, '/secret-folder');

// FUNCTION WRITE FILES FROM SECRET FOLDER ONLY 

// (async () => {
//     try {
//         const files = await readdir(folderPath, { withFileTypes: true });
//         for (const file of files) {
//             if (file.isFile()) {
//                 let filePath = path.join(folderPath, file.name)
//                 stat(filePath, (err, stats) => {
//                     let nameParts = file.name.split('.');
//                     console.log(`${nameParts[0]} - ${nameParts[1]} - ${stats.size/1000}kb`)
//                 });
//             }
//         }
//     } catch (err) {
//         console.error(err);
//     }
// })();

// FUNCTION WRITE ALL FILES

async function filesFinder(folderPath) {
    try {
        const files = await readdir(folderPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                let filePath = path.join(folderPath, file.name)
                stat(filePath, (err, stats) => {
                    let nameParts = file.name.split('.');
                    console.log(`${nameParts[0]} - ${nameParts[1]} - ${stats.size / 1000}kb`)
                });
            } else {
                let newDir = path.join(__dirname, '/secret-folder', file.name);
                filesFinder(newDir);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

filesFinder(folderPath);
