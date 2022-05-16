const { readdir } = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, '/secret-folder');


(async () => {
    try {
        const files = await readdir(folderPath, { withFileTypes: true });
        for (const file of files)
            console.log(file);
    } catch (err) {
        console.error(err);
    }
})();
