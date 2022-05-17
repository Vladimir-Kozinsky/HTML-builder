const path = require('path');
const { readdir, copyFile, mkdir, rm } = require('fs/promises');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'copyFiles');

async function copyDir() {
    let files = await readdir(folderPath);
    mkdir(copyFolderPath, { recursive: true });
    for (const file of files) {
        let destination = path.join(copyFolderPath, file);
        let filePath = path.join(folderPath, file)
        await copyFile(filePath, destination);
    }
    update(files)
}

async function update(files) {
    let copyFiles = await readdir(copyFolderPath);
    for (const file of copyFiles) {
        let isFind = files.find(item => item === file);
        if (!isFind) {
            let delFilePath = path.join(copyFolderPath, file);
            rm(delFilePath);
        }
    }
}

copyDir();