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
        console.log('Папка project-dist была создана');
    });
    let templateData = '';
    const templatePath = path.join(__dirname, 'template.html');
    const indexPath = path.join(__dirname, 'project-dist', 'index.html');
    const readstream = fs.createReadStream(templatePath, 'utf-8');
    readstream.on('data', chunk => templateData += chunk);
    readstream.on('end', async () => {
        let resArr = [];
        const dataArr = templateData.split('\r\n');
        for (let i = 0; i < dataArr.length; i++) {
            const str = dataArr[i];
            if (str.replace(/\s/g, '') === '{{header}}') {
                let headerArr = await readFile('header.html')
                resArr.push(...headerArr);
            } else if (str.replace(/\s/g, '') === '{{articles}}') {
                let articlesArr = await readFile('articles.html')
                resArr.push(...articlesArr);
            } else if (str.replace(/\s/g, '') === '{{footer}}') {
                let footerArr = await readFile('footer.html')
                resArr.push(...footerArr);
            } else {
                resArr.push(str);
            }
        }
        const output = fs.createWriteStream(indexPath);
        for (let i = 0; i < resArr.length; i++) {
            const str = resArr[i];
            output.write(str + '\n');
        }
    });
})();







// const templatePath = path.join(__dirname, 'template.html');
// const articlesPath = path.join(__dirname, 'components', 'articles.html');
// const footerPath = path.join(__dirname, 'components', 'footer.html');
// const headerPath = path.join(__dirname, 'components', 'header.html');
// const indexPath = path.join(__dirname, 'project-dist', 'index.html')

// function buildPage() {
//     fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
//         if (err) throw err;
//         // console.log('Папка project-dist была создана');
//     });

//     fs.readFile(templatePath, 'utf8', (err, data) => {
//         let newArr = data.split('\r\n');
//         fs.readFile(headerPath, 'utf-8', (err, data) => {
//             let code = data.split('\r\n');
//             newArr = changeData(newArr, code, '{{header}}');
//             fs.readFile(articlesPath, 'utf-8', (err, data) => {
//                 let code = data.split('\r\n');
//                 newArr = changeData(newArr, code, '{{articles}}');
//                 fs.readFile(footerPath, 'utf-8', (err, data) => {
//                     let code = data.split('\r\n');
//                     newArr = changeData(newArr, code, '{{footer}}');
//                     console.log(newArr)
//                     // const output = fs.createWriteStream(indexPath);
//                     // for (let i = 0; i < newArr.length; i++) {
//                     //     const line = newArr[i];
//                     //     output.write(line + '\n');
//                     // }
//                 })
//             })
//         })
//     });


// }

// function changeData(arr, newData, line) {
//     let lineNumber = arr.findIndex(l => {
//         str = l.replace(/\s/g, '');
//         return str === line
//     });
//     if (lineNumber >= 0) {
//         let after = arr.slice(lineNumber + 1, arr.length);
//         arr.splice(lineNumber, lineNumber, ...newData);
//         arr.push(...after);
//     }
//     return arr;
//}

//buildPage();

// CSS


async function bundle() {
    const folderPath = path.join(__dirname, 'styles');
    const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
    let files = await readdir(folderPath);
    // clearFile();
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