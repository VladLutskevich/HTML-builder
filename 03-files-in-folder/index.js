const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

fsPromises
    .readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
    .then(files => {
        files.forEach(file => {
            if (file.isFile()) {
                const filePath = path.join(__dirname, 'secret-folder', file.name);
                const fileExt = path.extname(filePath);
                const fileName = path.basename(filePath, fileExt);
                fs.stat(filePath, (err, stats) => {
                    console.log(`${fileName} - ${fileExt.slice(1)} - ${stats.size}b`);
                });
            }
        });
    });