const path = require('path');
const fs = require('fs');
const { readdir, copyFile, mkdir, rm, rmdir } = require('fs/promises');

async function readFile(file) {
    let data = '';
    const filePath = path.join(__dirname, 'components', file);
    const readFileStream = fs.createReadStream(filePath, 'utf-8');
    readFileStream.on('data', chunk => data += chunk);
    const end = new Promise((resolve, reject) => {
        readFileStream.on('end', () => resolve(data))
    });
    let res = await end;
    return res.split('\r\n');
}

(() => {
    fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
        if (err) throw err;
    });
    let templateData = '';
    const templatePath = path.join(__dirname, 'template.html');
    const indexPath = path.join(__dirname, 'project-dist', 'index.html');
    const readstream = fs.createReadStream(templatePath, 'utf-8');
    readstream.on('data', chunk => templateData += chunk);
    readstream.on('end', async () => {
        const dataArr = templateData.split('\n');
        const output = fs.createWriteStream(indexPath);
        for (let i = 0; i < dataArr.length; i++) {
            const str = dataArr[i];
            const tagStartPos = str.indexOf('{{');
            const tagEndPos = str.indexOf('}}');
            const subStr = str.slice(tagStartPos, tagEndPos + 2);
            if (subStr.length > 0) {
                const fileName = str.slice(tagStartPos + 2, tagEndPos);
                let compArr = await readFile(`${fileName}.html`)
                for (let i = 0; i < compArr.length; i++) {
                    const e = compArr[i];
                    output.write(e + '\n');
                }
            } else {
                output.write(str + '\n');
            }
        }
    });
})();

// CSS

const folderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

const output = fs.createWriteStream(bundlePath);
(async () => {
    let files = await readdir(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const ext = path.extname(filePath);
        if (ext === '.css') {
            const input = fs.createReadStream(filePath, 'utf-8');
            input.on('data', (chunk) => {
                output.write(chunk)
                if (chunk[chunk.length - 1] !== '\n') {
                    output.write('\n\n')
                }
            });
            input.on('error', error => console.log('Error', error.message));
        }
    }
})();


const assetsPath = path.join(__dirname, 'assets');
const copyFolderPath = path.join(__dirname, 'project-dist', 'assets');

async function copyDir(assetsPath, copyFolderPath) {
    let files = await readdir(assetsPath, { withFileTypes: true });
    mkdir(copyFolderPath, { recursive: true });
    for (const file of files) {
        if (file.isFile()) {
            let destination = path.join(copyFolderPath, file.name ? file.name : file);
            let filePath = path.join(assetsPath, file.name ? file.name : file)
            await copyFile(filePath, destination);
        }
        else {
            let newDirFrom = path.join(assetsPath, file.name);
            let newDirTo = path.join(copyFolderPath, file.name);
            copyDir(newDirFrom, newDirTo);
        }
    }
    update(files, copyFolderPath);
}

async function update(files, copyFolderPath) {
    let copyFiles = await readdir(copyFolderPath, { withFileTypes: true });
    for (const file of copyFiles) {
        if (file.isFile()) {
            let isFind = files.find(item => item.name === file.name);
            if (!isFind) {
                let delFilePath = path.join(copyFolderPath, file.name);
                rm(delFilePath);
            }
        }

        if (!file.isFile()) {
            let isFind = files.find(item => item.name === file.name);
            if (!isFind) {
                let delFilePath = path.join(copyFolderPath, file.name);
                rmdir(delFilePath);
            }
        }
    }
}

copyDir(assetsPath, copyFolderPath);